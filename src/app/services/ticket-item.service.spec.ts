import { TestBed } from '@angular/core/testing';

import { TicketItemService } from './ticket-item.service';
import { StorageService } from './storage.service';
import { TicketService } from './ticket.service';
import { ProductService } from './product.service';
import { InventoryReservationService } from './inventory-reservation.service';

describe('TicketItemService', () => {

  let service: TicketItemService;
  let storage: StorageService;
  let ticketService: TicketService;
  let productService: ProductService;
  let reservationService: InventoryReservationService;

  const userId = 'user-1';
  const shiftId = 'shift-1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TicketItemService,
        StorageService,
        TicketService,
        ProductService,
        InventoryReservationService
      ]
    });

    service = TestBed.inject(TicketItemService);
    storage = TestBed.inject(StorageService);
    ticketService = TestBed.inject(TicketService);
    productService = TestBed.inject(ProductService);
    reservationService =
      TestBed.inject(InventoryReservationService);

    storage.clear();
  });

  afterEach(() => {
    storage.clear();
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe agregar un producto a un ticket abierto', () => {

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

    const item =
      service.add(
        ticket.id,
        product.id,
        2
      );

    expect(item.ticketId)
      .toBe(ticket.id);

    expect(item.productId)
      .toBe(product.id);

    expect(item.quantity)
      .toBe(2);

    expect(item.unitPrice)
      .toBe(250);

    expect(item.subtotal)
      .toBe(500);
  });

  it('debe crear una reserva de inventario al agregar un producto', () => {

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

    const item =
      service.add(
        ticket.id,
        product.id,
        3
      );

    const reservation =
      reservationService
        .getByTicketItemId(item.id);

    expect(reservation)
      .not.toBeNull();

    expect(reservation!.productId)
      .toBe(product.id);

    expect(reservation!.ticketId)
      .toBe(ticket.id);

    expect(reservation!.ticketItemId)
      .toBe(item.id);

    expect(reservation!.quantity)
      .toBe(3);
  });

  it('debe conservar el precio del producto en el momento de agregarlo', () => {

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
        20,
        userId
      );

    const item =
      service.add(
        ticket.id,
        product.id,
        2
      );

    productService.update(
      product.id,
      userId,
      {
        price: 150
      }
    );

    expect(item.unitPrice)
      .toBe(100);

    expect(item.subtotal)
      .toBe(200);
  });

  it('debe permitir agregar el mismo producto varias veces como items separados', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    const product =
      productService.create(
        'Cerveza',
        150,
        50,
        20,
        userId
      );

    const firstItem =
      service.add(
        ticket.id,
        product.id,
        2
      );

    const secondItem =
      service.add(
        ticket.id,
        product.id,
        3
      );

    expect(firstItem.id)
      .not.toBe(secondItem.id);

    expect(firstItem.quantity)
      .toBe(2);

    expect(secondItem.quantity)
      .toBe(3);

    const items =
      service.getByTicketId(ticket.id);

    expect(items.length)
      .toBe(2);

    const reservations =
      reservationService
        .getByTicketId(ticket.id);

    expect(reservations.length)
      .toBe(2);

    expect(
      reservations
        .reduce(
          (total, reservation) =>
            total + reservation.quantity,
          0
        )
    ).toBe(5);
  });

  it('no debe permitir agregar una cantidad menor o igual a cero', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    const product =
      productService.create(
        'Café',
        100,
        30,
        10,
        userId
      );

    expect(() =>
      service.add(
        ticket.id,
        product.id,
        0
      )
    ).toThrowError(
      'La cantidad debe ser mayor que cero.'
    );

    expect(() =>
      service.add(
        ticket.id,
        product.id,
        -1
      )
    ).toThrowError(
      'La cantidad debe ser mayor que cero.'
    );
  });

  it('no debe permitir agregar un producto inexistente', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    expect(() =>
      service.add(
        ticket.id,
        'producto-inexistente',
        1
      )
    ).toThrowError(
      'El producto no existe.'
    );
  });

  it('no debe permitir agregar un producto inactivo', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    const product =
      productService.create(
        'Producto inactivo',
        200,
        80,
        10,
        userId
      );

    productService.deactivate(
      product.id,
      userId
    );

    expect(() =>
      service.add(
        ticket.id,
        product.id,
        1
      )
    ).toThrowError(
      'El producto no está activo.'
    );
  });

  it('no debe permitir agregar productos a un ticket que no está abierto', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    const product =
      productService.create(
        'Producto',
        200,
        80,
        10,
        userId
      );

    ticketService.markAsPaid(
      ticket.id
    );

    expect(() =>
      service.add(
        ticket.id,
        product.id,
        1
      )
    ).toThrowError(
      'No se pueden agregar productos a un ticket que no está abierto.'
    );
  });

  it('debe calcular correctamente el total del ticket', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

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
        'Refresco',
        100,
        30,
        20,
        userId
      );

    service.add(
      ticket.id,
      product1.id,
      2
    );

    service.add(
      ticket.id,
      product2.id,
      3
    );

    expect(
      service.getTicketTotal(ticket.id)
    ).toBe(800);
  });

  it('debe guardar los items en almacenamiento', () => {

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

    const item =
      service.add(
        ticket.id,
        product.id,
        2
      );

    const storedItems =
      storage.get<any[]>(
        'ticket-items'
      );

    expect(storedItems)
      .not.toBeNull();

    expect(storedItems!.length)
      .toBe(1);

    expect(storedItems![0].id)
      .toBe(item.id);
  });


  it('debe obtener un item por su ID', () => {

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

  const item =
    service.add(
      ticket.id,
      product.id,
      2
    );

  const foundItem =
    service.getById(item.id);

  expect(foundItem)
    .not.toBeNull();

  expect(foundItem!.id)
    .toBe(item.id);

  expect(foundItem!.ticketId)
    .toBe(ticket.id);

  expect(foundItem!.productId)
    .toBe(product.id);
});


it('no debe guardar el item si no hay stock disponible para reservar', () => {

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
      2,
      userId
    );

  expect(() =>
    service.add(
      ticket.id,
      product.id,
      3
    )
  ).toThrowError(
    'No hay suficiente stock disponible.'
  );

  expect(
    service.getByTicketId(ticket.id)
  ).toEqual([]);

  expect(
    reservationService.getByTicketId(ticket.id)
  ).toEqual([]);
});


it('debe revertir la reserva si falla el almacenamiento del item', () => {

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

  const originalSet =
    storage.set.bind(storage);

  spyOn(storage, 'set').and.callFake(
    (key: string, value: any) => {

      if (key === 'ticket-items') {
        throw new Error(
          'Error simulado al guardar el ticket item.'
        );
      }

      originalSet(key, value);
    }
  );

  expect(() =>
    service.add(
      ticket.id,
      product.id,
      2
    )
  ).toThrowError(
    'Error simulado al guardar el ticket item.'
  );

  expect(
    service.getByTicketId(ticket.id)
  ).toEqual([]);

  expect(
    reservationService.getByTicketId(ticket.id)
  ).toEqual([]);

  expect(
    product.stock
  ).toBe(10);

  expect(
    reservationService.getReservedQuantity(
      product.id
    )
  ).toBe(0);
});

});
