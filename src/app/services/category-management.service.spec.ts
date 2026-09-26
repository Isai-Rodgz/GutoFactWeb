import { TestBed } from '@angular/core/testing';

import { CategoryManagementService } from './category-management.service';
import { CategoryService } from './category.service';
import { ProductService } from './product.service';
import { StorageService } from './storage.service';

describe('CategoryManagementService', () => {

    let service: CategoryManagementService;
    let categoryService: CategoryService;
    let productService: ProductService;
    let storage: StorageService;

    const userId = 'user-1';
    const otherUserId = 'user-2';

    beforeEach(() => {

    TestBed.configureTestingModule({
    providers: [
        CategoryManagementService,
        CategoryService,
        ProductService,
        StorageService
    ]
    });

    service =
      TestBed.inject(
        CategoryManagementService
      );

    categoryService =
      TestBed.inject(
        CategoryService
      );

    productService =
      TestBed.inject(
        ProductService
      );

    storage =
      TestBed.inject(
        StorageService
      );

    storage.clear();
  });

  afterEach(() => {
    storage.clear();
  });

  it('debería crear el servicio', () => {

    expect(service)
      .toBeTruthy();
  });

  it('debería desactivar una categoría que no tiene productos activos', () => {

    const category =
      categoryService.create(
        'Bebidas',
        userId
      );

    const result =
      service.deactivate(
        category.id,
        otherUserId
      );

    expect(result.isActive)
      .toBeFalse();

    expect(result.id)
      .toBe(category.id);

    expect(result.updatedBy)
      .toBe(otherUserId);

    const stored =
      categoryService.getById(
        category.id
      );

    expect(stored)
      .not.toBeNull();

    expect(stored!.isActive)
      .toBeFalse();
  });

  it('no debería desactivar una categoría que tenga productos activos', () => {

    const category =
      categoryService.create(
        'Bebidas',
        userId
      );

productService.create(
  'Coca Cola',
  100,
  50,
  10,
  userId,
  undefined,
  category.id
);

    expect(() =>
      service.deactivate(
        category.id,
        otherUserId
      )
    ).toThrowError(
      /No se puede desactivar la categoría porque tiene productos activos/
    );

    const stored =
      categoryService.getById(
        category.id
      );

    expect(stored!.isActive)
      .toBeTrue();
  });

  it('debería permitir desactivar una categoría cuando sus productos están inactivos', () => {

    const category =
      categoryService.create(
        'Bebidas',
        userId
      );

const product =
  productService.create(
    'Coca Cola',
    100,
    50,
    10,
    userId,
    undefined,
    category.id
  );

    productService.update(
      product.id,
      userId,
      {
        isActive: false
      }
    );

    const result =
      service.deactivate(
        category.id,
        otherUserId
      );

    expect(result.isActive)
      .toBeFalse();
  });

  it('no debería desactivar una categoría inexistente', () => {

    expect(() =>
      service.deactivate(
        'categoria-inexistente',
        userId
      )
    ).toThrowError(
      /La categoría no existe/
    );
  });

  it('no debería desactivar una categoría que ya está desactivada', () => {

    const category =
      categoryService.create(
        'Bebidas',
        userId
      );

    categoryService.update(
      category.id,
      userId,
      {
        isActive: false
      }
    );

    expect(() =>
      service.deactivate(
        category.id,
        otherUserId
      )
    ).toThrowError(
      /La categoría ya está desactivada/
    );
  });

  it('debería ignorar productos de otras categorías', () => {

    const category =
      categoryService.create(
        'Bebidas',
        userId
      );

    const otherCategory =
      categoryService.create(
        'Comidas',
        userId
      );

productService.create(
  'Hamburguesa',
  250,
  100,
  10,
  userId,
  undefined,
  otherCategory.id
);

    const result =
      service.deactivate(
        category.id,
        otherUserId
      );

    expect(result.isActive)
      .toBeFalse();

    expect(
      categoryService
        .getById(category.id)!
        .isActive
    ).toBeFalse();

    expect(
      categoryService
        .getById(otherCategory.id)!
        .isActive
    ).toBeTrue();
  });

  it('debería permitir desactivar una categoría aunque tenga productos inactivos y otros productos activos de otra categoría', () => {

    const category =
      categoryService.create(
        'Bebidas',
        userId
      );

    const otherCategory =
      categoryService.create(
        'Comidas',
        userId
      );

    const inactiveProduct =
      productService.create(
        'Coca Cola',
        100,
        50,
        10,
        userId,
        undefined,
        category.id
      );

    productService.update(
      inactiveProduct.id,
      userId,
      {
        isActive: false
      }
    );

    productService.create(
      'Hamburguesa',
      250,
      100,
      10,
      userId,
      undefined,
      otherCategory.id
    );

    const result =
      service.deactivate(
        category.id,
        otherUserId
      );

    expect(result.isActive)
      .toBeFalse();
  });

});