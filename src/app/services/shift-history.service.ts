import { Injectable } from '@angular/core';

import { Shift } from '../models/shift.model';
import { ShiftCloseReport } from '../models/shift-close-report.model';

import { ShiftService } from './shift.service';
import { ShiftCloseReportService } from './shift-close-report.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftHistoryService {

  constructor(
    private shiftService: ShiftService,
    private shiftCloseReportService: ShiftCloseReportService
  ) {}

  getClosedShifts(): Shift[] {

    return this.shiftService
      .getAll()
      .filter(
        shift => shift.status === 'closed'
      );
  }

  getClosedShiftById(
    shiftId: string
  ): Shift | null {

    const shift =
      this.shiftService
        .getAll()
        .find(
          shift => shift.id === shiftId
        );

    if (!shift || shift.status !== 'closed') {
      return null;
    }

    return shift;
  }

  getCloseReport(
    shiftId: string
  ): ShiftCloseReport {

    const shift =
      this.getClosedShiftById(
        shiftId
      );

    if (!shift) {
      throw new Error(
        'El turno cerrado no existe.'
      );
    }

    return this.shiftCloseReportService
      .getByShiftId(shiftId);
  }

}