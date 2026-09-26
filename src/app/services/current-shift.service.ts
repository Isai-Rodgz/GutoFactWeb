import { Injectable } from '@angular/core';

import { Shift } from '../models/shift.model';
import { ShiftSummary } from '../models/shift-summary.model';
import { CashMovement } from '../models/cash-movement.model';
import { Ticket } from '../models/ticket.model';

import { ShiftService } from './shift.service';
import { ShiftSummaryService } from './shift-summary.service';
import { CashMovementService } from './cash-movement.service';
import { TicketService } from './ticket.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentShiftService {

  constructor(
    private shiftService: ShiftService,
    private shiftSummaryService: ShiftSummaryService,
    private cashMovementService: CashMovementService,
    private ticketService: TicketService
  ) {}

  getCurrentShift(): Shift | null {
    return this.shiftService.getOpenShift();
  }

  hasOpenShift(): boolean {
    return this.getCurrentShift() !== null;
  }

  getCurrentSummary(): ShiftSummary | null {

    const shift =
      this.getCurrentShift();

    if (!shift) {
      return null;
    }

    return this.shiftSummaryService
      .getByShiftId(shift.id);
  }

  getCurrentTickets(): Ticket[] {

    const shift =
      this.getCurrentShift();

    if (!shift) {
      return [];
    }

    return this.ticketService
      .getByShiftId(shift.id);
  }

  getCurrentCashMovements(): CashMovement[] {

    const shift =
      this.getCurrentShift();

    if (!shift) {
      return [];
    }

    return this.cashMovementService
      .getByShiftId(shift.id);
  }
}