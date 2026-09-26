import { Injectable } from '@angular/core';

import { ShiftCloseReport } from '../models/shift-close-report.model';
import { ShiftService } from './shift.service';
import { ShiftSummaryService } from './shift-summary.service';
import { CashMovementService } from './cash-movement.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftCloseReportService {

  constructor(
    private shiftService: ShiftService,
    private shiftSummaryService: ShiftSummaryService,
    private cashMovementService: CashMovementService
  ) {}

  getByShiftId(
    shiftId: string
  ): ShiftCloseReport {

    const shift =
      this.shiftService
        .getAll()
        .find(
          shift => shift.id === shiftId
        );

    if (!shift) {
      throw new Error(
        'El turno no existe.'
      );
    }

    if (shift.status !== 'closed') {
      throw new Error(
        'El turno no está cerrado.'
      );
    }

    const summary =
      this.shiftSummaryService
        .getByShiftId(shiftId);

    const cashMovements =
      this.cashMovementService
        .getByShiftId(shiftId);

    return {
      shiftId: shift.id,
      userId: shift.userId,

      openedAt: shift.openedAt,
      closedAt: shift.closedAt!,

      openedBy: shift.openedBy,
      closedBy: shift.closedBy!,

      summary,

      cashMovements
    };
  }
}