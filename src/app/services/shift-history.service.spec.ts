import { TestBed } from '@angular/core/testing';

import { ShiftHistoryService } from './shift-history.service';
import { ShiftService } from './shift.service';
import { ShiftCloseReportService } from './shift-close-report.service';
import { TicketService } from './ticket.service';
import { StorageService } from './storage.service';
import { CashMovementService } from './cash-movement.service';
import { SaleService } from './sale.service';
import { ShiftSummaryService } from './shift-summary.service';

describe('ShiftHistoryService', () => {

    let service: ShiftHistoryService;
    let shiftService: ShiftService;

    beforeEach(() => {

    TestBed.configureTestingModule({
        providers: [
        ShiftHistoryService,
        ShiftService,
        ShiftCloseReportService,
        ShiftSummaryService,
        TicketService,
        StorageService,
        CashMovementService,
        SaleService
        ]
    });

    service =
        TestBed.inject(
        ShiftHistoryService
    );

    shiftService =
      TestBed.inject(
        ShiftService
      );

    localStorage.clear();
  });

  it('debería crearse', () => {

    expect(service)
      .toBeTruthy();
  });

  it('debería devolver un arreglo vacío cuando no existen turnos cerrados', () => {

    expect(
      service.getClosedShifts()
    ).toEqual([]);
  });

  it('debería devolver únicamente los turnos cerrados', async () => {

    const openShift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    await shiftService.closeShift(
      openShift.id,
      1000,
      'user-1'
    );

    const secondOpenShift =
      await shiftService.openShift(
        'user-2',
        1500
      );

    const closedShifts =
      service.getClosedShifts();

    expect(closedShifts.length)
      .toBe(1);

    expect(closedShifts[0].id)
      .toBe(openShift.id);

    expect(closedShifts[0].status)
      .toBe('closed');

    expect(closedShifts.find(
      shift =>
        shift.id === secondOpenShift.id
    ))
      .toBeUndefined();
  });

  it('debería obtener un turno cerrado por su id', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const closedShift =
      shiftService.closeShift(
        shift.id,
        1000,
        'user-1'
      );

    const result =
      service.getClosedShiftById(
        closedShift.id
      );

    expect(result)
      .not.toBeNull();

    expect(result!.id)
      .toBe(closedShift.id);

    expect(result!.status)
      .toBe('closed');
  });

  it('debería devolver null cuando el turno está abierto', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    const result =
      service.getClosedShiftById(
        shift.id
      );

    expect(result)
      .toBeNull();
  });

  it('debería devolver null cuando el turno no existe', () => {

    const result =
      service.getClosedShiftById(
        'shift-inexistente'
      );

    expect(result)
      .toBeNull();
  });

  it('debería obtener el reporte de cierre de un turno cerrado', async () => {

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
      service.getCloseReport(
        closedShift.id
      );

    expect(report)
      .toBeTruthy();

    expect(report.shiftId)
      .toBe(closedShift.id);

    expect(report.userId)
      .toBe('user-1');

    expect(report.summary.shiftId)
      .toBe(closedShift.id);

    expect(report.summary.initialCash)
      .toBe(1000);

    expect(report.summary.finalCash)
      .toBe(1200);

    expect(report.summary.cashDifference)
      .toBe(200);

    expect(report.cashMovements.length)
      .toBe(2);
  });

  it('debería rechazar el reporte de un turno abierto', async () => {

    const shift =
      await shiftService.openShift(
        'user-1',
        1000
      );

    expect(() =>
      service.getCloseReport(
        shift.id
      )
    ).toThrowError(
      /El turno cerrado no existe/
    );
  });

  it('debería rechazar el reporte de un turno inexistente', () => {

    expect(() =>
      service.getCloseReport(
        'shift-inexistente'
      )
    ).toThrowError(
      /El turno cerrado no existe/
    );
  });

});