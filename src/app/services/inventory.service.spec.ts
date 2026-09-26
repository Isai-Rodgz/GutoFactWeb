
import { TestBed } from '@angular/core/testing';
import { InventoryService } from './inventory.service';
import { ProductService } from './product.service';
import { StorageService } from './storage.service';

describe('InventoryService', () => {

  let service: InventoryService;
  let productService: ProductService;
  let storage: StorageService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        InventoryService,
        ProductService,
        StorageService
      ]
    });

    service = TestBed.inject(InventoryService);
    productService = TestBed.inject(ProductService);
    storage = TestBed.inject(StorageService);

    storage.clear();
  });


  it('should create the service', () => {

    expect(service).toBeTruthy();

  });


  it('should add an inventory movement with direction in and increase stock', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const movement =
      service.addMovement(
        product.id,
        'user-1',
        'purchase',
        'in',
        5
      );

    expect(movement).toBeTruthy();
    expect(movement.productId)
      .toBe(product.id);
    expect(movement.userId)
      .toBe('user-1');
    expect(movement.type)
      .toBe('purchase');
    expect(movement.direction)
      .toBe('in');
    expect(movement.quantity)
      .toBe(5);

    const updatedProduct =
      productService.getById(product.id);

    expect(updatedProduct!.stock)
      .toBe(15);

  });


  it('should add an inventory movement with direction out and decrease stock', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const movement =
      service.addMovement(
        product.id,
        'user-2',
        'adjustment',
        'out',
        3
      );

    expect(movement.direction)
      .toBe('out');

    expect(movement.quantity)
      .toBe(3);

    const updatedProduct =
      productService.getById(product.id);

    expect(updatedProduct!.stock)
      .toBe(7);

  });


  it('should preserve shiftId and description', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const movement =
      service.addMovement(
        product.id,
        'user-1',
        'purchase',
        'in',
        5,
        'shift-1',
        'Compra de inventario'
      );

    expect(movement.shiftId)
      .toBe('shift-1');

    expect(movement.description)
      .toBe('Compra de inventario');

  });


  it('should get all inventory movements', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    service.addMovement(
      product.id,
      'user-1',
      'purchase',
      'in',
      5
    );

    service.addMovement(
      product.id,
      'user-1',
      'damage',
      'out',
      2
    );

    const movements =
      service.getAll();

    expect(movements.length)
      .toBe(2);

  });


  it('should get movements by product id', () => {

    const product1 =
      productService.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const product2 =
      productService.create(
        'Pizza',
        400,
        180,
        5,
        'user-1'
      );

    service.addMovement(
      product1.id,
      'user-1',
      'purchase',
      'in',
      5
    );

    service.addMovement(
      product2.id,
      'user-1',
      'purchase',
      'in',
      3
    );

    service.addMovement(
      product1.id,
      'user-1',
      'damage',
      'out',
      2
    );

    const movements =
      service.getByProductId(
        product1.id
      );

    expect(movements.length)
      .toBe(2);

    expect(
      movements.every(
        movement =>
          movement.productId === product1.id
      )
    ).toBeTrue();

  });


  it('should reject zero quantity', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    expect(() =>
      service.addMovement(
        product.id,
        'user-1',
        'purchase',
        'in',
        0
      )
    ).toThrowError(
      'La cantidad debe ser mayor que cero.'
    );

  });


  it('should reject negative quantity', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    expect(() =>
      service.addMovement(
        product.id,
        'user-1',
        'purchase',
        'in',
        -5
      )
    ).toThrowError(
      'La cantidad debe ser mayor que cero.'
    );

  });


  it('should reject nonexistent product', () => {

    expect(() =>
      service.addMovement(
        'nonexistent-product',
        'user-1',
        'purchase',
        'in',
        5
      )
    ).toThrowError(
      'El producto no existe.'
    );

  });


  it('should reject outgoing movement when stock is insufficient', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    expect(() =>
      service.addMovement(
        product.id,
        'user-1',
        'sale',
        'out',
        11
      )
    ).toThrowError(
      'No hay suficiente stock disponible.'
    );

    const unchangedProduct =
      productService.getById(product.id);

    expect(unchangedProduct!.stock)
      .toBe(10);

  });


  it('should register a sale as an outgoing inventory movement', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const movement =
      service.registerSale(
        product.id,
        'user-2',
        4,
        'shift-1',
        'Venta del ticket ticket-1'
      );

    expect(movement.type)
      .toBe('sale');

    expect(movement.direction)
      .toBe('out');

    expect(movement.quantity)
      .toBe(4);

    expect(movement.shiftId)
      .toBe('shift-1');

    const updatedProduct =
      productService.getById(product.id);

    expect(updatedProduct!.stock)
      .toBe(6);

  });


  it('should persist the inventory movement', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const movement =
      service.addMovement(
        product.id,
        'user-1',
        'purchase',
        'in',
        5
      );

    const movements =
      service.getAll();

    expect(movements.length)
      .toBe(1);

    expect(movements[0].id)
      .toBe(movement.id);

  });


  it('should persist the stock change', () => {

    const product =
      productService.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    service.addMovement(
      product.id,
      'user-1',
      'purchase',
      'in',
      5
    );

    const savedProduct =
      productService.getById(product.id);

    expect(savedProduct)
      .toBeTruthy();

    expect(savedProduct!.stock)
      .toBe(15);

  });


  it('should reject purchase movement with direction out', () => {

  const product =
    productService.create(
      'Hamburguesa',
      250,
      120,
      10,
      'user-1'
    );

  expect(() =>
    service.addMovement(
      product.id,
      'user-1',
      'purchase',
      'out',
      5
    )
  ).toThrowError(
    'El tipo y la dirección del movimiento no son compatibles.'
  );

});


