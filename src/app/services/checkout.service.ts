import { Injectable } from '@angular/core';
import { Sale } from '../models/sale.model';
import { TicketService } from './ticket.service';
import { TicketItemService } from './ticket-item.service';
import { SaleService } from './sale.service';
import { TicketInventoryService } from './ticket-inventory.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private ticketService: TicketService,
    private ticketItemService: TicketItemService,
    private saleService: SaleService,
    private ticketInventoryService:
      TicketInventoryService
  ) {}


    //Cobro de un ticket 
    checkout(
        ticketId: string,
        paymentMethod: Sale['paymentMethod'],
        paymentReference?: string): Sale {

        const ticket =
        this.ticketService.getById(ticketId);

        if (!ticket) {
        throw new Error(
            'El ticket no existe.'
        );
        }

        if (ticket.status !== 'open') {
        throw new Error(
            'El ticket no está abierto.'
        );
        }

        const total =
        this.ticketItemService.getTicketTotal(
            ticketId
        );

        if (total <= 0) {
        throw new Error(
            'El ticket no tiene productos.'
        );
        }

        const sale =
        this.saleService.add(
            ticket.shiftId,
            ticket.userId,
            ticket.id,
            total,
            paymentMethod,
            paymentReference
        );

        
        this.ticketInventoryService
        .consumeTicketReservations(
            ticket.id,
            ticket.userId,
            ticket.shiftId
        );

        
        this.ticketService.markAsPaid(
        ticket.id
        );

        return sale;
    }

}