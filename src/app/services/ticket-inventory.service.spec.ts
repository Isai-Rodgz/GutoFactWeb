import { TestBed } from '@angular/core/testing';
import { TicketInventoryService } from './ticket-inventory.service';
import { InventoryReservationService } from './inventory-reservation.service';
import { InventoryService } from './inventory.service';
import { ProductService } from './product.service';
import { StorageService } from './storage.service';

describe('TicketInventoryService', () => {

  let service: TicketInventoryService;
  let inventoryReservationService:
    InventoryReservationService;
  let inventoryService: InventoryService;
  let productService: ProductService;
  let storageService: StorageService;

  const userId = 'user-1';
  const shiftId = 'shift-1';
  const ticketId = 'ticket-1';

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        TicketInventoryService,
        InventoryReservationService,
        InventoryService,
        ProductService,
        StorageService
      ]
    });

    service =
      TestBed.inject(
        TicketInventoryService
      );

    inventoryReservationService =
      TestBed.inject(
        InventoryReservationService
      );

    inventoryService =
      TestBed.inject(
        InventoryService
      );

    productService =
      TestBed.inject(
        ProductService
      );

    storageService =
      TestBed.inject(
        StorageService
      );

    storageService.clear();
  });

  afterEach(() => {
    storageService.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should release all reservations belonging to a ticket', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        100,
        10,
        userId
      );

    const reservation1 =
      inventoryReservationService.reserve(
        product.id,
        ticketId,
        'ticket-item-1',
        2
      );

    const reservation2 =
      inventoryReservationService.reserve(
        product.id,
        ticketId,
        'ticket-item-2',
        3
      );

    expect(
      inventoryReservationService
        .getByTicketId(ticketId)
        .length
    ).toBe(2);

    service.releaseTicketReservations(
      ticketId
    );

    expect(
      inventoryReservationService
        .getById(reservation1.id)
    ).toBeNull();

    expect(
      inventoryReservationService
        .getById(reservation2.id)
    ).toBeNull();

    expect(
      inventoryReservationService
        .getByTicketId(ticketId)
        .length
    ).toBe(0);

    expect(
      inventoryReservationService
        .getAvailableStock(product.id)
    ).toBe(10);
  });

  it('should not release reservations belonging to another ticket', () => {

    const product =
      productService.create(
        'Pizza',
        300,
        120,
        10,
        userId
      );

    const ticketReservation =
      inventoryReservationService.reserve(
        product.id,
        ticketId,
        'ticket-item-1',
        2
      );

    const otherReservation =
      inventoryReservationService.reserve(
        product.id,
        'ticket-2',
        'ticket-item-2',
        3
      );

    service.releaseTicketReservations(
      ticketId
    );

    expect(
      inventoryReservationService
        .getById(ticketReservation.id)
    ).toBeNull();

    expect(
      inventoryReservationService
        .getById(otherReservation.id)
    ).not.toBeNull();

    expect(
      inventoryReservationService
        .getReservedQuantity(product.id)
    ).toBe(3);

    expect(
      inventoryReservationService
        .getAvailableStock(product.id)
    ).toBe(7);
  });

  it('should consume all reservations and register inventory sales', () => {

    const product1 =
      productService.create(
        'Hamburguesa',
        250,
        100,
        10,
        userId
      );

    const product2 =
      productService.create(
        'Pizza',
        300,
        120,
        8,
        userId
      );

    const reservation1 =
      inventoryReservationService.reserve(
        product1.id,
        ticketId,
        'ticket-item-1',
        2
      );

    const reservation2 =
      inventoryReservationService.reserve(
        product2.id,
        ticketId,
        'ticket-item-2',
        3
      );

    const consumed =
      service.consumeTicketReservations(
        ticketId,
        userId,
        shiftId
      );

    expect(consumed.length)
      .toBe(2);

    expect(consumed)
      .toContain(jasmine.objectContaining({
        id: reservation1.id,
        productId: product1.id,
        quantity: 2
      }));

    expect(consumed)
      .toContain(jasmine.objectContaining({
        id: reservation2.id,
        productId: product2.id,
        quantity: 3
      }));

    expect(
      inventoryReservationService
        .getByTicketId(ticketId)
        .length
    ).toBe(0);

    const updatedProduct1 =
      productService.getById(product1.id);

    expect(updatedProduct1?.stock)
      .toBe(8);

    const updatedProduct2 =
      productService.getById(product2.id);

    expect(updatedProduct2?.stock)
      .toBe(5);

    const movements1 =
      inventoryService
        .getByProductId(product1.id);

    expect(movements1.length)
      .toBe(1);

    expect(movements1[0].type)
      .toBe('sale');

    expect(movements1[0].direction)
      .toBe('out');

    expect(movements1[0].quantity)
      .toBe(2);

    expect(movements1[0].shiftId)
      .toBe(shiftId);

    const movements2 =
      inventoryService
        .getByProductId(product2.id);

    expect(movements2.length)
      .toBe(1);

    expect(movements2[0].type)
      .toBe('sale');

    expect(movements2[0].direction)
      .toBe('out');

    expect(movements2[0].quantity)
      .toBe(3);

    expect(movements2[0].shiftId)
      .toBe(shiftId);
  });

  it('should not affect reservations from another ticket', () => {

    const product =
      productService.create(
        'Pasta',
        200,
        80,
        10,
        userId
      );

    const reservation1 =
      inventoryReservationService.reserve(
        product.id,
        ticketId,
        'ticket-item-1',
        2
      );

    const reservation2 =
      inventoryReservationService.reserve(
        product.id,
        'ticket-2',
        'ticket-item-2',
        3
      );

    const consumed =
      service.consumeTicketReservations(
        ticketId,
        userId,
        shiftId
      );

    expect(consumed.length)
      .toBe(1);

    expect(consumed[0].id)
      .toBe(reservation1.id);

    expect(
      inventoryReservationService
        .getById(reservation1.id)
    ).toBeNull();

    expect(
      inventoryReservationService
        .getById(reservation2.id)
    ).not.toBeNull();

    expect(
      productService.getById(product.id)?.stock
    ).toBe(8);

    expect(
      inventoryService
        .getByProductId(product.id)
        .length
    ).toBe(1);
  });

  it('should use the reservation quantity when registering the sale', () => {

    const product =
      productService.create(
        'Carne',
        400,
        200,
        20,
        userId
      );

    inventoryReservationService.reserve(
      product.id,
      ticketId,
      'ticket-item-1',
      7
    );

    service.consumeTicketReservations(
      ticketId,
      userId,
      shiftId
    );

    const movements =
      inventoryService
        .getByProductId(product.id);

    expect(movements.length)
      .toBe(1);

    expect(movements[0].quantity)
      .toBe(7);

    expect(
      productService.getById(product.id)?.stock
    ).toBe(13);
  });


  it('debe revertir el movimiento y el stock si falla el consumo de una reserva', () => {

  const product =
    productService.create(
      'Hamburguesa',
      250,
      100,
      10,
      userId
    );

  const reservation =
    inventoryReservationService.reserve(
      product.id,
      ticketId,
      'ticket-item-1',
      2
    );

  spyOn(
    inventoryReservationService,
    'consume'
  ).and.callFake(() => {
    throw new Error(
      'Error simulado al consumir la reserva.'
    );
  });

  expect(() =>
    service.consumeTicketReservations(
      ticketId,
      userId,
      shiftId
    )
  ).toThrowError(
    'Error simulado al consumir la reserva.'
  );

  expect(
    inventoryReservationService
      .getById(reservation.id)
  ).not.toBeNull();

  expect(
    inventoryService
      .getByProductId(product.id)
  ).toEqual([]);

  expect(
    productService
      .getById(product.id)?.stock
  ).toBe(10);
});


