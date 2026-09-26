import { TestBed } from '@angular/core/testing';
import { InventoryReservationService } from './inventory-reservation.service';
import { ProductService } from './product.service';
import { StorageService } from './storage.service';

describe('InventoryReservationService', () => {

  let service: InventoryReservationService;
  let productService: ProductService;
  let storageService: StorageService;

  const userId = 'user-1';
  const ticketId = 'ticket-1';
  const ticketItemId = 'ticket-item-1';

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        InventoryReservationService,
        ProductService,
        StorageService
      ]
    });

    service =
      TestBed.inject(
        InventoryReservationService
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

  it('should create a reservation correctly', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        100,
        10,
        userId
      );

    const reservation =
      service.reserve(
        product.id,
        ticketId,
        ticketItemId,
        3
      );

    expect(reservation).toBeTruthy();
    expect(reservation.productId)
      .toBe(product.id);
    expect(reservation.ticketId)
      .toBe(ticketId);
    expect(reservation.ticketItemId)
      .toBe(ticketItemId);
    expect(reservation.quantity)
      .toBe(3);
    expect(reservation.createdAt)
      .toBeTruthy();
    expect(reservation.updatedAt)
      .toBeTruthy();

    expect(
      service.getById(reservation.id)
    ).toEqual(reservation);
  });

  it('should calculate reserved quantity correctly', () => {

    const product =
      productService.create(
        'Pizza',
        300,
        120,
        10,
        userId
      );

    service.reserve(
      product.id,
      ticketId,
      'item-1',
      2
    );

    service.reserve(
      product.id,
      'ticket-2',
      'item-2',
      3
    );

    expect(
      service.getReservedQuantity(product.id)
    ).toBe(5);
  });

  it('should calculate available stock correctly', () => {

    const product =
      productService.create(
        'Pasta',
        200,
        80,
        10,
        userId
      );

    service.reserve(
      product.id,
      ticketId,
      ticketItemId,
      4
    );

    expect(
      service.getAvailableStock(product.id)
    ).toBe(6);
  });

  it('should verify whether enough stock is available', () => {

    const product =
      productService.create(
        'Croissant',
        150,
        60,
        10,
        userId
      );

    service.reserve(
      product.id,
      ticketId,
      ticketItemId,
      7
    );

    expect(
      service.hasEnoughAvailableStock(
        product.id,
        3
      )
    ).toBe(true);

    expect(
      service.hasEnoughAvailableStock(
        product.id,
        4
      )
    ).toBe(false);
  });

  it('should increase a reservation correctly', () => {

    const product =
      productService.create(
        'Carne',
        400,
        200,
        10,
        userId
      );

    const reservation =
      service.reserve(
        product.id,
        ticketId,
        ticketItemId,
        2
      );

    const updatedReservation =
      service.increase(
        reservation.id,
        3
      );

    expect(updatedReservation.quantity)
      .toBe(5);

    expect(
      service.getReservedQuantity(product.id)
    ).toBe(5);

    expect(
      service.getAvailableStock(product.id)
    ).toBe(5);
  });

  it('should decrease a reservation correctly', () => {

    const product =
      productService.create(
        'Pasta',
        200,
        80,
        10,
        userId
      );

    const reservation =
      service.reserve(
        product.id,
        ticketId,
        ticketItemId,
        5
      );

    const updatedReservation =
      service.decrease(
        reservation.id,
        2
      );

    expect(updatedReservation.quantity)
      .toBe(3);

    expect(
      service.getReservedQuantity(product.id)
    ).toBe(3);

    expect(
      service.getAvailableStock(product.id)
    ).toBe(7);
  });

  it('should release a reservation correctly', () => {

    const product =
      productService.create(
        'Pizza',
        300,
        120,
        10,
        userId
      );

    const reservation =
      service.reserve(
        product.id,
        ticketId,
        ticketItemId,
        4
      );

    const releasedReservation =
      service.release(
        reservation.id
      );

    expect(releasedReservation)
      .toEqual(reservation);

    expect(
      service.getById(reservation.id)
    ).toBeNull();

    expect(
      service.getReservedQuantity(product.id)
    ).toBe(0);

    expect(
      service.getAvailableStock(product.id)
    ).toBe(10);
  });

  it('should consume a reservation correctly', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        100,
        10,
        userId
      );

    const reservation =
      service.reserve(
        product.id,
        ticketId,
        ticketItemId,
        3
      );

    const consumedReservation =
      service.consume(
        reservation.id
      );

    expect(consumedReservation)
      .toEqual(reservation);

    expect(
      service.getById(reservation.id)
    ).toBeNull();

    expect(
      service.getReservedQuantity(product.id)
    ).toBe(0);

    expect(
      service.getAvailableStock(product.id)
    ).toBe(10);

    expect(
      productService.getById(product.id)?.stock
    ).toBe(10);
  });

  it('should reject a reservation when there is not enough available stock', () => {

    const product =
      productService.create(
        'Pizza',
        300,
        120,
        5,
        userId
      );

    service.reserve(
      product.id,
      ticketId,
      ticketItemId,
      4
    );

    expect(() =>
      service.reserve(
        product.id,
        'ticket-2',
        'item-2',
        2
      )
    ).toThrowError(
      'No hay suficiente stock disponible.'
    );
  });

  it('should reject duplicate reservation for the same ticket item', () => {

    const product =
      productService.create(
        'Pasta',
        200,
        80,
        10,
        userId
      );

    service.reserve(
      product.id,
      ticketId,
      ticketItemId,
      2
    );

    expect(() =>
      service.reserve(
        product.id,
        ticketId,
        ticketItemId,
        2
      )
    ).toThrowError(
      'Ya existe una reserva para este producto del ticket.'
    );
  });

  it('should reject reservation for an inactive product', () => {

    const product =
      productService.create(
        'Producto inactivo',
        100,
        50,
        10,
        userId
      );

    productService.deactivate(
      product.id,
      userId
    );

    expect(() =>
      service.reserve(
        product.id,
        ticketId,
        ticketItemId,
        1
      )
    ).toThrowError(
      'El producto no está activo.'
    );
  });

  it('should reject increasing a reservation when there is not enough available stock', () => {

    const product =
      productService.create(
        'Carne',
        400,
        200,
        5,
        userId
      );

    const reservation =
      service.reserve(
        product.id,
        ticketId,
        ticketItemId,
        4
      );

    expect(() =>
      service.increase(
        reservation.id,
        2
      )
    ).toThrowError(
      'No hay suficiente stock disponible.'
    );
  });

  it('should reject decreasing a reservation by more than its quantity', () => {

    const product =
      productService.create(
        'Croissant',
        150,
        60,
        10,
        userId
      );

    const reservation =
      service.reserve(
        product.id,
        ticketId,
        ticketItemId,
        3
      );

    expect(() =>
      service.decrease(
        reservation.id,
        4
      )
    ).toThrowError(
      'No se puede reducir la reserva por encima de la cantidad reservada.'
    );
  });

  it('should release the reservation when decreasing its quantity to zero', () => {

    const product =
      productService.create(
        'Pizza',
        300,
        120,
        10,
        userId
      );

    const reservation =
      service.reserve(
        product.id,
        ticketId,
        ticketItemId,
        3
      );

    const result =
      service.decrease(
        reservation.id,
        3
      );

    expect(result)
      .toEqual(reservation);

    expect(
      service.getById(reservation.id)
    ).toBeNull();

    expect(
      service.getAvailableStock(product.id)
    ).toBe(10);
  });


  it('should get reservations by product id', () => {

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
      10,
      userId
    );

  service.reserve(
    product1.id,
    'ticket-1',
    'item-1',
    2
  );

  service.reserve(
    product1.id,
    'ticket-2',
    'item-2',
    3
  );

  service.reserve(
    product2.id,
    'ticket-3',
    'item-3',
    4
  );

  const reservations =
    service.getByProductId(product1.id);

  expect(reservations.length)
    .toBe(2);

  expect(
    reservations.every(
      reservation =>
        reservation.productId === product1.id
    )
  ).toBeTrue();
});


