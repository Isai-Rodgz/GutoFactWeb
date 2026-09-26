import { TestBed } from '@angular/core/testing';

import { CurrentShiftService } from './current-shift.service';
import { ShiftService } from './shift.service';
import { ShiftSummaryService } from './shift-summary.service';
import { CashMovementService } from './cash-movement.service';
import { TicketService } from './ticket.service';
import { StorageService } from './storage.service';

describe('CurrentShiftService', () => {

  let service: CurrentShiftService;

  let storage: StorageService;
  let shiftService: ShiftService;
  let cashMovementService: CashMovementService;
  let ticketService: TicketService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        CurrentShiftService,
        ShiftService,
        ShiftSummaryService,
        CashMovementService,
        TicketService,
        StorageService
      ]
    });

    service =
      TestBed.inject(
        CurrentShiftService
      );

    storage =
      TestBed.inject(
        StorageService
      );

    shiftService =
      TestBed.inject(
        ShiftService
      );

    cashMovementService =
      TestBed.inject(
        CashMovementService
      );

    ticketService =
      TestBed.inject(
        TicketService
      );

    storage.clear();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería devolver null cuando no existe un turno abierto', () => {

    expect(
      service.getCurrentShift()
    ).toBeNull();
  });

  it('debería indicar que no existe un turno abierto', () => {

    expect(
      service.hasOpenShift()
    ).toBeFalse();
  });

  it('debería devolver el turno actualmente abierto', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const currentShift =
      service.getCurrentShift();

    expect(currentShift)
      .not.toBeNull();

    expect(currentShift!.id)
      .toBe(shift.id);

    expect(currentShift!.status)
      .toBe('open');

    expect(currentShift!.userId)
      .toBe('user-1');
  });

  it('debería indicar que existe un turno abierto', async () => {

    await shiftService.openShift(
      'user-1',
      1000
    );

    expect(
      service.hasOpenShift()
    ).toBeTrue();
  });

  it('debería devolver el resumen del turno actual', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const summary =
      service.getCurrentSummary();

    expect(summary)
      .not.toBeNull();

    expect(summary!.shiftId)
      .toBe(shift.id);

    expect(summary!.initialCash)
      .toBe(1000);

    expect(summary!.expectedCash)
      .toBe(1000);

    expect(summary!.totalTickets)
      .toBe(0);

    expect(summary!.totalSales)
      .toBe(0);
  });

  it('debería devolver null en el resumen cuando no existe turno abierto', () => {

    expect(
      service.getCurrentSummary()
    ).toBeNull();
  });

  it('debería devolver los tickets del turno actual', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const ticket1 =
      ticketService.create(
        shift.id,
        'user-1'
      );

    const ticket2 =
      ticketService.create(
        shift.id,
        'user-1'
      );

    const tickets =
      service.getCurrentTickets();

    expect(tickets.length)
      .toBe(2);

    expect(
      tickets.some(
        ticket => ticket.id === ticket1.id
      )
    ).toBeTrue();

    expect(
      tickets.some(
        ticket => ticket.id === ticket2.id
      )
    ).toBeTrue();
  });

  it('debería devolver un arreglo vacío de tickets cuando no existe turno abierto', () => {

    expect(
      service.getCurrentTickets()
    ).toEqual([]);
  });

  it('debería devolver los movimientos de caja del turno actual', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    cashMovementService.add(
      shift.id,
      'deposit',
      500,
      'Depósito'
    );

    const movements =
      service.getCurrentCashMovements();

    expect(movements.length)
      .toBe(2);

    expect(
      movements.some(
        movement =>
          movement.type === 'opening'
      )
    ).toBeTrue();

    expect(
      movements.some(
        movement =>
          movement.type === 'deposit'
      )
    ).toBeTrue();
  });

  it('debería devolver un arreglo vacío de movimientos cuando no existe turno abierto', () => {

    expect(
      service.getCurrentCashMovements()
    ).toEqual([]);
  });

  it('debería trabajar únicamente con el turno abierto', async () => {

    const firstShift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const firstTicket =
    ticketService.create(
        firstShift.id,
        'user-1'
    );

    ticketService.markAsPaid(
    firstTicket.id
    );

    shiftService.closeShift(
    firstShift.id,
    1000,
    'user-1'
    );
    
    const secondShift =
      await shiftService.openShift(
        'user-2',
        2000
      );

    ticketService.create(
      secondShift.id,
      'user-2'
    );

    const currentShift =
      service.getCurrentShift();

    const tickets =
      service.getCurrentTickets();

    expect(currentShift!.id)
      .toBe(secondShift.id);

    expect(tickets.length)
      .toBe(1);

    expect(tickets[0].shiftId)
      .toBe(secondShift.id);
  });

});