

// Maneja las reservas relacionadas con tickets


import { Injectable } from '@angular/core';
import { InventoryReservation } from '../models/inventory-reservation.model';
import { InventoryReservationService } from './inventory-reservation.service';
import { InventoryService } from './inventory.service';

@Injectable({
  providedIn: 'root'
})
export class TicketInventoryService {

  constructor(
    private inventoryReservationService:
      InventoryReservationService,
      private inventoryService:
      InventoryService
  ) {}

  releaseTicketReservations(
    ticketId: string
  ): void {

    const reservations =
      this.inventoryReservationService
        .getByTicketId(ticketId);

    for (const reservation of reservations) {

      this.inventoryReservationService.release(
        reservation.id
      );
    }
  }


  consumeTicketReservations(
    ticketId: string,
    userId: string,
    shiftId?: string
  ): InventoryReservation[] {

    const reservations =
      this.inventoryReservationService
        .getByTicketId(ticketId);

    const consumedReservations:
      InventoryReservation[] = [];

    for (const reservation of reservations) {

      this.inventoryService.registerSale(
        reservation.productId,
        userId,
        reservation.quantity,
        shiftId,
        `Venta del ticket ${ticketId}`
      );

      const consumed =
        this.inventoryReservationService.consume(
          reservation.id
        );

      consumedReservations.push(consumed);
    }

    return consumedReservations;
  }

}