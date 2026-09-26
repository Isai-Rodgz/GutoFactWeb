
import { TestBed } from '@angular/core/testing';

import { TicketManagementService } from './ticket-management.service';
import { StorageService } from './storage.service';
import { TicketService } from './ticket.service';
import { TicketItemService } from './ticket-item.service';
import { ProductService } from './product.service';
import { InventoryReservationService } from './inventory-reservation.service';
import { TicketInventoryService } from './ticket-inventory.service';

describe('TicketManagementService', () => {

  let service: TicketManagementService;
  let storage: StorageService;
  let ticketService: TicketService;
  let ticketItemService: TicketItemService;
  let productService: ProductService;
  let reservationService: InventoryReservationService;

  const userId = 'user-1';
  const otherUserId = 'user-2';
  const shiftId = 'shift-1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TicketManagementService,
        StorageService,
        TicketService,
        TicketItemService,
        ProductService,
        InventoryReservationService,
        TicketInventoryService
      ]
    });

    service =
      TestBed.inject(TicketManagementService);

    storage =
      TestBed.inject(StorageService);

    ticketService =
      TestBed.inject(TicketService);

    ticketItemService =
      TestBed.inject(TicketItemService);

    productService =
      TestBed.inject(ProductService);

    reservationService =
      TestBed.inject(
        InventoryReservationService
      );

    storage.clear();
  });

  afterEach(() => {
    storage.clear();
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe cancelar un ticket abierto y liberar sus reservas', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    const product =
      productService.create(
        'Hamburguesa',
        250,
        100,
        10,
        userId
      );

    ticketItemService.add(
      ticket.id,
      product.id,
      2
    );

    expect(
      reservationService
        .getByTicketId(ticket.id)
        .length
    ).toBe(1);

    const cancelled =
      service.cancel(
        ticket.id,
        otherUserId,
        'Cliente canceló el pedido'
      );

    expect(cancelled.status)
      .toBe('cancelled');

    expect(cancelled.cancelledBy)
      .toBe(otherUserId);

    expect(cancelled.cancellationReason)
      .toBe('Cliente canceló el pedido');

    expect(cancelled.cancelledAt)
      .toBeTruthy();

    expect(
      reservationService
        .getByTicketId(ticket.id)
        .length
    ).toBe(0);

    const storedTicket =
      ticketService.getById(ticket.id);

    expect(storedTicket)
      .not.toBeNull();

    expect(storedTicket!.status)
      .toBe('cancelled');
  });

  it('debe cancelar un ticket sin motivo', () => {

    const ticket =
      ticketService.create(
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

    expect(cancelled.cancellationReason)
      .toBeUndefined();
  });

  it('debe eliminar un ticket abierto y liberar sus reservas', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    const product =
      productService.create(
        'Pizza',
        400,
        150,
        10,
        userId
      );

    ticketItemService.add(
      ticket.id,
      product.id,
      3
    );

    expect(
      reservationService
        .getByTicketId(ticket.id)
        .length
    ).toBe(1);

    const deleted =
      service.delete(
        ticket.id,
        otherUserId,
        'Ticket creado por error'
      );

    expect(deleted.status)
      .toBe('deleted');

    expect(deleted.deletedBy)
      .toBe(otherUserId);

    expect(deleted.deletionReason)
      .toBe('Ticket creado por error');

    expect(deleted.deletedAt)
      .toBeTruthy();

    expect(
      reservationService
        .getByTicketId(ticket.id)
        .length
    ).toBe(0);

    const storedTicket =
      ticketService.getById(ticket.id);

    expect(storedTicket)
      .not.toBeNull();

    expect(storedTicket!.status)
      .toBe('deleted');
  });

  it('debe eliminar un ticket sin motivo', () => {

    const ticket =
      ticketService.create(
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

    expect(deleted.deletionReason)
      .toBeUndefined();
  });

  it('no debe cancelar un ticket inexistente', () => {

    expect(() =>
      service.cancel(
        'ticket-inexistente',
        userId
      )
    ).toThrowError(
      'El ticket no existe.'
    );
  });

  it('no debe eliminar un ticket inexistente', () => {

    expect(() =>
      service.delete(
        'ticket-inexistente',
        userId
      )
    ).toThrowError(
      'El ticket no existe.'
    );
  });

  it('no debe cancelar un ticket que ya está pagado', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    const product =
      productService.create(
        'Refresco',
        100,
        30,
        10,
        userId
      );

    ticketItemService.add(
      ticket.id,
      product.id,
      1
    );

    ticketService.markAsPaid(
      ticket.id
    );

    expect(() =>
      service.cancel(
        ticket.id,
        otherUserId,
        'Intento de cancelación'
      )
    ).toThrowError(
      'El ticket no está abierto.'
    );

    expect(
      reservationService
        .getByTicketId(ticket.id)
        .length
    ).toBe(1);
  });

  it('no debe eliminar un ticket que ya está pagado', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    const product =
      productService.create(
        'Papas',
        180,
        60,
        10,
        userId
      );

    ticketItemService.add(
      ticket.id,
      product.id,
      1
    );

    ticketService.markAsPaid(
      ticket.id
    );

    expect(() =>
      service.delete(
        ticket.id,
        otherUserId,
        'Intento de eliminación'
      )
    ).toThrowError(
      'El ticket no está abierto.'
    );

    expect(
      reservationService
        .getByTicketId(ticket.id)
        .length
    ).toBe(1);
  });

  it('no debe cancelar un ticket que ya está cancelado', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    service.cancel(
      ticket.id,
      userId,
      'Primera cancelación'
    );

    expect(() =>
      service.cancel(
        ticket.id,
        otherUserId,
        'Segunda cancelación'
      )
    ).toThrowError(
      'El ticket no está abierto.'
    );
  });

  it('no debe eliminar un ticket que ya está eliminado', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    service.delete(
      ticket.id,
      userId,
      'Primera eliminación'
    );

    expect(() =>
      service.delete(
        ticket.id,
        otherUserId,
        'Segunda eliminación'
      )
    ).toThrowError(
      'El ticket no está abierto.'
    );
  });

  it('debe conservar el ticket cancelado en el historial', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    service.cancel(
      ticket.id,
      otherUserId,
      'Cancelación'
    );

    const tickets =
      ticketService.getAll();

    expect(tickets.length)
      .toBe(1);

    expect(tickets[0].id)
      .toBe(ticket.id);

    expect(tickets[0].status)
      .toBe('cancelled');
  });

  it('debe conservar el ticket eliminado en el historial', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    service.delete(
      ticket.id,
      otherUserId,
      'Eliminación'
    );

    const tickets =
      ticketService.getAll();

    expect(tickets.length)
      .toBe(1);

    expect(tickets[0].id)
      .toBe(ticket.id);

    expect(tickets[0].status)
      .toBe('deleted');
  });


  it('debe restaurar las reservas si cancelar el ticket falla', () => {
  const ticket = ticketService.create(userId, shiftId);

  const product = productService.create(
    'Producto Test',
    100,
    50,
    10,
    userId
  );

  const item = ticketItemService.add(
    ticket.id,
    product.id,
    2
  );

  const reservationBefore =
    reservationService.getByTicketItemId(item.id);

  expect(reservationBefore).not.toBeNull();

  spyOn(ticketService, 'cancel').and.callFake(() => {
    throw new Error('Error simulado al cancelar ticket.');
  });

  expect(() =>
    service.cancel(
      ticket.id,
      userId,
      'Prueba rollback'
    )
  ).toThrowError(
    'Error simulado al cancelar ticket.'
  );

  const reservationAfter =
    reservationService.getByTicketItemId(item.id);

  expect(reservationAfter).not.toBeNull();
  expect(reservationAfter?.quantity).toBe(2);

  const ticketAfter =
    ticketService.getById(ticket.id);

  expect(ticketAfter?.status).toBe('open');
});


it('debe restaurar las reservas si eliminar el ticket falla', () => {
  const ticket = ticketService.create(userId, shiftId);

  const product = productService.create(
    'Producto Test',
    100,
    50,
    10,
    userId
  );

  const item = ticketItemService.add(
    ticket.id,
    product.id,
    2
  );

  const reservationBefore =
    reservationService.getByTicketItemId(item.id);

  expect(reservationBefore).not.toBeNull();

  spyOn(ticketService, 'delete').and.callFake(() => {
    throw new Error('Error simulado al eliminar ticket.');
  });

  expect(() =>
    service.delete(
      ticket.id,
      userId,
      'Prueba rollback'
    )
  ).toThrowError(
    'Error simulado al eliminar ticket.'
  );

  const reservationAfter =
    reservationService.getByTicketItemId(item.id);

  expect(reservationAfter).not.toBeNull();
  expect(reservationAfter?.quantity).toBe(2);

  const ticketAfter =
    ticketService.getById(ticket.id);

  expect(ticketAfter?.status).toBe('open');
});

});
