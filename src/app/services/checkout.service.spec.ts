import { TestBed } from '@angular/core/testing';
import { CheckoutService } from './checkout.service';
import { TicketService } from './ticket.service';
import { TicketItemService } from './ticket-item.service';
import { SaleService } from './sale.service';
import { TicketInventoryService } from './ticket-inventory.service';
import { InventoryReservationService } from './inventory-reservation.service';
import { InventoryService } from './inventory.service';
import { ProductService } from './product.service';
import { CashMovementService } from './cash-movement.service';
import { StorageService } from './storage.service';

describe('CheckoutService', () => {

  let service: CheckoutService;

  let ticketService: TicketService;
  let ticketItemService: TicketItemService;
  let saleService: SaleService;
  let ticketInventoryService: TicketInventoryService;
  let inventoryReservationService:
    InventoryReservationService;
  let inventoryService: InventoryService;
  let productService: ProductService;
  let cashMovementService: CashMovementService;
  let storageService: StorageService;

  const userId = 'user-1';
  const shiftId = 'shift-1';

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        CheckoutService,
        TicketService,
        TicketItemService,
        SaleService,
        TicketInventoryService,
        InventoryReservationService,
        InventoryService,
        ProductService,
        CashMovementService,
        StorageService
      ]
    });

    service =
      TestBed.inject(CheckoutService);

    ticketService =
      TestBed.inject(TicketService);

    ticketItemService =
      TestBed.inject(TicketItemService);

    saleService =
      TestBed.inject(SaleService);

    ticketInventoryService =
      TestBed.inject(TicketInventoryService);

    inventoryReservationService =
      TestBed.inject(
        InventoryReservationService
      );

    inventoryService =
      TestBed.inject(InventoryService);

    productService =
      TestBed.inject(ProductService);

    cashMovementService =
      TestBed.inject(CashMovementService);

    storageService =
      TestBed.inject(StorageService);

    storageService.clear();
  });

  afterEach(() => {
    storageService.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should complete a cash checkout correctly', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        100,
        10,
        userId
      );

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    const item =
      ticketItemService.add(
        ticket.id,
        product.id,
        2
      );

    const reservation =
      inventoryReservationService
        .getByTicketItemId(item.id);

    expect(reservation).not.toBeNull();
    expect(reservation?.quantity).toBe(2);

    const availableBeforeCheckout =
      inventoryReservationService
        .getAvailableStock(product.id);

    expect(availableBeforeCheckout).toBe(8);

    const sale =
      service.checkout(
        ticket.id,
        'cash'
      );

    expect(sale).toBeTruthy();
    expect(sale.ticketId).toBe(ticket.id);
    expect(sale.shiftId).toBe(shiftId);
    expect(sale.userId).toBe(userId);
    expect(sale.total).toBe(500);
    expect(sale.paymentMethod).toBe('cash');
    expect(sale.status).toBe('completed');

    const updatedTicket =
      ticketService.getById(ticket.id);

    expect(updatedTicket).not.toBeNull();
    expect(updatedTicket?.status).toBe('paid');
    expect(updatedTicket?.paidAt).toBeTruthy();

    const reservationAfterCheckout =
      inventoryReservationService
        .getByTicketItemId(item.id);

    expect(reservationAfterCheckout)
      .toBeNull();

    const updatedProduct =
      productService.getById(product.id);

    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct?.stock).toBe(8);

    const inventoryMovements =
      inventoryService
        .getByProductId(product.id);

    expect(inventoryMovements.length)
      .toBe(1);

    expect(inventoryMovements[0].type)
      .toBe('sale');

    expect(inventoryMovements[0].direction)
      .toBe('out');

    expect(inventoryMovements[0].quantity)
      .toBe(2);

    const cashMovements =
      cashMovementService
        .getByShiftId(shiftId);

    expect(cashMovements.length)
      .toBe(1);

    expect(cashMovements[0].type)
      .toBe('sale');

    expect(cashMovements[0].amount)
      .toBe(500);
  });

  it('should complete a card checkout with a payment reference', () => {

    const product =
      productService.create(
        'Pizza',
        300,
        120,
        10,
        userId
      );

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    ticketItemService.add(
      ticket.id,
      product.id,
      1
    );

    const sale =
      service.checkout(
        ticket.id,
        'card',
        'CARD-12345'
      );

    expect(sale.paymentMethod)
      .toBe('card');

    expect(sale.paymentReference)
      .toBe('CARD-12345');

    expect(sale.total)
      .toBe(300);

    const updatedTicket =
      ticketService.getById(ticket.id);

    expect(updatedTicket?.status)
      .toBe('paid');

    const updatedProduct =
      productService.getById(product.id);

    expect(updatedProduct?.stock)
      .toBe(9);

    const cashMovements =
      cashMovementService
        .getByShiftId(shiftId);

    expect(cashMovements.length)
      .toBe(0);
  });

  it('should reject checkout when the ticket does not exist', () => {

    expect(() =>
      service.checkout(
        'ticket-inexistente',
        'cash'
      )
    ).toThrowError(
      'El ticket no existe.'
    );
  });

  it('should reject checkout when the ticket is not open', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    ticketService.cancel(
      ticket.id,
      userId,
      'Prueba'
    );

    expect(() =>
      service.checkout(
        ticket.id,
        'cash'
      )
    ).toThrowError(
      'El ticket no está abierto.'
    );
  });

  it('should reject checkout when the ticket has no products', () => {

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    expect(() =>
      service.checkout(
        ticket.id,
        'cash'
      )
    ).toThrowError(
      'El ticket no tiene productos.'
    );
  });

  it('debe rechazar un pago por transferencia sin referencia', () => {
    const product = productService.create(
      'Producto transferencia',
      250,
      100,
      5,
      'user-1',
      undefined,
      undefined,
      undefined
    );

    const ticket = ticketService.create('shift-1', 'user-1');

    ticketItemService.add(
      ticket.id,
      product.id,
      1
    );

    inventoryReservationService.reserve(
      product.id,
      ticket.id,
      ticket.id,
      1
    );

    expect(() =>
      service.checkout(
        ticket.id,
        'transfer'
      )
    ).toThrowError(
      'Se requiere una referencia para la transferencia.'
    );

    const updatedTicket = ticketService.getById(ticket.id);

    expect(updatedTicket?.status).toBe('open');

    const reservation =
      inventoryReservationService.getByTicketItemId(ticket.id);

    expect(reservation).not.toBeNull();

    const updatedProduct =
      productService.getById(product.id);

    expect(updatedProduct?.stock).toBe(5);

    expect(saleService.getAll().length).toBe(0);

    expect(inventoryService.getAll().length).toBe(0);

    expect(cashMovementService.getAll().length).toBe(0);
  });


  it('debe procesar correctamente un pago por transferencia con referencia', () => {
    const product = productService.create(
      'Producto transferencia',
      300,
      100,
      5,
      'user-1',
      undefined,
      undefined,
      undefined
    );

    const ticket = ticketService.create('shift-1', 'user-1');

    ticketItemService.add(
      ticket.id,
      product.id,
      2
    );

    const reservation =
      inventoryReservationService.getByTicketId(ticket.id);

    expect(reservation.length).toBe(1);
    expect(reservation[0].quantity).toBe(2);

    const sale = service.checkout(
      ticket.id,
      'transfer',
      'TRANSFER-12345'
    );

    expect(sale.total).toBe(600);
    expect(sale.paymentMethod).toBe('transfer');
    expect(sale.paymentReference).toBe('TRANSFER-12345');
    expect(sale.status).toBe('completed');

    const updatedTicket = ticketService.getById(ticket.id);

    expect(updatedTicket?.status).toBe('paid');

    const updatedProduct =
      productService.getById(product.id);

    expect(updatedProduct?.stock).toBe(3);

    expect(cashMovementService.getAll().length).toBe(0);
  });

  it('should reject card checkout without a payment reference', () => {

    const product =
      productService.create(
        'Pasta',
        200,
        80,
        10,
        userId
      );

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    ticketItemService.add(
      ticket.id,
      product.id,
      1
    );

    expect(() =>
      service.checkout(
        ticket.id,
        'card'
      )
    ).toThrowError(
      'Se requiere una referencia para este método de pago.'
    );

    const updatedTicket =
      ticketService.getById(ticket.id);

    expect(updatedTicket?.status)
      .toBe('open');

    const reservation =
      inventoryReservationService
        .getByTicketId(ticket.id);

    expect(reservation.length)
      .toBe(1);

    const updatedProduct =
      productService.getById(product.id);

    expect(updatedProduct?.stock)
      .toBe(10);
  });


  it('should reject transfer checkout without a payment reference', () => {

    const product =
      productService.create(
        'Producto transferencia',
        250,
        100,
        10,
        userId
      );

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    ticketItemService.add(
      ticket.id,
      product.id,
      1
    );

    expect(() =>
      service.checkout(
        ticket.id,
        'transfer'
      )
    ).toThrowError(
      'Se requiere una referencia para la transferencia.'
    );

    const updatedTicket =
      ticketService.getById(ticket.id);

    expect(updatedTicket?.status)
      .toBe('open');

    const reservations =
      inventoryReservationService
        .getByTicketId(ticket.id);

    expect(reservations.length)
      .toBe(1);

    const updatedProduct =
      productService.getById(product.id);

    expect(updatedProduct?.stock)
      .toBe(10);

    const sales =
      saleService.getByTicketId(ticket.id);

    expect(sales.length)
      .toBe(0);

    const inventoryMovements =
      inventoryService
        .getByProductId(product.id);

    expect(inventoryMovements.length)
      .toBe(0);

    const cashMovements =
      cashMovementService
        .getByShiftId(shiftId);

    expect(cashMovements.length)
      .toBe(0);
  });


  it('should complete a transfer checkout with a payment reference', () => {

    const product =
      productService.create(
        'Producto transferencia',
        300,
        120,
        10,
        userId
      );

    const ticket =
      ticketService.create(
        shiftId,
        userId
      );

    ticketItemService.add(
      ticket.id,
      product.id,
      2
    );

    const sale =
      service.checkout(
        ticket.id,
        'transfer',
        'TRANSFER-12345'
      );

    expect(sale.paymentMethod)
      .toBe('transfer');

    expect(sale.paymentReference)
      .toBe('TRANSFER-12345');

    expect(sale.total)
      .toBe(600);

    expect(sale.status)
      .toBe('completed');

    const updatedTicket =
      ticketService.getById(ticket.id);

    expect(updatedTicket?.status)
      .toBe('paid');

    const updatedProduct =
      productService.getById(product.id);

    expect(updatedProduct?.stock)
      .toBe(8);

    const inventoryMovements =
      inventoryService
        .getByProductId(product.id);

    expect(inventoryMovements.length)
      .toBe(1);

    expect(inventoryMovements[0].type)
      .toBe('sale');

    expect(inventoryMovements[0].direction)
      .toBe('out');

    expect(inventoryMovements[0].quantity)
      .toBe(2);

    const cashMovements =
      cashMovementService
        .getByShiftId(shiftId);

    expect(cashMovements.length)
      .toBe(0);
  });


  
  it('should rollback the checkout if inventory consumption fails', () => {

  const product =
    productService.create(
      'Hamburguesa',
      250,
      100,
      10,
      userId
    );

  const ticket =
    ticketService.create(
      shiftId,
      userId
    );

  const item =
    ticketItemService.add(
      ticket.id,
      product.id,
      2
    );

  const reservationBeforeCheckout =
    inventoryReservationService
      .getByTicketItemId(item.id);

  expect(reservationBeforeCheckout)
    .not.toBeNull();

  spyOn(
    ticketInventoryService,
    'consumeTicketReservations'
  ).and.throwError(
    'Error simulado de inventario.'
  );

  expect(() =>
    service.checkout(
      ticket.id,
      'cash'
    )
  ).toThrowError(
    'Error simulado de inventario.'
  );

  const sales =
    saleService.getByTicketId(ticket.id);

  expect(sales.length)
    .toBe(0);

  const updatedTicket =
    ticketService.getById(ticket.id);

  expect(updatedTicket?.status)
    .toBe('open');

  const reservationAfterCheckout =
    inventoryReservationService
      .getByTicketItemId(item.id);

  expect(reservationAfterCheckout)
    .not.toBeNull();

  expect(reservationAfterCheckout?.quantity)
    .toBe(2);

  const updatedProduct =
    productService.getById(product.id);

  expect(updatedProduct?.stock)
    .toBe(10);

  const inventoryMovements =
    inventoryService
      .getByProductId(product.id);

  expect(inventoryMovements.length)
    .toBe(0);

  const cashMovements =
    cashMovementService
      .getByShiftId(shiftId);

  expect(cashMovements.length)
    .toBe(0);
});
});

