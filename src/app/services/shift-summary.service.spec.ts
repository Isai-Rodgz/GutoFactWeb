import { TestBed } from '@angular/core/testing';

import { ShiftSummaryService } from './shift-summary.service';
import { ShiftService } from './shift.service';
import { TicketService } from './ticket.service';
import { SaleService } from './sale.service';
import { CashMovementService } from './cash-movement.service';
import { StorageService } from './storage.service';

describe('ShiftSummaryService', () => {

  let service: ShiftSummaryService;
  let storage: StorageService;
  let shiftService: ShiftService;
  let ticketService: TicketService;
  let saleService: SaleService;
  let cashMovementService: CashMovementService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        ShiftSummaryService,
        ShiftService,
        TicketService,
        SaleService,
        CashMovementService,
        StorageService
      ]
    });

    service =
      TestBed.inject(ShiftSummaryService);

    storage =
      TestBed.inject(StorageService);

    shiftService =
      TestBed.inject(ShiftService);

    ticketService =
      TestBed.inject(TicketService);

    saleService =
      TestBed.inject(SaleService);

    cashMovementService =
      TestBed.inject(CashMovementService);

    storage.clear();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería devolver un resumen sin tickets ni ventas', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const summary =
      service.getByShiftId(shift.id);

    expect(summary.shiftId)
      .toBe(shift.id);

    expect(summary.totalTickets)
      .toBe(0);

    expect(summary.openTickets)
      .toBe(0);

    expect(summary.paidTickets)
      .toBe(0);

    expect(summary.cancelledTickets)
      .toBe(0);

    expect(summary.deletedTickets)
      .toBe(0);

    expect(summary.totalSales)
      .toBe(0);

    expect(summary.cashSales)
      .toBe(0);

    expect(summary.cardSales)
      .toBe(0);

    expect(summary.transferSales)
      .toBe(0);

    expect(summary.initialCash)
      .toBe(1000);

    expect(summary.expectedCash)
      .toBe(1000);

    expect(summary.finalCash)
      .toBeUndefined();

    expect(summary.cashDifference)
      .toBeUndefined();
  });

  it('debería contar los tickets por estado', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const openTicket =
      ticketService.create(
        shift.id,
        'user-1'
      );

    const paidTicket =
      ticketService.create(
        shift.id,
        'user-1'
      );

    const cancelledTicket =
      ticketService.create(
        shift.id,
        'user-1'
      );

    const deletedTicket =
      ticketService.create(
        shift.id,
        'user-1'
      );

    ticketService.markAsPaid(
      paidTicket.id
    );

    ticketService.cancel(
      cancelledTicket.id,
      'user-1',
      'Cliente canceló'
    );

    ticketService.delete(
      deletedTicket.id,
      'user-1',
      'Ticket eliminado'
    );

    const summary =
      service.getByShiftId(shift.id);

    expect(summary.totalTickets)
      .toBe(4);

    expect(summary.openTickets)
      .toBe(1);

    expect(summary.paidTickets)
      .toBe(1);

    expect(summary.cancelledTickets)
      .toBe(1);

    expect(summary.deletedTickets)
      .toBe(1);

    expect(openTicket.status)
      .toBe('open');
  });

  it('debería sumar las ventas por método de pago', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    saleService.add(
      shift.id,
      'user-1',
      'ticket-1',
      100,
      'cash'
    );

    saleService.add(
      shift.id,
      'user-1',
      'ticket-2',
      200,
      'cash'
    );

    saleService.add(
    shift.id,
    'user-1',
    'ticket-3',
    300,
    'card',
    'CARD-001'
    );

    saleService.add(
    shift.id,
    'user-1',
    'ticket-4',
    400,
    'transfer',
    'TRANSFER-001'
    );


    const summary =
      service.getByShiftId(shift.id);

    expect(summary.totalSales)
      .toBe(1000);

    expect(summary.cashSales)
      .toBe(300);

    expect(summary.cardSales)
      .toBe(300);

    expect(summary.transferSales)
      .toBe(400);

    expect(summary.expectedCash)
      .toBe(1300);
  });

  it('debería ignorar ventas canceladas o reembolsadas', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const completedSale =
      saleService.add(
        shift.id,
        'user-1',
        'ticket-1',
        200,
        'cash'
      );

    const cancelledSale =
    saleService.add(
        shift.id,
        'user-1',
        'ticket-2',
        300,
        'card',
        'CARD-002'
    );

    const sales =
      saleService.getAll();

    const updatedSales =
      sales.map(sale => {

        if (sale.id === cancelledSale.id) {
          return {
            ...sale,
            status: 'cancelled' as const
          };
        }

        return sale;
      });

    storage.set(
      'sales',
      updatedSales
    );

    const summary =
      service.getByShiftId(shift.id);

    expect(completedSale.status)
      .toBe('completed');

    expect(summary.totalSales)
      .toBe(200);

    expect(summary.cashSales)
      .toBe(200);

    expect(summary.cardSales)
      .toBe(0);
  });

  it('debería incluir el efectivo final y la diferencia cuando el turno está cerrado', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const closedShift =
      shiftService.closeShift(
        shift.id,
        1200,
        'user-1'
      );

    const summary =
      service.getByShiftId(
        closedShift.id
      );

    expect(summary.finalCash)
      .toBe(1200);

    expect(summary.cashDifference)
      .toBe(200);

    expect(summary.expectedCash)
      .toBe(1000);
  });

  it('debería lanzar error si el turno no existe', () => {

    expect(() => {
      service.getByShiftId('shift-inexistente');
    }).toThrowError(
      'El turno no existe.'
    );
  });

});