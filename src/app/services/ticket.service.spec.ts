import { TestBed } from '@angular/core/testing';

import { TicketService } from './ticket.service';
import { StorageService } from './storage.service';

describe('TicketService', () => {

  let service: TicketService;
  let storage: StorageService;

  const shiftId = 'shift-1';
  const otherShiftId = 'shift-2';

  const userId = 'user-1';
  const otherUserId = 'user-2';

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        TicketService,
        StorageService
      ]
    });

    service =
      TestBed.inject(TicketService);

    storage =
      TestBed.inject(StorageService);

    storage.clear();
  });

  afterEach(() => {
    storage.clear();
  });


  it('debería crear el servicio', () => {

    expect(service)
      .toBeTruthy();

  });


  it('debería devolver una lista vacía cuando no existen tickets', () => {

    expect(
      service.getAll()
    ).toEqual([]);

  });


  it('debería crear un ticket abierto', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    expect(ticket.id)
      .toBeTruthy();

    expect(ticket.shiftId)
      .toBe(shiftId);

    expect(ticket.userId)
      .toBe(userId);

    expect(ticket.number)
      .toBe(1);

    expect(ticket.status)
      .toBe('open');

    expect(ticket.createdAt)
      .toBeTruthy();

  });


  it('debería guardar el ticket creado', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    const tickets =
      service.getAll();

    expect(tickets.length)
      .toBe(1);

    expect(tickets[0].id)
      .toBe(ticket.id);

  });


  it('debería asignar números consecutivos dentro del mismo turno', () => {

    const ticket1 =
      service.create(
        shiftId,
        userId
      );

    const ticket2 =
      service.create(
        shiftId,
        userId
      );

    const ticket3 =
      service.create(
        shiftId,
        userId
      );

    expect(ticket1.number)
      .toBe(1);

    expect(ticket2.number)
      .toBe(2);

    expect(ticket3.number)
      .toBe(3);

  });


  it('debería comenzar nuevamente en 1 para otro turno', () => {

    const ticket1 =
      service.create(
        shiftId,
        userId
      );

    const ticket2 =
      service.create(
        otherShiftId,
        userId
      );

    expect(ticket1.number)
      .toBe(1);

    expect(ticket2.number)
      .toBe(1);

  });


  it('debería continuar el número aunque existan tickets de otros turnos', () => {

    service.create(
      otherShiftId,
      userId
    );

    service.create(
      otherShiftId,
      userId
    );

    const ticket =
      service.create(
        shiftId,
        userId
      );

    expect(ticket.number)
      .toBe(1);

  });


  it('debería obtener un ticket por ID', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    const result =
      service.getById(
        ticket.id
      );

    expect(result)
      .not.toBeNull();

    expect(result!.id)
      .toBe(ticket.id);

  });


  it('debería devolver null cuando el ticket no existe', () => {

    const result =
      service.getById(
        'ticket-inexistente'
      );

    expect(result)
      .toBeNull();

  });


  it('debería obtener los tickets de un turno', () => {

    service.create(
      shiftId,
      userId
    );

    service.create(
      shiftId,
      userId
    );

    service.create(
      otherShiftId,
      userId
    );

    const result =
      service.getByShiftId(
        shiftId
      );

    expect(result.length)
      .toBe(2);

    expect(
      result.every(
        ticket => ticket.shiftId === shiftId
      )
    ).toBeTrue();

  });


  it('debería marcar un ticket como pagado', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    const updated =
      service.markAsPaid(
        ticket.id
      );

    expect(updated.status)
      .toBe('paid');

    expect(updated.paidAt)
      .toBeTruthy();

    expect(updated.id)
      .toBe(ticket.id);

  });


  it('debería guardar el estado pagado', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    service.markAsPaid(
      ticket.id
    );

    const stored =
      service.getById(
        ticket.id
      );

    expect(stored!.status)
      .toBe('paid');

    expect(stored!.paidAt)
      .toBeTruthy();

  });


  it('no debería pagar un ticket inexistente', () => {

    expect(() =>
      service.markAsPaid(
        'ticket-inexistente'
      )
    ).toThrowError(
      'El ticket no existe.'
    );

  });


  it('no debería pagar nuevamente un ticket pagado', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    service.markAsPaid(
      ticket.id
    );

    expect(() =>
      service.markAsPaid(
        ticket.id
      )
    ).toThrowError(
      'El ticket no está abierto.'
    );

  });


  it('debería cancelar un ticket abierto', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    const cancelled =
      service.cancel(
        ticket.id,
        otherUserId,
        'Cliente canceló la orden'
      );

    expect(cancelled.status)
      .toBe('cancelled');

    expect(cancelled.cancelledBy)
      .toBe(otherUserId);

    expect(cancelled.cancellationReason)
      .toBe('Cliente canceló la orden');

    expect(cancelled.cancelledAt)
      .toBeTruthy();

  });


  it('debería cancelar un ticket sin motivo', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    const cancelled =
      service.cancel(
        ticket.id,
        otherUserId
      );

    expect(cancelled.status)
      .toBe('cancelled');

    expect(cancelled.cancelledBy)
      .toBe(otherUserId);

    expect(cancelled.cancelledAt)
      .toBeTruthy();

  });


  it('no debería cancelar un ticket inexistente', () => {

    expect(() =>
      service.cancel(
        'ticket-inexistente',
        userId
      )
    ).toThrowError(
      'El ticket no existe.'
    );

  });


  it('no debería cancelar un ticket que ya fue pagado', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    service.markAsPaid(
      ticket.id
    );

    expect(() =>
      service.cancel(
        ticket.id,
        otherUserId
      )
    ).toThrowError(
      'El ticket no está abierto.'
    );

  });


  it('debería eliminar un ticket abierto', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    const deleted =
      service.delete(
        ticket.id,
        otherUserId,
        'Ticket eliminado'
      );

    expect(deleted.status)
      .toBe('deleted');

    expect(deleted.deletedBy)
      .toBe(otherUserId);

    expect(deleted.deletionReason)
      .toBe('Ticket eliminado');

    expect(deleted.deletedAt)
      .toBeTruthy();

  });


  it('debería eliminar un ticket sin motivo', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    const deleted =
      service.delete(
        ticket.id,
        otherUserId
      );

    expect(deleted.status)
      .toBe('deleted');

    expect(deleted.deletedBy)
      .toBe(otherUserId);

    expect(deleted.deletedAt)
      .toBeTruthy();

  });


  it('no debería eliminar un ticket inexistente', () => {

    expect(() =>
      service.delete(
        'ticket-inexistente',
        userId
      )
    ).toThrowError(
      'El ticket no existe.'
    );

  });


  it('no debería eliminar un ticket que ya fue pagado', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    service.markAsPaid(
      ticket.id
    );

    expect(() =>
      service.delete(
        ticket.id,
        otherUserId
      )
    ).toThrowError(
      'El ticket no está abierto.'
    );

  });


  it('no debería eliminar un ticket que ya fue cancelado', () => {

    const ticket =
      service.create(
        shiftId,
        userId
      );

    service.cancel(
      ticket.id,
      otherUserId
    );

    expect(() =>
      service.delete(
        ticket.id,
        otherUserId
      )
    ).toThrowError(
      'El ticket no está abierto.'
    );

  });

});