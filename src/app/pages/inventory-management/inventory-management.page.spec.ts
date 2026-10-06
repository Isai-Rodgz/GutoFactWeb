import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InventoryManagementPage } from './inventory-management.page';

import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { SessionService } from 'src/app/services/session.service';
import { CurrentShiftService } from 'src/app/services/current-shift.service';

describe('InventoryManagementPage', () => {

  let component: InventoryManagementPage;
  let fixture: ComponentFixture<InventoryManagementPage>;

  let productService: jasmine.SpyObj<ProductService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let inventoryService: jasmine.SpyObj<InventoryService>;
  let sessionService: jasmine.SpyObj<SessionService>;
  let currentShiftService: jasmine.SpyObj<CurrentShiftService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    productService = jasmine.createSpyObj(
      'ProductService',
      ['getAll']
    );

    categoryService = jasmine.createSpyObj(
      'CategoryService',
      ['getAll']
    );

    inventoryService = jasmine.createSpyObj(
      'InventoryService',
      [
        'addMovement',
        'getByProductId'
      ]
    );

    sessionService = jasmine.createSpyObj(
      'SessionService',
      ['user']
    );

    currentShiftService = jasmine.createSpyObj(
      'CurrentShiftService',
      ['getCurrentShift']
    );

    router = jasmine.createSpyObj(
      'Router',
      ['navigate']
    );

    productService.getAll.and.returnValue([]);
    categoryService.getAll.and.returnValue([]);
    sessionService.user.and.returnValue(null);
    currentShiftService.getCurrentShift.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        FormsModule
      ],
      declarations: [
        InventoryManagementPage
      ],
      providers: [
        {
          provide: ProductService,
          useValue: productService
        },
        {
          provide: CategoryService,
          useValue: categoryService
        },
        {
          provide: InventoryService,
          useValue: inventoryService
        },
        {
          provide: SessionService,
          useValue: sessionService
        },
        {
          provide: CurrentShiftService,
          useValue: currentShiftService
        },
        {
          provide: Router,
          useValue: router
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryManagementPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });


  // ---------------------------------------------------------
  // CREACIÓN
  // ---------------------------------------------------------

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });


  // ---------------------------------------------------------
  // CARGA DE INVENTARIO
  // ---------------------------------------------------------

  it('debería cargar los productos al iniciar', () => {

    const products = [
      {
        id: 'product-1',
        name: 'Hamburguesa',
        price: 10,
        cost: 5,
        stock: 20,
        isActive: true,
        createdAt: '2026-01-01',
        createdBy: 'user-1',
        updatedAt: '2026-01-01',
        updatedBy: 'user-1'
      }
    ];

    productService.getAll.and.returnValue(products);

    component.ngOnInit();

    expect(productService.getAll).toHaveBeenCalled();
    expect(component.products).toEqual(products);
  });


  it('debería cargar las categorías al iniciar', () => {

    const categories = [
      {
        id: 'category-1',
        name: 'Comidas',
        isActive: true,
        createdAt: '2026-01-01',
        createdBy: 'user-1',
        updatedAt: '2026-01-01',
        updatedBy: 'user-1'
      }
    ];

    categoryService.getAll.and.returnValue(categories);

    component.ngOnInit();

    expect(categoryService.getAll).toHaveBeenCalled();
    expect(component.categories).toEqual(categories);
  });


  // ---------------------------------------------------------
  // CATEGORÍAS
  // ---------------------------------------------------------

  it('debería obtener el nombre de una categoría', () => {

    component.categories = [
      {
        id: 'category-1',
        name: 'Comidas',
        isActive: true,
        createdAt: '2026-01-01',
        createdBy: 'user-1',
        updatedAt: '2026-01-01',
        updatedBy: 'user-1'
      }
    ];

    expect(
      component.getCategoryName('category-1')
    ).toBe('Comidas');
  });


  it('debería devolver "Sin categoría" si no existe categoryId', () => {

    expect(
      component.getCategoryName()
    ).toBe('Sin categoría');
  });


  it('debería devolver "Sin categoría" si la categoría no existe', () => {

    component.categories = [];

    expect(
      component.getCategoryName('category-999')
    ).toBe('Sin categoría');
  });


  // ---------------------------------------------------------
  // FORMULARIO DE MOVIMIENTO
  // ---------------------------------------------------------

  it('debería abrir el formulario de movimiento con valores iniciales', () => {

    component.selectedProductId = 'old-product';
    component.selectedMovementType = 'sale';
    component.selectedDirection = 'out';
    component.movementQuantity = 10;
    component.movementDescription = 'Prueba';
    component.movementError = '';

    component.openMovementForm();

    expect(component.showMovementForm).toBeTrue();
    expect(component.selectedProductId).toBe('');
    expect(component.selectedMovementType).toBe('purchase');
    expect(component.selectedDirection).toBe('in');
    expect(component.movementQuantity).toBeNull();
    expect(component.movementDescription).toBe('');
    expect(component.movementError).toBe('');
  });


  it('debería cerrar el formulario de movimiento', () => {

    component.showMovementForm = true;
    component.movementError = 'Error';

    component.closeMovementForm();

    expect(component.showMovementForm).toBeFalse();
    expect(component.movementError).toBe('');
  });


  // ---------------------------------------------------------
  // TIPO DE MOVIMIENTO
  // ---------------------------------------------------------

  it('debería establecer entrada para una compra', () => {

    component.selectedMovementType = 'purchase';

    component.onMovementTypeChange();

    expect(component.selectedDirection).toBe('in');
  });


  it('debería establecer entrada para una devolución', () => {

    component.selectedMovementType = 'return';

    component.onMovementTypeChange();

    expect(component.selectedDirection).toBe('in');
  });


  it('debería establecer salida para una venta', () => {

    component.selectedMovementType = 'sale';

    component.onMovementTypeChange();

    expect(component.selectedDirection).toBe('out');
  });


  it('debería establecer salida para un daño', () => {

    component.selectedMovementType = 'damage';

    component.onMovementTypeChange();

    expect(component.selectedDirection).toBe('out');
  });


  it('debería establecer entrada para un ajuste', () => {

    component.selectedMovementType = 'adjustment';

    component.onMovementTypeChange();

    expect(component.selectedDirection).toBe('in');
  });


  // ---------------------------------------------------------
  // REGISTRO DE MOVIMIENTO
  // ---------------------------------------------------------

  it('debería mostrar error si no hay usuario en sesión', () => {

    sessionService.user.and.returnValue(null);

    component.selectedProductId = 'product-1';
    component.movementQuantity = 5;

    component.saveMovement();

    expect(component.movementError)
      .toBe('No hay un usuario en sesión.');

    expect(inventoryService.addMovement)
      .not.toHaveBeenCalled();
  });


  it('debería mostrar error si no se selecciona un producto', () => {

    sessionService.user.and.returnValue({
      id: 'user-1'
    } as any);

    component.selectedProductId = '';
    component.movementQuantity = 5;

    component.saveMovement();

    expect(component.movementError)
      .toBe('Debe seleccionar un producto.');

    expect(inventoryService.addMovement)
      .not.toHaveBeenCalled();
  });


  it('debería mostrar error si la cantidad no es válida', () => {

    sessionService.user.and.returnValue({
      id: 'user-1'
    } as any);

    component.selectedProductId = 'product-1';
    component.movementQuantity = 0;

    component.saveMovement();

    expect(component.movementError)
      .toBe('La cantidad debe ser mayor que cero.');

    expect(inventoryService.addMovement)
      .not.toHaveBeenCalled();
  });


  it('debería registrar correctamente un movimiento', () => {

    sessionService.user.and.returnValue({
      id: 'user-1'
    } as any);

    currentShiftService.getCurrentShift.and.returnValue({
      id: 'shift-1'
    } as any);

    inventoryService.addMovement.and.returnValue({
      id: 'movement-1',
      productId: 'product-1',
      userId: 'user-1',
      shiftId: 'shift-1',
      type: 'purchase',
      direction: 'in',
      quantity: 10,
      createdAt: '2026-01-01'
    });

    component.products = [
      {
        id: 'product-1',
        name: 'Hamburguesa',
        price: 10,
        cost: 5,
        stock: 20,
        isActive: true,
        createdAt: '2026-01-01',
        createdBy: 'user-1',
        updatedAt: '2026-01-01',
        updatedBy: 'user-1'
      }
    ];

    component.showMovementForm = true;
    component.selectedProductId = 'product-1';
    component.selectedMovementType = 'purchase';
    component.selectedDirection = 'in';
    component.movementQuantity = 10;
    component.movementDescription = 'Compra inicial';

    component.saveMovement();

    expect(inventoryService.addMovement)
      .toHaveBeenCalledWith(
        'product-1',
        'user-1',
        'purchase',
        'in',
        10,
        'shift-1',
        'Compra inicial'
      );

    expect(component.showMovementForm).toBeFalse();
    expect(component.movementError).toBe('');
  });


  it('debería registrar un movimiento sin turno abierto', () => {

    sessionService.user.and.returnValue({
      id: 'user-1'
    } as any);

    currentShiftService.getCurrentShift.and.returnValue(null);

    inventoryService.addMovement.and.returnValue({
      id: 'movement-1',
      productId: 'product-1',
      userId: 'user-1',
      type: 'purchase',
      direction: 'in',
      quantity: 5,
      createdAt: '2026-01-01'
    });

    component.selectedProductId = 'product-1';
    component.selectedMovementType = 'purchase';
    component.selectedDirection = 'in';
    component.movementQuantity = 5;

    component.saveMovement();

    expect(inventoryService.addMovement)
      .toHaveBeenCalledWith(
        'product-1',
        'user-1',
        'purchase',
        'in',
        5,
        undefined,
        undefined
      );
  });


  it('debería mostrar el error devuelto por InventoryService', () => {

    sessionService.user.and.returnValue({
      id: 'user-1'
    } as any);

    inventoryService.addMovement.and.throwError(
      'No hay suficiente stock disponible.'
    );

    component.selectedProductId = 'product-1';
    component.selectedMovementType = 'sale';
    component.selectedDirection = 'out';
    component.movementQuantity = 50;

    component.saveMovement();

    expect(component.movementError)
      .toBe('No hay suficiente stock disponible.');
  });


  // ---------------------------------------------------------
  // HISTORIAL
  // ---------------------------------------------------------

  it('debería abrir el historial de movimientos de un producto', () => {

    const product = {
      id: 'product-1',
      name: 'Hamburguesa',
      price: 10,
      cost: 5,
      stock: 20,
      isActive: true,
      createdAt: '2026-01-01',
      createdBy: 'user-1',
      updatedAt: '2026-01-01',
      updatedBy: 'user-1'
    };

    const movements = [
      {
        id: 'movement-1',
        productId: 'product-1',
        userId: 'user-1',
        type: 'purchase' as const,
        direction: 'in' as const,
        quantity: 10,
        createdAt: '2026-01-01'
      }
    ];

    inventoryService.getByProductId.and.returnValue(movements);

    component.viewMovementHistory(product);

    expect(component.selectedProductForHistory).toEqual(product);
    expect(component.productMovements).toEqual(movements);
    expect(component.showMovementHistory).toBeTrue();

    expect(inventoryService.getByProductId)
      .toHaveBeenCalledWith('product-1');
  });


  it('debería cerrar el historial de movimientos', () => {

    component.showMovementHistory = true;

    component.selectedProductForHistory = {
      id: 'product-1',
      name: 'Hamburguesa',
      price: 10,
      cost: 5,
      stock: 20,
      isActive: true,
      createdAt: '2026-01-01',
      createdBy: 'user-1',
      updatedAt: '2026-01-01',
      updatedBy: 'user-1'
    };

    component.productMovements = [
      {
        id: 'movement-1',
        productId: 'product-1',
        userId: 'user-1',
        type: 'purchase',
        direction: 'in',
        quantity: 10,
        createdAt: '2026-01-01'
      }
    ];

    component.closeMovementHistory();

    expect(component.showMovementHistory).toBeFalse();
    expect(component.selectedProductForHistory).toBeNull();
    expect(component.productMovements).toEqual([]);
  });


  // ---------------------------------------------------------
  // ETIQUETAS
  // ---------------------------------------------------------

  it('debería devolver la etiqueta correcta para cada tipo de movimiento', () => {

    expect(component.getMovementTypeLabel('purchase'))
      .toBe('Compra');

    expect(component.getMovementTypeLabel('sale'))
      .toBe('Venta');

    expect(component.getMovementTypeLabel('adjustment'))
      .toBe('Ajuste');

    expect(component.getMovementTypeLabel('damage'))
      .toBe('Daño');

    expect(component.getMovementTypeLabel('return'))
      .toBe('Devolución');
  });


  it('debería devolver la etiqueta correcta para la dirección', () => {

    expect(component.getMovementDirectionLabel('in'))
      .toBe('Entrada');

    expect(component.getMovementDirectionLabel('out'))
      .toBe('Salida');
  });


  // ---------------------------------------------------------
  // NAVEGACIÓN
  // ---------------------------------------------------------

  it('debería regresar al escritorio de trabajo', () => {

    component.goToWorkDesk();

    expect(router.navigate)
      .toHaveBeenCalledWith(['/work-desk']);
  });

});