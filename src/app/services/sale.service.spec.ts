import { TestBed } from '@angular/core/testing';

import { SaleService } from './sale.service';
import { StorageService } from './storage.service';
import { CashMovementService } from './cash-movement.service';

describe('SaleService', () => {

  let service: SaleService;
  let storage: StorageService;
  let cashMovementService: CashMovementService;

  const shiftId = 'shift-1';
  const userId = 'user-1';
  const ticketId = 'ticket-1';

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        SaleService,
        StorageService,
        CashMovementService
      ]
    });

    service = TestBed.inject(SaleService);
    storage = TestBed.inject(StorageService);
    cashMovementService =
      TestBed.inject(CashMovementService);

    storage.clear();
  });


  it('debería crear una venta en efectivo', () => {

    const sale = service.add(
      shiftId,
      userId,
      ticketId,
      500,
      'cash'
    );

    expect(sale).toBeDefined();
    expect(sale.shiftId).toBe(shiftId);
    expect(sale.userId).toBe(userId);
    expect(sale.ticketId).toBe(ticketId);
    expect(sale.total).toBe(500);
    expect(sale.paymentMethod).toBe('cash');
    expect(sale.status).toBe('completed');

    const sales = service.getAll();

    expect(sales.length).toBe(1);
    expect(sales[0].id).toBe(sale.id);
  });


  it('debería crear una venta con tarjeta cuando tiene referencia', () => {

    const sale = service.add(
      shiftId,
      userId,
      ticketId,
      750,
      'card',
      'AUTH-123'
    );

    expect(sale.paymentMethod).toBe('card');
    expect(sale.paymentReference).toBe('AUTH-123');
    expect(sale.total).toBe(750);
    expect(sale.status).toBe('completed');
  });


  it('debería crear una venta por transferencia cuando tiene referencia', () => {

    const sale = service.add(
      shiftId,
      userId,
      ticketId,
      1000,
      'transfer',
      'TRX-123'
    );

    expect(sale.paymentMethod).toBe('transfer');
    expect(sale.paymentReference).toBe('TRX-123');
    expect(sale.total).toBe(1000);
  });


  it('no debería permitir una venta con total cero', () => {

    expect(() =>
      service.add(
        shiftId,
        userId,
        ticketId,
        0,
        'cash'
      )
    ).toThrowError(
      'El total de la venta debe ser mayor que cero.'
    );
  });


  it('no debería permitir una venta con total negativo', () => {

    expect(() =>
      service.add(
        shiftId,
        userId,
        ticketId,
        -100,
        'cash'
      )
    ).toThrowError(
      'El total de la venta debe ser mayor que cero.'
    );
  });


  it('debería exigir referencia para pagos con tarjeta', () => {

    expect(() =>
      service.add(
        shiftId,
        userId,
        ticketId,
        500,
        'card'
      )
    ).toThrowError(
      'Se requiere una referencia para este método de pago.'
    );
  });


  it('debería exigir referencia para pagos por transferencia', () => {

    expect(() =>
      service.add(
        shiftId,
        userId,
        ticketId,
        500,
        'transfer'
      )
    ).toThrowError(
      'Se requiere una referencia para este método de pago.'
    );
  });


  it('no debería aceptar una referencia vacía para tarjeta', () => {

    expect(() =>
      service.add(
        shiftId,
        userId,
        ticketId,
        500,
        'card',
        '   '
      )
    ).toThrowError(
      'Se requiere una referencia para este método de pago.'
    );
  });


  it('no debería aceptar una referencia vacía para transferencia', () => {

    expect(() =>
      service.add(
        shiftId,
        userId,
        ticketId,
        500,
        'transfer',
        '   '
      )
    ).toThrowError(
      'Se requiere una referencia para este método de pago.'
    );
  });


  it('debería crear un movimiento de caja para una venta en efectivo', () => {

    const sale = service.add(
      shiftId,
      userId,
      ticketId,
      500,
      'cash'
    );

    const movements =
      cashMovementService.getByShiftId(shiftId);

    expect(movements.length).toBe(1);
    expect(movements[0].type).toBe('sale');
    expect(movements[0].amount).toBe(500);
    expect(movements[0].shiftId).toBe(shiftId);
    expect(movements[0].description)
      .toBe(`Venta del ticket ${ticketId}`);
  });


  it('no debería crear movimiento de caja para una venta con tarjeta', () => {

    service.add(
      shiftId,
      userId,
      ticketId,
      500,
      'card',
      'AUTH-123'
    );

    const movements =
      cashMovementService.getByShiftId(shiftId);

    expect(movements.length).toBe(0);
  });


  it('no debería crear movimiento de caja para una transferencia', () => {

    service.add(
      shiftId,
      userId,
      ticketId,
      500,
      'transfer',
      'TRX-123'
    );

    const movements =
      cashMovementService.getByShiftId(shiftId);

    expect(movements.length).toBe(0);
  });


  it('debería obtener una venta por su ID', () => {

    const sale = service.add(
      shiftId,
      userId,
      ticketId,
      500,
      'cash'
    );

    const result =
      service.getById(sale.id);

    expect(result).toBeDefined();
    expect(result?.id).toBe(sale.id);
  });


  it('debería devolver null si la venta no existe', () => {

    const result =
      service.getById('sale-inexistente');

    expect(result).toBeNull();
  });


  it('debería obtener las ventas de un turno', () => {

    service.add(
      shiftId,
      userId,
      'ticket-1',
      100,
      'cash'
    );

    service.add(
      shiftId,
      userId,
      'ticket-2',
      200,
      'cash'
    );

    service.add(
      'shift-2',
      userId,
      'ticket-3',
      300,
      'cash'
    );

    const result =
      service.getByShiftId(shiftId);

    expect(result.length).toBe(2);
    expect(
      result.every(sale => sale.shiftId === shiftId)
    ).toBeTrue();
  });


  it('debería obtener las ventas de un ticket', () => {

    service.add(
      shiftId,
      userId,
      ticketId,
      100,
      'cash'
    );

    service.add(
      shiftId,
      userId,
      ticketId,
      200,
      'card',
      'AUTH-456'
    );

    service.add(
      shiftId,
      userId,
      'ticket-2',
      300,
      'cash'
    );

    const result =
      service.getByTicketId(ticketId);

    expect(result.length).toBe(2);

    expect(
      result.every(
        sale => sale.ticketId === ticketId
      )
    ).toBeTrue();
  });

});