import { Injectable } from '@angular/core';
import { InventoryReservation } from '../models/inventory-reservation.model';
import { StorageService } from './storage.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryReservationService {

  private readonly STORAGE_KEY =
    'inventory-reservations';

  constructor(
    private storage: StorageService,
    private productService: ProductService
  ) {}

  getAll(): InventoryReservation[] {

    return this.storage.get<InventoryReservation[]>(
      this.STORAGE_KEY
    ) ?? [];
  }

  // Buscar una reserva específica.
  getById(
    reservationId: string
  ): InventoryReservation | null {

    const reservations = this.getAll();

    return reservations.find(
      reservation =>
        reservation.id === reservationId
    ) ?? null;
  }

  getByProductId(
    productId: string
  ): InventoryReservation[] {

    const reservations = this.getAll();

    return reservations.filter(
      reservation =>
        reservation.productId === productId
    );
  }

  getByTicketId(
    ticketId: string
  ): InventoryReservation[] {

    const reservations = this.getAll();

    return reservations.filter(
      reservation =>
        reservation.ticketId === ticketId
    );
  }

  // Encontrar la reserva de una línea concreta.
  getByTicketItemId(
    ticketItemId: string
  ): InventoryReservation | null {

    const reservations = this.getAll();

    return reservations.find(
      reservation =>
        reservation.ticketItemId === ticketItemId
    ) ?? null;
  }


  // Suma todas las reservas activas.
  getReservedQuantity(
    productId: string
  ): number {

    const reservations =
      this.getByProductId(productId);

    return reservations.reduce(
      (total, reservation) =>
        total + reservation.quantity,
      0
    );
  }


  // Calcula: stock físico − stock reservado = stock disponible
  getAvailableStock(
    productId: string
  ): number {

    const product =
      this.productService.getById(productId);

    if (!product) {
      throw new Error(
        'El producto no existe.'
      );
    }

    const reserved =
      this.getReservedQuantity(productId);

    return product.stock - reserved;
  }

  hasEnoughAvailableStock(
    productId: string,
    quantity: number
  ): boolean {

    if (quantity <= 0) {
      throw new Error(
        'La cantidad debe ser mayor que cero.'
      );
    }

    return (
      this.getAvailableStock(productId)
      >= quantity
    );
  }

  // Crea la reserva inmediatamente.
  reserve(
    productId: string,
    ticketId: string,
    ticketItemId: string,
    quantity: number
  ): InventoryReservation {

    if (quantity <= 0) {
      throw new Error(
        'La cantidad debe ser mayor que cero.'
      );
    }

    const product =
      this.productService.getById(productId);

    if (!product) {
      throw new Error(
        'El producto no existe.'
      );
    }

    if (!product.isActive) {
      throw new Error(
        'El producto no está activo.'
      );
    }

    if (
      !this.hasEnoughAvailableStock(
        productId,
        quantity
      )
    ) {
      throw new Error(
        'No hay suficiente stock disponible.'
      );
    }

    const existingReservation =
      this.getByTicketItemId(ticketItemId);

    if (existingReservation) {
      throw new Error(
        'Ya existe una reserva para este producto del ticket.'
      );
    }

    const reservations = this.getAll();
    const now = new Date().toISOString();

    const newReservation: InventoryReservation = {
      id: crypto.randomUUID(),
      productId,
      ticketId,
      ticketItemId,
      quantity,
      createdAt: now,
      updatedAt: now
    };

    reservations.push(newReservation);

    this.storage.set(
      this.STORAGE_KEY,
      reservations
    );

    return newReservation;
  }


    // Aumenta la cantidad reservada de una línea del ticket.
    increase(
    reservationId: string,
    quantity: number
  ): InventoryReservation {

    if (quantity <= 0) {
      throw new Error(
        'La cantidad debe ser mayor que cero.'
      );
    }

    const reservations = this.getAll();

    const index = reservations.findIndex(
      reservation =>
        reservation.id === reservationId
    );

    if (index === -1) {
      throw new Error(
        'La reserva no existe.'
      );
    }

    const reservation = reservations[index];

    if (
      !this.hasEnoughAvailableStock(
        reservation.productId,
        quantity
      )
    ) {
      throw new Error(
        'No hay suficiente stock disponible.'
      );
    }

    const now = new Date().toISOString();

    const updatedReservation: InventoryReservation = {
      ...reservation,
      quantity:
        reservation.quantity + quantity,
      updatedAt: now
    };

    reservations[index] =
      updatedReservation;

    this.storage.set(
      this.STORAGE_KEY,
      reservations
    );

    return updatedReservation;
  }


    // Reduce la cantidad reservada.
    decrease(
    reservationId: string,
    quantity: number
  ): InventoryReservation {

    if (quantity <= 0) {
      throw new Error(
        'La cantidad debe ser mayor que cero.'
      );
    }

    const reservations = this.getAll();

    const index = reservations.findIndex(
      reservation =>
        reservation.id === reservationId
    );

    if (index === -1) {
      throw new Error(
        'La reserva no existe.'
      );
    }

    const reservation = reservations[index];

    if (quantity > reservation.quantity) {
      throw new Error(
        'No se puede reducir la reserva por encima de la cantidad reservada.'
      );
    }

    const newQuantity =
      reservation.quantity - quantity;

    if (newQuantity === 0) {

      return this.release(
        reservationId
      );
    }

    const now = new Date().toISOString();

    const updatedReservation: InventoryReservation = {
      ...reservation,
      quantity: newQuantity,
      updatedAt: now
    };

    reservations[index] =
      updatedReservation;

    this.storage.set(
      this.STORAGE_KEY,
      reservations
    );

    return updatedReservation;
  }



    consume(
    reservationId: string
  ): InventoryReservation {

    const reservation =
      this.getById(reservationId);

    if (!reservation) {
      throw new Error(
        'La reserva no existe.'
      );
    }

    const reservations = this.getAll();

    const index = reservations.findIndex(
      item =>
        item.id === reservationId
    );

    if (index === -1) {
      throw new Error(
        'La reserva no existe.'
      );
    }

    reservations.splice(index, 1);

    this.storage.set(
      this.STORAGE_KEY,
      reservations
    );

    return reservation;
  }

  
  
  // Libera esa reserva.
  release(
    reservationId: string
  ): InventoryReservation {

    const reservations = this.getAll();

    const index = reservations.findIndex(
      reservation =>
        reservation.id === reservationId
    );

    if (index === -1) {
      throw new Error(
        'La reserva no existe.'
      );
    }

    const reservation = reservations[index];

    reservations.splice(index, 1);

    this.storage.set(
      this.STORAGE_KEY,
      reservations
    );

    return reservation;
  }
}