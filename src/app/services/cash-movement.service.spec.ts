import { TestBed } from '@angular/core/testing';
import { CashMovementService } from './cash-movement.service';
import { StorageService } from './storage.service';

describe('CashMovementService', () => {

  let service: CashMovementService;
  let storage: StorageService;

  const shiftId = 'shift-1';
  const otherShiftId = 'shift-2';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CashMovementService,
        StorageService
      ]
    });

    service =
      TestBed.inject(CashMovementService);

    storage =
      TestBed.inject(StorageService);

    storage.clear();
  });


  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });


  it('debe retornar una lista vacía cuando no existen movimientos', () => {
    expect(service.getAll()).toEqual([]);
  });


  it('debe agregar un movimiento de caja', () => {
    const movement =
      service.add(
        shiftId,
        'opening',
        1000
      );

    expect(movement.id).toBeTruthy();
    expect(movement.shiftId).toBe(shiftId);
    expect(movement.type).toBe('opening');
    expect(movement.amount).toBe(1000);
    expect(movement.createdAt).toBeTruthy();
  });


  it('debe guardar el movimiento', () => {
    service.add(
      shiftId,
      'opening',
      1000
    );

    const movements =
      service.getAll();

    expect(movements.length).toBe(1);
    expect(movements[0].shiftId)
      .toBe(shiftId);
  });


  it('debe obtener los movimientos de un turno específico', () => {
    service.add(
      shiftId,
      'opening',
      1000
    );

    service.add(
      otherShiftId,
      'opening',
      2000
    );

    const movements =
      service.getByShiftId(shiftId);

    expect(movements.length).toBe(1);
    expect(movements[0].shiftId)
      .toBe(shiftId);
  });


  it('debe sumar los movimientos de apertura', () => {
    service.add(
      shiftId,
      'opening',
      1000
    );

    expect(
      service.getExpectedCash(shiftId)
    ).toBe(1000);
  });


  it('debe sumar las ventas en efectivo', () => {
    service.add(
      shiftId,
      'opening',
      1000
    );

    service.add(
      shiftId,
      'sale',
      500
    );

    service.add(
      shiftId,
      'sale',
      250
    );

    expect(
      service.getExpectedCash(shiftId)
    ).toBe(1750);
  });


  it('debe sumar los depósitos', () => {
    service.add(
      shiftId,
      'opening',
      1000
    );

    service.add(
      shiftId,
      'deposit',
      500
    );

    expect(
      service.getExpectedCash(shiftId)
    ).toBe(1500);
  });


  it('debe restar los retiros', () => {
    service.add(
      shiftId,
      'opening',
      1000
    );

    service.add(
      shiftId,
      'withdrawal',
      300
    );

    expect(
      service.getExpectedCash(shiftId)
    ).toBe(700);
  });


  it('debe restar los reembolsos', () => {
    service.add(
      shiftId,
      'opening',
      1000
    );

    service.add(
      shiftId,
      'refund',
      200
    );

    expect(
      service.getExpectedCash(shiftId)
    ).toBe(800);
  });


  it('debe ignorar los ajustes al calcular el efectivo esperado', () => {
    service.add(
      shiftId,
      'opening',
      1000
    );

    service.add(
      shiftId,
      'adjustment',
      500
    );

    expect(
      service.getExpectedCash(shiftId)
    ).toBe(1000);
  });


  it('debe ignorar los movimientos de cierre al calcular el efectivo esperado', () => {
    service.add(
      shiftId,
      'opening',
      1000
    );

    service.add(
      shiftId,
      'closing',
      1000
    );

    expect(
      service.getExpectedCash(shiftId)
    ).toBe(1000);
  });


  it('no debe incluir movimientos de otros turnos', () => {
    service.add(
      shiftId,
      'opening',
      1000
    );

    service.add(
      otherShiftId,
      'opening',
      5000
    );

    service.add(
      otherShiftId,
      'sale',
      1000
    );

    expect(
      service.getExpectedCash(shiftId)
    ).toBe(1000);
  });


  it('debe calcular correctamente una combinación de movimientos', () => {
    service.add(
      shiftId,
      'opening',
      1000
    );

    service.add(
      shiftId,
      'sale',
      1500
    );

    service.add(
      shiftId,
      'deposit',
      500
    );

    service.add(
      shiftId,
      'withdrawal',
      300
    );

    service.add(
      shiftId,
      'refund',
      200
    );

    service.add(
      shiftId,
      'adjustment',
      1000
    );

    service.add(
      shiftId,
      'closing',
      2300
    );

    expect(
      service.getExpectedCash(shiftId)
    ).toBe(2500);
  });

});