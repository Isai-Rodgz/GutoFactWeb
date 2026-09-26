import { ShiftSummary } from './shift-summary.model';
import { CashMovement } from './cash-movement.model';

export interface ShiftCloseReport {

  // Información del turno
  shiftId: string;
  userId: string;

  openedAt: string;
  closedAt: string;

  openedBy: string;
  closedBy: string;

  // Resumen del turno
  summary: ShiftSummary;

  // Movimientos de caja
  cashMovements: CashMovement[];
}