it('debe revertir todas las reservas si falla una reserva posterior', () => {

  const product1 =
    productService.create(
      'Hamburguesa',
      250,
      100,
      10,
      userId
    );

  const product2 =
    productService.create(
      'Pizza',
      300,
      120,
      8,
      userId
    );

  const reservation1 =
    inventoryReservationService.reserve(
      product1.id,
      ticketId,
      'ticket-item-1',
      2
    );

  const reservation2 =
    inventoryReservationService.reserve(
      product2.id,
      ticketId,
      'ticket-item-2',
      3
    );

  spyOn(
    inventoryReservationService,
    'consume'
  ).and.callFake(
    (reservationId: string) => {

      if (reservationId === reservation2.id) {
        throw new Error(
          'Error simulado en la segunda reserva.'
        );
      }

      return reservation1;
    }
  );

  expect(() =>
    service.consumeTicketReservations(
      ticketId,
      userId,
      shiftId
    )
  ).toThrowError(
    'Error simulado en la segunda reserva.'
  );

  expect(
    inventoryReservationService
      .getById(reservation1.id)
  ).not.toBeNull();

  expect(
    inventoryReservationService
      .getById(reservation2.id)
  ).not.toBeNull();

  expect(
    productService
      .getById(product1.id)?.stock
  ).toBe(10);

  expect(
    productService
      .getById(product2.id)?.stock
  ).toBe(8);

  expect(
    inventoryService
      .getByProductId(product1.id)
  ).toEqual([]);

  expect(
    inventoryService
      .getByProductId(product2.id)
  ).toEqual([]);
});


it('no debe fallar al liberar las reservas de un ticket que no tiene reservas', () => {

  expect(() =>
    service.releaseTicketReservations(
      ticketId
    )
  ).not.toThrow();

  expect(
    inventoryReservationService
      .getByTicketId(ticketId)
  ).toEqual([]);
});


});