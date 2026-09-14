
// Maneja solamente el estado/datos del ticket

import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private readonly STORAGE_KEY = 'tickets';

  constructor(
    private storage: StorageService
  ) {}

    // Obtener todos los tickets
    getAll(): Ticket[] {

        return this.storage.get<Ticket[]>(
        this.STORAGE_KEY
        ) ?? [];

    }

    
    
    // Obtener un ticket por ID
    getById(ticketId: string): Ticket | null {

        const tickets = this.getAll();

        return tickets.find(
        ticket => ticket.id === ticketId
        ) ?? null;

    }


    
    // Obtener tickets de un turno
    getByShiftId(shiftId: string): Ticket[] {

        const tickets = this.getAll();

        return tickets.filter(
        ticket => ticket.shiftId === shiftId
        );

    }


    //Crear los tickets nuevos
    create(
    shiftId: string,
    userId: string): Ticket {

        const tickets = this.getAll();

        const shiftTickets = tickets.filter(
            ticket => ticket.shiftId === shiftId
        );

        const lastNumber = shiftTickets.reduce(
            (max, ticket) => Math.max(max, ticket.number),
            0
        );

        const now = new Date().toISOString();

        const newTicket: Ticket = {

            id: crypto.randomUUID(),

            shiftId,

            userId,

            number: lastNumber + 1,

            status: 'open',

            createdAt: now

        };

        tickets.push(newTicket);

        this.storage.set(
            this.STORAGE_KEY,
            tickets
        );

        return newTicket;
    }



    // Marcar ticket como pagado
    markAsPaid(
        ticketId: string): Ticket {

        const tickets = this.getAll();

        const index = tickets.findIndex(
        ticket => ticket.id === ticketId
        );

        if (index === -1) {
        throw new Error('El ticket no existe.');
        }

        const ticket = tickets[index];

        if (ticket.status !== 'open') {
        throw new Error(
            'El ticket no está abierto.'
        );
        }

        const updatedTicket: Ticket = {

        ...ticket,

        status: 'paid',

        paidAt: new Date().toISOString()

        };

        tickets[index] = updatedTicket;

        this.storage.set(
        this.STORAGE_KEY,
        tickets
        );

        return updatedTicket;
    }

    
    
    // Cancelar ticket
    cancel(
        ticketId: string,
        cancelledBy: string,
        reason?: string): Ticket {

        const tickets = this.getAll();

        const index = tickets.findIndex(
        ticket => ticket.id === ticketId
        );

        if (index === -1) {
        throw new Error('El ticket no existe.');
        }

        const ticket = tickets[index];

        if (ticket.status !== 'open') {
        throw new Error(
            'El ticket no está abierto.'
        );
        }

        const updatedTicket: Ticket = {

        ...ticket,

        status: 'cancelled',

        cancelledAt: new Date().toISOString(),

        cancelledBy,

        cancellationReason: reason

        };

        tickets[index] = updatedTicket;

        this.storage.set(
        this.STORAGE_KEY,
        tickets
        );

        return updatedTicket;
    }

    
    
    // Eliminar ticket de la vista activa
    delete(
        ticketId: string,
        deletedBy: string,
        reason?: string): Ticket {

        const tickets = this.getAll();

        const index = tickets.findIndex(
        ticket => ticket.id === ticketId
        );

        if (index === -1) {
        throw new Error('El ticket no existe.');
        }

        const ticket = tickets[index];

        if (ticket.status !== 'open') {
        throw new Error(
            'El ticket no está abierto.'
        );
        }

        const updatedTicket: Ticket = {

        ...ticket,

        status: 'deleted',

        deletedAt: new Date().toISOString(),

        deletedBy,

        deletionReason: reason

        };

        tickets[index] = updatedTicket;

        this.storage.set(
        this.STORAGE_KEY,
        tickets
        );

        return updatedTicket;
    }


}