it('should get reservations by ticket id', () => {

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
      10,
      userId
    );

  service.reserve(
    product1.id,
    'ticket-1',
    'item-1',
    2
  );

  service.reserve(
    product2.id,
    'ticket-1',
    'item-2',
    3
  );

  service.reserve(
    product1.id,
    'ticket-2',
    'item-3',
    1
  );

  const reservations =
    service.getByTicketId('ticket-1');

  expect(reservations.length)
    .toBe(2);

  expect(
    reservations.every(
      reservation =>
        reservation.ticketId === 'ticket-1'
    )
  ).toBeTrue();
});



it('should get a reservation by ticket item id', () => {

  const product =
    productService.create(
      'Hamburguesa',
      250,
      100,
      10,
      userId
    );

  const reservation =
    service.reserve(
      product.id,
      ticketId,
      ticketItemId,
      2
    );

  const result =
    service.getByTicketItemId(
      ticketItemId
    );

  expect(result)
    .toEqual(reservation);
});


it('should reject increasing a nonexistent reservation', () => {

  expect(() =>
    service.increase(
      'nonexistent-reservation',
      2
    )
  ).toThrowError(
    'La reserva no existe.'
  );
});



it('should reject decreasing a nonexistent reservation', () => {

  expect(() =>
    service.decrease(
      'nonexistent-reservation',
      2
    )
  ).toThrowError(
    'La reserva no existe.'
  );
});



it('should reject consuming or releasing a nonexistent reservation', () => {

  expect(() =>
    service.consume(
      'nonexistent-reservation'
    )
  ).toThrowError(
    'La reserva no existe.'
  );

  expect(() =>
    service.release(
      'nonexistent-reservation'
    )
  ).toThrowError(
    'La reserva no existe.'
  );
});



  it('should reject zero or negative quantities', () => {

    const product =
      productService.create(
        'Producto',
        100,
        50,
        10,
        userId
      );

    expect(() =>
      service.reserve(
        product.id,
        ticketId,
        ticketItemId,
        0
      )
    ).toThrowError(
      'La cantidad debe ser mayor que cero.'
    );

    expect(() =>
      service.hasEnoughAvailableStock(
        product.id,
        -1
      )
    ).toThrowError(
      'La cantidad debe ser mayor que cero.'
    );
  });
});