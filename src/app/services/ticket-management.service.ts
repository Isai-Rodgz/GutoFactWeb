
// Coordina operaciones que afectan a los tickets (y sus estados) y las reservas de los tickets


import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { TicketService } from './ticket.service';
import { TicketInventoryService } from './ticket-inventory.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TicketManagementService {

  constructor(
    private ticketService: TicketService,
    private ticketInventoryService:
      TicketInventoryService,
    private storage: StorageService
  ) {}

  cancel(
    ticketId: string,
    cancelledBy: string,
    reason?: string
  ): Ticket {

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

    return this.storage.runTransaction(
      [
        'tickets',
        'inventory-reservations'
      ],
      () => {

        this.ticketInventoryService
          .releaseTicketReservations(
            ticketId
          );

        return this.ticketService.cancel(
          ticketId,
          cancelledBy,
          reason
        );
      }
    );
  }

  delete(
    ticketId: string,
    deletedBy: string,
    reason?: string
  ): Ticket {

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

    return this.storage.runTransaction(
      [
        'tickets',
        'inventory-reservations'
      ],
      () => {

        this.ticketInventoryService
          .releaseTicketReservations(
            ticketId
          );

        return this.ticketService.delete(
          ticketId,
          deletedBy,
          reason
        );
      }
    );
  }
}