it('should reject sale movement with direction in', () => {

  const product =
    productService.create(
      'Hamburguesa',
      250,
      120,
      10,
      'user-1'
    );

  expect(() =>
    service.addMovement(
      product.id,
      'user-1',
      'sale',
      'in',
      5
    )
  ).toThrowError(
    'El tipo y la dirección del movimiento no son compatibles.'
  );

});


it('should reject damage movement with direction in', () => {

  const product =
    productService.create(
      'Hamburguesa',
      250,
      120,
      10,
      'user-1'
    );

  expect(() =>
    service.addMovement(
      product.id,
      'user-1',
      'damage',
      'in',
      5
    )
  ).toThrowError(
    'El tipo y la dirección del movimiento no son compatibles.'
  );

});


it('should reject return movement with direction out', () => {

  const product =
    productService.create(
      'Hamburguesa',
      250,
      120,
      10,
      'user-1'
    );

  expect(() =>
    service.addMovement(
      product.id,
      'user-1',
      'return',
      'out',
      5
    )
  ).toThrowError(
    'El tipo y la dirección del movimiento no son compatibles.'
  );

});


it('should allow adjustment movement with both directions', () => {

  const product =
    productService.create(
      'Hamburguesa',
      250,
      120,
      10,
      'user-1'
    );

  const incomingMovement =
    service.addMovement(
      product.id,
      'user-1',
      'adjustment',
      'in',
      5
    );

  expect(incomingMovement.direction)
    .toBe('in');

  const outgoingMovement =
    service.addMovement(
      product.id,
      'user-1',
      'adjustment',
      'out',
      3
    );

  expect(outgoingMovement.direction)
    .toBe('out');

  const updatedProduct =
    productService.getById(product.id);

  expect(updatedProduct!.stock)
    .toBe(12);
});



 it('should rollback the inventory movement if stock update fails', () => {

  const product =
    productService.create(
      'Hamburguesa',
      250,
      100,
      10,
      'user-1'
    );

  spyOn(
    productService,
    'adjustStock'
  ).and.throwError(
    'Error simulado de stock.'
  );

  expect(() =>
    service.addMovement(
      product.id,
      'user-1',
      'purchase',
      'in',
      5
    )
  ).toThrowError(
    'Error simulado de stock.'
  );

  const movements =
    service.getByProductId(product.id);

  expect(movements.length)
    .toBe(0);

  const updatedProduct =
    productService.getById(product.id);

  expect(updatedProduct?.stock)
    .toBe(10);
});

});