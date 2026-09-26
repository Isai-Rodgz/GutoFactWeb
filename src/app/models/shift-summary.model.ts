export interface ShiftSummary {

  shiftId: string;

  // Tickets
  totalTickets: number;
  openTickets: number;
  paidTickets: number;
  cancelledTickets: number;
  deletedTickets: number;

  // Ventas
  totalSales: number;
  cashSales: number;
  cardSales: number;
  transferSales: number;

  // Caja
  initialCash: number;
  expectedCash: number;

  // Solo disponible cuando el turno está cerrado
  finalCash?: number;
  cashDifference?: number;
}