import { Injectable } from '@angular/core';
import { TicketItem } from '../models/ticket-item.model';
import { StorageService } from './storage.service';
import { TicketService } from './ticket.service';
import { ProductService } from './product.service';
import { InventoryReservationService } from './inventory-reservation.service';



@Injectable({
  providedIn: 'root'
})
export class TicketItemService {

  private readonly STORAGE_KEY = 'ticket-items';

  constructor(
    private storage: StorageService, private ticketService: TicketService,
    private productService: ProductService,private inventoryReservationService:
      InventoryReservationService) {}



    // Obtener todos los items
    getAll(): TicketItem[] {

        return this.storage.get<TicketItem[]>(
        this.STORAGE_KEY
        ) ?? [];

    }




    // Obtener los items de un ticket
    getByTicketId(
        ticketId: string): TicketItem[] {

        const items = this.getAll();

        return items.filter(
        item => item.ticketId === ticketId
        );

    }



    
    // Obtener un item por ID
    getById(
        itemId: string): TicketItem | null {

        const items = this.getAll();

        return items.find(
        item => item.id === itemId
        ) ?? null;

    }




    // Agregar un producto al ticket
    add(
        ticketId: string,
        productId: string,
        quantity: number,): TicketItem {

        const ticket =
        this.ticketService.getById(ticketId);

        if (!ticket) {
        throw new Error(
            'El ticket no existe.'
        );
        }

        if (ticket.status !== 'open') {
        throw new Error(
            'No se pueden agregar productos a un ticket que no está abierto.'
        );
        }

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


            return this.storage.runTransaction(
      [
        this.STORAGE_KEY,
        'inventory-reservations'
      ],
      () => {


        const items = this.getAll();

        const now = new Date().toISOString();

        const newItemId = crypto.randomUUID();


        const newItem: TicketItem = {

        id: newItemId,

        addedAt: now,

        ticketId,

        productId,

        quantity,

        unitPrice: product.price,

        subtotal: quantity * product.price

        };

        this.inventoryReservationService.reserve
        (productId,ticketId,newItemId,quantity);

        items.push(newItem);

        this.storage.set(
        this.STORAGE_KEY,
        items
        );

        return newItem;

        }
        );
    }

    
    
    
    // Obtener el total actual de un ticket
    getTicketTotal(
        ticketId: string): number {

        const items = this.getByTicketId(
        ticketId
        );

        return items.reduce(
        (total, item) => total + item.subtotal,
        0
        );

    }

}