import { Injectable } from '@angular/core';

import { ShiftSummary } from '../models/shift-summary.model';
import { ShiftService } from './shift.service';
import { TicketService } from './ticket.service';
import { SaleService } from './sale.service';
import { CashMovementService } from './cash-movement.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftSummaryService {

  constructor(
    private shiftService: ShiftService,
    private ticketService: TicketService,
    private saleService: SaleService,
    private cashMovementService: CashMovementService
  ) {}

    getByShiftId(
        shiftId: string
    ): ShiftSummary {

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

        const tickets =
        this.ticketService
            .getByShiftId(shiftId);

        const sales =
        this.saleService
            .getByShiftId(shiftId)
            .filter(
            sale => sale.status === 'completed'
            );

        const totalTickets =
        tickets.length;

        const openTickets =
        tickets.filter(
            ticket => ticket.status === 'open'
        ).length;

        const paidTickets =
        tickets.filter(
            ticket => ticket.status === 'paid'
        ).length;

        const cancelledTickets =
        tickets.filter(
            ticket => ticket.status === 'cancelled'
        ).length;

        const deletedTickets =
        tickets.filter(
            ticket => ticket.status === 'deleted'
        ).length;

        const totalSales =
        sales.reduce(
            (total, sale) =>
            total + sale.total,
            0
        );

        const cashSales =
        sales
            .filter(
            sale => sale.paymentMethod === 'cash'
            )
            .reduce(
            (total, sale) =>
                total + sale.total,
            0
            );

        const cardSales =
        sales
            .filter(
            sale => sale.paymentMethod === 'card'
            )
            .reduce(
            (total, sale) =>
                total + sale.total,
            0
            );

        const transferSales =
        sales
            .filter(
            sale => sale.paymentMethod === 'transfer'
            )
            .reduce(
            (total, sale) =>
                total + sale.total,
            0
            );

        const expectedCash =
        this.cashMovementService
            .getExpectedCash(shiftId);

        const summary: ShiftSummary = {
        shiftId,

        totalTickets,
        openTickets,
        paidTickets,
        cancelledTickets,
        deletedTickets,

        totalSales,
        cashSales,
        cardSales,
        transferSales,

        initialCash: shift.initialCash,
        expectedCash
        };

        if (shift.status === 'closed') {
        summary.finalCash =
            shift.finalCash;

        summary.cashDifference =
            shift.cashDifference;
        }

        return summary;
    }
}