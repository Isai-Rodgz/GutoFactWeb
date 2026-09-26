
import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { StorageService } from './storage.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {

  let service: ProductService;
  let storage: StorageService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        StorageService
      ]
    });

    service = TestBed.inject(ProductService);
    storage = TestBed.inject(StorageService);

    storage.clear();
  });


  it('should create the service', () => {

    expect(service).toBeTruthy();

  });


  it('should create a product', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1',
        'Hamburguesa clásica',
        'cat-1'
      );

    expect(product).toBeTruthy();
    expect(product.name).toBe('Hamburguesa');
    expect(product.price).toBe(250);
    expect(product.cost).toBe(120);
    expect(product.stock).toBe(10);
    expect(product.isActive).toBeTrue();
    expect(product.createdBy).toBe('user-1');
    expect(product.categoryId).toBe('cat-1');

  });


  it('should update product information without changing stock', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const updated =
      service.update(
        product.id,
        'user-2',
        {
          name: 'Hamburguesa Especial',
          price: 300,
          cost: 150
        }
      );

    expect(updated.name)
      .toBe('Hamburguesa Especial');

    expect(updated.price)
      .toBe(300);

    expect(updated.cost)
      .toBe(150);

    expect(updated.stock)
      .toBe(10);

    expect(updated.updatedBy)
      .toBe('user-2');

  });


  it('should ignore stock if someone tries to pass it through update', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const updated =
      service.update(
        product.id,
        'user-2',
        {
          stock: 50
        } as any
      );

    expect(updated.stock)
      .toBe(10);

  });


  it('should adjust stock positively', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const updated =
      service.adjustStock(
        product.id,
        5,
        'user-2'
      );

    expect(updated.stock)
      .toBe(15);

    expect(updated.updatedBy)
      .toBe('user-2');

  });


  it('should adjust stock negatively', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const updated =
      service.adjustStock(
        product.id,
        -3,
        'user-2'
      );

    expect(updated.stock)
      .toBe(7);

  });


  it('should reject zero stock adjustment', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    expect(() =>
      service.adjustStock(
        product.id,
        0,
        'user-2'
      )
    ).toThrowError(
      'La cantidad debe ser diferente de cero.'
    );

  });


  it('should reject stock adjustment that makes stock negative', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    expect(() =>
      service.adjustStock(
        product.id,
        -11,
        'user-2'
      )
    ).toThrowError(
      'El stock no puede ser negativo.'
    );

  });


  it('should reject adjustment for nonexistent product', () => {

    expect(() =>
      service.adjustStock(
        'nonexistent-product',
        5,
        'user-2'
      )
    ).toThrowError(
      'El producto no existe.'
    );

  });


  it('should reject update for nonexistent product', () => {

    expect(() =>
      service.update(
        'nonexistent-product',
        'user-2',
        {
          price: 300
        }
      )
    ).toThrowError(
      'El producto no existe.'
    );

  });


  it('should reject negative price update', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    expect(() =>
      service.update(
        product.id,
        'user-2',
        {
          price: -100
        }
      )
    ).toThrowError(
      'El precio no puede ser negativo.'
    );

  });


  it('should reject negative cost update', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    expect(() =>
      service.update(
        product.id,
        'user-2',
        {
          cost: -50
        }
      )
    ).toThrowError(
      'El costo no puede ser negativo.'
    );

  });


  it('should reject empty product name update', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    expect(() =>
      service.update(
        product.id,
        'user-2',
        {
          name: '   '
        }
      )
    ).toThrowError(
      'El nombre del producto es obligatorio.'
    );

  });


  it('should deactivate a product', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const updated =
      service.deactivate(
        product.id,
        'user-2'
      );

    expect(updated.isActive)
      .toBeFalse();

  });


  it('should activate a product', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    service.deactivate(
      product.id,
      'user-2'
    );

    const updated =
      service.activate(
        product.id,
        'user-3'
      );

    expect(updated.isActive)
      .toBeTrue();

    expect(updated.updatedBy)
      .toBe('user-3');

  });


  it('should get only active products', () => {

    const product1 =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    const product2 =
      service.create(
        'Pizza',
        400,
        180,
        5,
        'user-1'
      );

    service.deactivate(
      product2.id,
      'user-2'
    );

    const activeProducts =
      service.getActive();

    expect(activeProducts.length)
      .toBe(1);

    expect(activeProducts[0].id)
      .toBe(product1.id);

  });


  it('should get product by category', () => {

    service.create(
      'Hamburguesa',
      250,
      120,
      10,
      'user-1',
      undefined,
      'cat-1'
    );

    service.create(
      'Pizza',
      400,
      180,
      5,
      'user-1',
      undefined,
      'cat-2'
    );

    const products =
      service.getByCategoryId('cat-1');

    expect(products.length)
      .toBe(1);

    expect(products[0].name)
      .toBe('Hamburguesa');

  });


  it('should persist stock adjustment', () => {

    const product =
      service.create(
        'Hamburguesa',
        250,
        120,
        10,
        'user-1'
      );

    service.adjustStock(
      product.id,
      5,
      'user-2'
    );

    const savedProduct =
      service.getById(product.id);

    expect(savedProduct)
      .toBeTruthy();

    expect(savedProduct!.stock)
      .toBe(15);

  });

});
