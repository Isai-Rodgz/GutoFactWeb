import { TestBed } from '@angular/core/testing';

import { ShiftCloseReportService } from './shift-close-report.service';
import { ShiftService } from './shift.service';
import { ShiftSummaryService } from './shift-summary.service';
import { CashMovementService } from './cash-movement.service';
import { StorageService } from './storage.service';

describe('ShiftCloseReportService', () => {

  let service: ShiftCloseReportService;
  let storage: StorageService;
  let shiftService: ShiftService;
  let cashMovementService: CashMovementService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        ShiftCloseReportService,
        ShiftService,
        ShiftSummaryService,
        CashMovementService,
        StorageService
      ]
    });

    service =
      TestBed.inject(
        ShiftCloseReportService
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

    storage.clear();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería lanzar error si el turno no existe', () => {

    expect(() => {
      service.getByShiftId(
        'shift-inexistente'
      );
    }).toThrowError(
      'El turno no existe.'
    );
  });

  it('debería lanzar error si el turno está abierto', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    expect(() => {
      service.getByShiftId(
        shift.id
      );
    }).toThrowError(
      'El turno no está cerrado.'
    );
  });

  it('debería generar el reporte de un turno cerrado', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const closedShift =
      shiftService.closeShift(
        shift.id,
        1200,
        'user-2'
      );

    const report =
      service.getByShiftId(
        closedShift.id
      );

    expect(report.shiftId)
      .toBe(shift.id);

    expect(report.userId)
      .toBe('user-1');

    expect(report.openedAt)
      .toBe(shift.openedAt);

    expect(report.closedAt)
        .toBe(closedShift.closedAt!);
        
    expect(report.openedBy)
      .toBe('user-1');

    expect(report.closedBy)
      .toBe('user-2');
  });

  it('debería incluir el resumen del turno', async () => {

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

    const report =
      service.getByShiftId(
        closedShift.id
      );

    expect(report.summary.shiftId)
      .toBe(shift.id);

    expect(report.summary.initialCash)
      .toBe(1000);

    expect(report.summary.expectedCash)
      .toBe(1000);

    expect(report.summary.finalCash)
      .toBe(1200);

    expect(report.summary.cashDifference)
      .toBe(200);
  });

  it('debería incluir todos los movimientos de caja del turno', async () => {

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

    cashMovementService.add(
      shift.id,
      'withdrawal',
      200,
      'Retiro'
    );

    const closedShift =
      shiftService.closeShift(
        shift.id,
        1300,
        'user-1'
      );

    const report =
      service.getByShiftId(
        closedShift.id
      );

    expect(
      report.cashMovements.length
    ).toBe(4);

    expect(
      report.cashMovements.some(
        movement =>
          movement.type === 'opening'
      )
    ).toBeTrue();

    expect(
      report.cashMovements.some(
        movement =>
          movement.type === 'deposit'
      )
    ).toBeTrue();

    expect(
      report.cashMovements.some(
        movement =>
          movement.type === 'withdrawal'
      )
    ).toBeTrue();

    expect(
      report.cashMovements.some(
        movement =>
          movement.type === 'closing'
      )
    ).toBeTrue();
  });

  it('debería reflejar la diferencia positiva de caja', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const closedShift =
      shiftService.closeShift(
        shift.id,
        1150,
        'user-1'
      );

    const report =
      service.getByShiftId(
        closedShift.id
      );

    expect(
      report.summary.cashDifference
    ).toBe(150);
  });

  it('debería reflejar la diferencia negativa de caja', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const closedShift =
      shiftService.closeShift(
        shift.id,
        900,
        'user-1'
      );

    const report =
      service.getByShiftId(
        closedShift.id
      );

    expect(
      report.summary.cashDifference
    ).toBe(-100);
  });

});