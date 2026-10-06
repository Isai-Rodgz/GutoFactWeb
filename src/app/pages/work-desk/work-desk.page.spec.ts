import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

import { WorkDeskPage } from './work-desk.page';

import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { ShiftService } from 'src/app/services/shift.service';
import { CurrentShiftService } from 'src/app/services/current-shift.service';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { TicketService } from 'src/app/services/ticket.service';
import { Product } from 'src/app/models/product.model';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketItem } from 'src/app/models/ticket-item.model';
import { TicketItemService } from 'src/app/services/ticket-item.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { TicketManagementService } from 'src/app/services/ticket-management.service';


describe('WorkDeskPage', () => {

  let component: WorkDeskPage;
  let fixture: ComponentFixture<WorkDeskPage>;

  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let sessionSpy: jasmine.SpyObj<SessionService>;
  let shiftServiceSpy: jasmine.SpyObj<ShiftService>;
  let currentShiftServiceSpy: jasmine.SpyObj<CurrentShiftService>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let ticketServiceSpy: jasmine.SpyObj<TicketService>;
  let ticketItemServiceSpy: jasmine.SpyObj<TicketItemService>;
  let menuControllerSpy: jasmine.SpyObj<MenuController>;
  let checkoutService: jasmine.SpyObj<CheckoutService>;
  let ticketManagementServiceSpy: jasmine.SpyObj<TicketManagementService>;


  const user = {
    id: 'user-1',
    empresa: 'Empresa de prueba',
    email: 'test@test.com',
    country: 'República Dominicana'
  } as any;


  const shift = {
    id: 'shift-1',
    userId: 'user-1',
    openedAt: '2026-01-01T10:00:00.000Z',
    initialCash: 1000,
    status: 'open',
    openedBy: 'user-1',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z'
  } as any;


  const category1 = {
    id: 'category-1',
    name: 'Bebidas',
    description: 'Bebidas',
    isActive: true
  } as any;


  const category2 = {
    id: 'category-2',
    name: 'Comidas',
    description: 'Comidas',
    isActive: true
  } as any;


  const product1 = {
    id: 'product-1',
    name: 'Coca Cola',
    price: 100,
    stock: 10,
    categoryId: 'category-1',
    isActive: true
  } as any;


  const product2 = {
    id: 'product-2',
    name: 'Hamburguesa',
    price: 350,
    stock: 10,
    categoryId: 'category-2',
    isActive: true
  } as any;


  const ticket = {
    id: 'ticket-1',
    shiftId: 'shift-1',
    userId: 'user-1',
    number: 1,
    status: 'open',
    createdAt: '2026-01-01T10:00:00.000Z'
  } as any;


  const ticketItem = {
    id: 'ticket-item-1',
    ticketId: 'ticket-1',
    productId: 'product-1',
    quantity: 1,
    unitPrice: 100,
    subtotal: 100,
    addedAt: '2026-01-01T10:01:00.000Z'
  } as any;


  beforeEach(async () => {

    authSpy = jasmine.createSpyObj(
      'AuthService',
      ['logout']
    );

    routerSpy = jasmine.createSpyObj(
      'Router',
      ['navigate']
    );

    sessionSpy = jasmine.createSpyObj(
      'SessionService',
      ['user']
    );

    shiftServiceSpy = jasmine.createSpyObj(
      'ShiftService',
      ['openShift']
    );

    currentShiftServiceSpy = jasmine.createSpyObj(
      'CurrentShiftService',
      ['getCurrentShift']
    );

    productServiceSpy = jasmine.createSpyObj(
      'ProductService',
      ['getActive']
    );

    categoryServiceSpy = jasmine.createSpyObj(
      'CategoryService',
      ['getActive']
    );

    ticketServiceSpy = jasmine.createSpyObj(
      'TicketService',
      [ 'getById',
        'getByShiftId',
        'create',
        'markAsPaid'
      ]
    );

    ticketItemServiceSpy = jasmine.createSpyObj(
      'TicketItemService',
      [
        'add',
        'getByTicketId',
        'getTicketTotal'
      ]
    );

    menuControllerSpy = jasmine.createSpyObj(
      'MenuController',
      [
        'open',
        'close'
      ]
    );

    checkoutService = jasmine.createSpyObj(
      'CheckoutService',
      ['checkout']
    );

    ticketManagementServiceSpy = jasmine.createSpyObj(
      'TicketManagementService',
      ['cancel', 'delete']
    );


    sessionSpy.user.and.returnValue(user);

    currentShiftServiceSpy.getCurrentShift
      .and.returnValue(shift);

    productServiceSpy.getActive
      .and.returnValue([
        product1,
        product2
      ]);

    categoryServiceSpy.getActive
      .and.returnValue([
        category1,
        category2
      ]);

    ticketServiceSpy.create
      .and.returnValue(ticket);

    ticketServiceSpy.getByShiftId.and.returnValue([]);

    ticketItemServiceSpy.add
      .and.returnValue(ticketItem);

    ticketItemServiceSpy.getByTicketId
      .and.returnValue([ticketItem]);

    ticketItemServiceSpy.getTicketTotal
      .and.returnValue(100);

    shiftServiceSpy.openShift
      .and.returnValue(shift);


    routerSpy.navigate
      .and.returnValue(Promise.resolve(true));

    menuControllerSpy.open
      .and.returnValue(Promise.resolve(true));

    menuControllerSpy.close
      .and.returnValue(Promise.resolve(true));


    await TestBed.configureTestingModule({

      imports: [
        CommonModule,
        FormsModule,
        IonicModule
      ],

      declarations: [
        WorkDeskPage
      ],

      providers: [
        {
          provide: AuthService,
          useValue: authSpy
        },
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: SessionService,
          useValue: sessionSpy
        },
        {
          provide: ShiftService,
          useValue: shiftServiceSpy
        },
        {
          provide: CurrentShiftService,
          useValue: currentShiftServiceSpy
        },
        {
          provide: ProductService,
          useValue: productServiceSpy
        },
        {
          provide: CategoryService,
          useValue: categoryServiceSpy
        },
        {
          provide: TicketService,
          useValue: ticketServiceSpy
        },
        {
          provide: TicketItemService,
          useValue: ticketItemServiceSpy
        },
        {
          provide: MenuController,
          useValue: menuControllerSpy
        },
        {
          provide: CheckoutService,
          useValue: checkoutService
        },
        {
          provide: TicketManagementService,
          useValue: ticketManagementServiceSpy
        }
      ]

    }).compileComponents();


    fixture = TestBed.createComponent(WorkDeskPage);

    component = fixture.componentInstance;

    fixture.detectChanges();

  });


  // ============================================================
  // CREACIÓN E INICIALIZACIÓN
  // ============================================================

  describe('Creación e inicialización', () => {

    it('debería crear el componente', () => {

      expect(component).toBeTruthy();

    });


    it('debería cargar el turno actual y el catálogo al inicializarse cuando existe un usuario en sesión', () => {

      expect(
        currentShiftServiceSpy.getCurrentShift
      ).toHaveBeenCalled();

      expect(component.currentShift)
        .toEqual(shift);

      expect(component.products)
        .toEqual([product1, product2]);

      expect(component.categories)
        .toEqual([category1, category2]);

    });


    it('no debería cargar el turno ni el catálogo cuando no existe un usuario en sesión', () => {

      sessionSpy.user.and.returnValue(null);

      currentShiftServiceSpy.getCurrentShift.calls.reset();
      productServiceSpy.getActive.calls.reset();
      categoryServiceSpy.getActive.calls.reset();

      component.ngOnInit();

      expect(
        currentShiftServiceSpy.getCurrentShift
      ).not.toHaveBeenCalled();

      expect(
        productServiceSpy.getActive
      ).not.toHaveBeenCalled();

      expect(
        categoryServiceSpy.getActive
      ).not.toHaveBeenCalled();

    });


    it('debería actualizar el turno y el catálogo cuando la página vuelve a mostrarse', () => {

      currentShiftServiceSpy.getCurrentShift.calls.reset();
      productServiceSpy.getActive.calls.reset();
      categoryServiceSpy.getActive.calls.reset();

      component.ionViewWillEnter();

      expect(
        currentShiftServiceSpy.getCurrentShift
      ).toHaveBeenCalled();

      expect(
        productServiceSpy.getActive
      ).toHaveBeenCalled();

      expect(
        categoryServiceSpy.getActive
      ).toHaveBeenCalled();

    });

  });


  // ============================================================
  // APERTURA DE TURNO
  // ============================================================

  describe('Apertura de turno', () => {

    it('debería abrir el formulario para abrir un turno', () => {

      component.openShiftModal();

      expect(component.showOpenShiftModal)
        .toBeTrue();

      expect(component.initialCash)
        .toBeNull();

      expect(component.shiftError)
        .toBe('');

    });


    it('debería cerrar el formulario para abrir un turno', () => {

      component.showOpenShiftModal = true;
      component.initialCash = 500;
      component.shiftError = 'Error';

      component.closeOpenShiftModal();

      expect(component.showOpenShiftModal)
        .toBeFalse();

      expect(component.initialCash)
        .toBeNull();

      expect(component.shiftError)
        .toBe('');

    });


    it('debería mostrar un error si se intenta abrir un turno sin usuario en sesión', async () => {

      sessionSpy.user.and.returnValue(null);

      component.initialCash = 500;

      await component.openShift();

      expect(component.shiftError)
        .toBe('No hay un usuario en sesión.');

      expect(
        shiftServiceSpy.openShift
      ).not.toHaveBeenCalled();

    });


    it('debería mostrar un error si el efectivo inicial es inválido', async () => {

      component.initialCash = -1;

      await component.openShift();

      expect(component.shiftError)
        .toBe(
          'El efectivo inicial no puede ser negativo.'
        );

      expect(
        shiftServiceSpy.openShift
      ).not.toHaveBeenCalled();

    });


    it('debería abrir el turno correctamente', async () => {

      component.showOpenShiftModal = true;
      component.initialCash = 500;

      await component.openShift();

      expect(
        shiftServiceSpy.openShift
      ).toHaveBeenCalledWith(
        user.id,
        500
      );

      expect(component.currentShift)
        .toEqual(shift);

      expect(component.showOpenShiftModal)
        .toBeFalse();

      expect(component.initialCash)
        .toBeNull();

      expect(component.shiftError)
        .toBe('');

    });


    it('debería mostrar un error cuando falla la apertura del turno', async () => {

      shiftServiceSpy.openShift.and.throwError(
        'No se puede abrir otro turno.'
      );

      component.initialCash = 500;

      await component.openShift();

      expect(component.shiftError)
        .toBe('No se puede abrir otro turno.');

    });

  });


  // ============================================================
  // CATÁLOGO DE PRODUCTOS
  // ============================================================

  describe('Catálogo de productos', () => {

    it('debería cargar los productos y categorías activos', () => {

      component['loadCatalog']();

      expect(component.products)
        .toEqual([product1, product2]);

      expect(component.categories)
        .toEqual([category1, category2]);

    });


    it('debería mostrar todos los productos cuando no hay una categoría seleccionada', () => {

      component.selectedCategoryId = null;

      component.searchTerm = '';

      component['applyProductFilters']();

      expect(component.filteredProducts)
        .toEqual([product1, product2]);

    });


    it('debería filtrar los productos por categoría', () => {

      component.selectCategory('category-1');

      expect(component.filteredProducts)
        .toEqual([product1]);

    });


    it('debería filtrar los productos por término de búsqueda', () => {

      component.searchTerm = 'coca';

      component.onSearchChange();

      expect(component.filteredProducts)
        .toEqual([product1]);

    });


    it('debería combinar el filtro de categoría con la búsqueda', () => {

      component.selectedCategoryId = 'category-1';
      component.searchTerm = 'coca';

      component.onSearchChange();

      expect(component.filteredProducts)
        .toEqual([product1]);

    });


    it('debería devolver el nombre de la categoría seleccionada', () => {

      component.selectedCategoryId = 'category-1';

      expect(
        component.getSelectedCategoryName()
      ).toBe('Bebidas');

    });


    it('debería devolver "Todos los artículos" cuando no hay categoría seleccionada', () => {

      component.selectedCategoryId = null;

      expect(
        component.getSelectedCategoryName()
      ).toBe('Todos los artículos');

    });


    it('debería devolver "Todos los artículos" cuando la categoría seleccionada no existe', () => {

      component.selectedCategoryId = 'category-inexistente';

      expect(
        component.getSelectedCategoryName()
      ).toBe('Todos los artículos');

    });

  });


  // ============================================================
  // TICKET ACTUAL
  // ============================================================

  describe('Ticket actual', () => {

    it('debería mostrar un error al agregar un producto sin turno abierto', () => {

      component.currentShift = null;

      component.addProduct(product1);

      expect(component.ticketError)
        .toBe('No hay un turno abierto.');

      expect(
        ticketServiceSpy.create
      ).not.toHaveBeenCalled();

    });


    it('debería mostrar un error al agregar un producto sin usuario en sesión', () => {

      sessionSpy.user.and.returnValue(null);

      component.addProduct(product1);

      expect(component.ticketError)
        .toBe('No hay un usuario en sesión.');

      expect(
        ticketServiceSpy.create
      ).not.toHaveBeenCalled();

    });


    it('debería crear un ticket al agregar el primer producto', () => {

      component.currentTicket = null;

      component.addProduct(product1);

      expect(
        ticketServiceSpy.create
      ).toHaveBeenCalledWith(
        shift.id,
        user.id
      );

      expect(component.currentTicket)
        .toEqual(ticket);

    });


    it('debería agregar un producto a un ticket existente', () => {

      component.currentTicket = ticket;

      ticketServiceSpy.create.calls.reset();

      component.addProduct(product2);

      expect(
        ticketServiceSpy.create
      ).not.toHaveBeenCalled();

      expect(
        ticketItemServiceSpy.add
      ).toHaveBeenCalledWith(
        ticket.id,
        product2.id,
        1
      );

    });


    it('debería actualizar los productos del ticket después de agregar un producto', () => {

      component.addProduct(product1);

      expect(
        ticketItemServiceSpy.getByTicketId
      ).toHaveBeenCalledWith(ticket.id);

      expect(component.ticketItems)
        .toEqual([ticketItem]);

    });


    it('debería actualizar el total del ticket después de agregar un producto', () => {

      component.addProduct(product1);

      expect(
        ticketItemServiceSpy.getTicketTotal
      ).toHaveBeenCalledWith(ticket.id);

      expect(component.ticketTotal)
        .toBe(100);

    });


    it('debería mostrar un error cuando falla la creación o actualización del ticket', () => {

      ticketItemServiceSpy.add.and.throwError(
        'No se pudo agregar el producto.'
      );

      component.addProduct(product1);

      expect(component.ticketError)
        .toBe('No se pudo agregar el producto.');

    });

  });


  // ============================================================
  // MENÚ Y NAVEGACIÓN
  // ============================================================

  describe('Menú y navegación', () => {

    it('debería abrir el menú lateral', async () => {

      await component.openMenu();

      expect(
        menuControllerSpy.open
      ).toHaveBeenCalled();

    });


    it('debería cerrar el menú y navegar a Categorías', async () => {

      await component.goToCategories();

      expect(
        menuControllerSpy.close
      ).toHaveBeenCalled();

      expect(
        routerSpy.navigate
      ).toHaveBeenCalledWith(
        ['/category-management']
      );

    });


    it('debería cerrar el menú y navegar a Productos', async () => {

      await component.goToProducts();

      expect(
        menuControllerSpy.close
      ).toHaveBeenCalled();

      expect(
        routerSpy.navigate
      ).toHaveBeenCalledWith(
        ['/product-management']
      );

    });


    it('debería cerrar el menú y navegar a Inventario', async () => {

      await component.goToInventory();

      expect(
        menuControllerSpy.close
      ).toHaveBeenCalled();

      expect(
        routerSpy.navigate
      ).toHaveBeenCalledWith(
        ['/inventory-management']
      );

    });


    it('debería cerrar el menú y navegar a Caja / Turnos', async () => {

      await component.goToCashManagement();

      expect(
        menuControllerSpy.close
      ).toHaveBeenCalled();

      expect(
        routerSpy.navigate
      ).toHaveBeenCalledWith(
        ['/cash-management']
      );

    });


    it('debería cerrar el menú al volver al Punto de venta', async () => {

      await component.goToWorkDesk();

      expect(
        menuControllerSpy.close
      ).toHaveBeenCalled();

    });

  });


  // ============================================================
  // CERRAR SESIÓN
  // ============================================================

  describe('Cerrar sesión', () => {

    it('debería cerrar la sesión y navegar a la página principal', () => {

      component.logout();

      expect(
        authSpy.logout
      ).toHaveBeenCalled();

      expect(
        routerSpy.navigate
      ).toHaveBeenCalledWith(
        ['/mainpage']
      );

    });

  });


  it('debe abrir el modal de cobro cuando existe un ticket con productos', () => {
    component.currentTicket = {
      id: 'ticket-1'
    } as any;

    component.ticketItems = [
      {
        id: 'item-1'
      }
    ] as any;

    component.openCheckout();

    expect(component.showCheckoutModal).toBeTrue();
    expect(component.paymentMethod).toBe('cash');
  });


  it('debe confirmar el pago del ticket correctamente', () => {
    component.currentTicket = {
      id: 'ticket-1'
    } as any;

    component.ticketItems = [
      {
        id: 'item-1'
      }
    ] as any;

    component.paymentMethod = 'cash';

    checkoutService.checkout.and.returnValue({
      id: 'sale-1'
    } as any);

    component.confirmCheckout();

    expect(checkoutService.checkout).toHaveBeenCalledWith(
      'ticket-1',
      'cash',
      undefined
    );

    expect(component.currentTicket).toBeNull();
    expect(component.ticketItems.length).toBe(0);
    expect(component.ticketTotal).toBe(0);
  });


  it('debe rechazar un pago con tarjeta sin referencia', () => {
    component.currentTicket = {
      id: 'ticket-1'
    } as any;

    component.ticketItems = [
      {
        id: 'item-1'
      }
    ] as any;

    component.paymentMethod = 'card';
    component.paymentReference = '';

    component.confirmCheckout();

    expect(component.checkoutError)
      .toBe('Debe ingresar la referencia del pago con tarjeta.');

    expect(checkoutService.checkout)
      .not.toHaveBeenCalled();
  });


  it('debe confirmar un pago con tarjeta usando su referencia', () => {
    component.currentTicket = {
      id: 'ticket-1'
    } as any;

    component.ticketItems = [
      {
        id: 'item-1'
      }
    ] as any;

    component.paymentMethod = 'card';
    component.paymentReference = 'CARD-12345';

    checkoutService.checkout.and.returnValue({
      id: 'sale-1'
    } as any);

    component.confirmCheckout();

    expect(checkoutService.checkout).toHaveBeenCalledWith(
      'ticket-1',
      'card',
      'CARD-12345'
    );
  });



  it('debe mostrar el error cuando el cobro falla', () => {
    component.currentTicket = {
      id: 'ticket-1'
    } as any;

    component.ticketItems = [
      {
        id: 'item-1'
      }
    ] as any;

    checkoutService.checkout.and.throwError(
      'Error simulado de cobro.'
    );

    component.confirmCheckout();

    expect(component.checkoutError)
      .toBe('Error simulado de cobro.');
  });


  it('debe rechazar una transferencia sin referencia', () => {

    component.currentTicket = {
      id: 'ticket-1',
      shiftId: 'shift-1',
      userId: 'user-1',
      number: 1,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    component.ticketItems = [
      {
        id: 'item-1',
        addedAt: new Date().toISOString(),
        ticketId: 'ticket-1',
        productId: 'product-1',
        quantity: 1,
        unitPrice: 100,
        subtotal: 100
      }
    ];

    component.paymentMethod = 'transfer';
    component.paymentReference = '';

    component.confirmCheckout();

    expect(component.checkoutError)
      .toBe(
        'Debe ingresar la referencia de la transferencia.'
      );

    expect(checkoutService.checkout)
      .not.toHaveBeenCalled();
  });

  it('debe completar un pago por transferencia con referencia', () => {

    component.currentTicket = {
      id: 'ticket-1',
      shiftId: 'shift-1',
      userId: 'user-1',
      number: 1,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    component.ticketItems = [
      {
        id: 'item-1',
        addedAt: new Date().toISOString(),
        ticketId: 'ticket-1',
        productId: 'product-1',
        quantity: 1,
        unitPrice: 100,
        subtotal: 100
      }
    ];

    component.ticketTotal = 100;

    component.paymentMethod = 'transfer';

    component.paymentReference =
      'TRANSFER-12345';

    checkoutService.checkout.and.returnValue({
      id: 'sale-1',
      shiftId: 'shift-1',
      userId: 'user-1',
      ticketId: 'ticket-1',
      total: 100,
      paymentMethod: 'transfer',
      paymentReference: 'TRANSFER-12345',
      status: 'completed',
      createdAt: new Date().toISOString()
    });

    component.confirmCheckout();

    expect(checkoutService.checkout)
      .toHaveBeenCalledWith(
        'ticket-1',
        'transfer',
        'TRANSFER-12345'
      );

    expect(component.currentTicket)
      .toBeNull();

    expect(component.ticketItems)
      .toEqual([]);

    expect(component.ticketTotal)
      .toBe(0);

    expect(component.showCheckoutModal)
      .toBeFalse();
  });


    it('debe seleccionar transferencia y limpiar la referencia', () => {
    component.paymentReference = 'CARD-12345';
    component.paymentMethod = 'card';

    component.selectPaymentMethod('transfer');

    expect(component.paymentMethod).toBe('transfer');
    expect(component.paymentReference).toBe('');
    expect(component.checkoutError).toBe('');
  });



  it('debería cargar los tickets abiertos del turno actual', () => {
    const shiftId = 'shift-1';
    const userId = 'user-1';

    const ticket1 = {
      id: 'ticket-1',
      shiftId,
      userId,
      number: 1,
      status: 'open' as const,
      createdAt: new Date().toISOString()
    };

    const ticket2 = {
      id: 'ticket-2',
      shiftId,
      userId,
      number: 2,
      status: 'open' as const,
      createdAt: new Date().toISOString()
    };

    currentShiftServiceSpy.getCurrentShift.and.returnValue({
      id: shiftId,
      userId,
      openedAt: new Date().toISOString(),
      initialCash: 1000,
      status: 'open',
      openedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    ticketServiceSpy.getByShiftId.and.returnValue([ticket1, ticket2]);

    component.currentShift = currentShiftServiceSpy.getCurrentShift();

    component['loadOpenTickets']();

    expect(component.openTickets.length).toBe(2);
    expect(component.openTickets[0].id).toBe(ticket1.id);
    expect(component.openTickets[1].id).toBe(ticket2.id);
  });

  it('debería ignorar tickets que no estén abiertos al cargar los tickets', () => {
    const shiftId = 'shift-1';
    const userId = 'user-1';

    const ticket1 = {
      id: 'ticket-1',
      shiftId,
      userId,
      number: 1,
      status: 'cancelled' as const,
      createdAt: new Date().toISOString()
    };

    const ticket2 = {
      id: 'ticket-2',
      shiftId,
      userId,
      number: 2,
      status: 'open' as const,
      createdAt: new Date().toISOString()
    };

    ticketServiceSpy.getByShiftId.and.returnValue([ticket1, ticket2]);

    component.currentShift = {
      id: shiftId,
      userId,
      openedAt: new Date().toISOString(),
      initialCash: 1000,
      status: 'open',
      openedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    component['loadOpenTickets']();

    expect(component.openTickets.length).toBe(1);
    expect(component.openTickets[0].id).toBe(ticket2.id);
  });

  it('debería ordenar los tickets abiertos por número', () => {
    const shiftId = 'shift-1';
    const userId = 'user-1';

    const ticket1 = {
      id: 'ticket-1',
      shiftId,
      userId,
      number: 3,
      status: 'open' as const,
      createdAt: new Date().toISOString()
    };

    const ticket2 = {
      id: 'ticket-2',
      shiftId,
      userId,
      number: 1,
      status: 'open' as const,
      createdAt: new Date().toISOString()
    };

    const ticket3 = {
      id: 'ticket-3',
      shiftId,
      userId,
      number: 2,
      status: 'open' as const,
      createdAt: new Date().toISOString()
    };

    ticketServiceSpy.getByShiftId.and.returnValue([
      ticket1,
      ticket2,
      ticket3
    ]);

    component.currentShift = {
      id: shiftId,
      userId,
      openedAt: new Date().toISOString(),
      initialCash: 1000,
      status: 'open',
      openedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    component['loadOpenTickets']();

    expect(component.openTickets.length).toBe(3);
    expect(component.openTickets[0].number).toBe(1);
    expect(component.openTickets[1].number).toBe(2);
    expect(component.openTickets[2].number).toBe(3);
  });

  it('debería dejar la lista vacía cuando no hay turno abierto', () => {
    component.currentShift = null;
    component.openTickets = [];

    component['loadOpenTickets']();

    expect(component.openTickets.length).toBe(0);
  });

  it('debería crear un nuevo ticket y seleccionarlo', () => {
    const shiftId = 'shift-1';
    const userId = 'user-1';

    const ticket = {
      id: 'ticket-1',
      shiftId,
      userId,
      number: 1,
      status: 'open' as const,
      createdAt: new Date().toISOString()
    };

    component.currentShift = {
      id: shiftId,
      userId,
      openedAt: new Date().toISOString(),
      initialCash: 1000,
      status: 'open',
      openedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    sessionSpy.user.and.returnValue({
      id: userId
    } as any);

    ticketServiceSpy.create.and.returnValue(ticket);
    ticketServiceSpy.getByShiftId.and.returnValue([ticket]);
    ticketItemServiceSpy.getByTicketId.and.returnValue([]);
    ticketItemServiceSpy.getTicketTotal.and.returnValue(0);

    component.createTicket();

    expect(component.currentTicket).not.toBeNull();
    expect(component.currentTicket?.id).toBe(ticket.id);
    expect(component.currentTicket?.shiftId).toBe(shiftId);
    expect(component.currentTicket?.userId).toBe(userId);
    expect(component.currentTicket?.status).toBe('open');

    expect(component.openTickets.length).toBe(1);
    expect(component.openTickets[0].id).toBe(ticket.id);
  });

  it('debería rechazar la creación de un ticket sin turno abierto', () => {
    component.currentShift = null;

    component.createTicket();

    expect(component.currentTicket).toBeNull();
    expect(component.ticketError).toBe('No hay un turno abierto.');
  });

  it('debería rechazar la creación de un ticket sin usuario en sesión', () => {
    component.currentShift = {
      id: 'shift-1',
      userId: 'user-1',
      openedAt: new Date().toISOString(),
      initialCash: 1000,
      status: 'open',
      openedBy: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    sessionSpy.user.and.returnValue(null);

    component.createTicket();

    expect(component.currentTicket).toBeNull();
    expect(component.ticketError).toBe('No hay un usuario en sesión.');
  });

  it('WorkDeskPage debería seleccionar un ticket abierto', () => {
    const ticket: Ticket = {
      id: 'ticket-2',
      shiftId: shift.id,
      userId: user.id,
      number: 2,
      status: 'open',
      createdAt: '2026-01-01T11:00:00.000Z'
    };

    ticketServiceSpy.getByShiftId.and.returnValue([ticket]);

    component.ngOnInit();

    expect(component.openTickets.length).toBe(1);
    expect(component.openTickets[0].id).toBe(ticket.id);

    component.selectTicket(ticket);

    expect(component.currentTicket?.id).toBe(ticket.id);
  });

  it('debería cargar los productos y total del ticket seleccionado', () => {
    const product = {
      id: 'product-1',
      name: 'Hamburguesa',
      price: 250,
      cost: 100,
      stock: 10,
      isActive: true
    } as any;

    const ticket = {
      id: 'ticket-1',
      shiftId: 'shift-1',
      userId: 'user-1',
      number: 1,
      status: 'open' as const,
      createdAt: new Date().toISOString()
    };

    const item = {
      id: 'item-1',
      ticketId: ticket.id,
      productId: product.id,
      quantity: 2,
      unitPrice: 250,
      subtotal: 500,
      addedAt: new Date().toISOString()
    };

    ticketItemServiceSpy.getByTicketId.and.returnValue([item]);
    ticketItemServiceSpy.getTicketTotal.and.returnValue(500);

    component.selectTicket(ticket);

    expect(component.currentTicket?.id).toBe(ticket.id);
    expect(component.ticketItems.length).toBe(1);
    expect(component.ticketItems[0].productId).toBe(product.id);
    expect(component.ticketTotal).toBe(500);
  });

  it('debería rechazar la selección de un ticket que no está abierto', () => {
    const ticket = {
      id: 'ticket-1',
      shiftId: 'shift-1',
      userId: 'user-1',
      number: 1,
      status: 'cancelled' as const,
      createdAt: new Date().toISOString()
    };

    component.currentTicket = null;

    component.selectTicket(ticket);

    expect(component.currentTicket).toBeNull();
    expect(component.ticketError).toBe('El ticket no está abierto.');
  });



  it('WorkDeskPage debería permitir crear un segundo ticket', () => {
    const ticket1: Ticket = {
      id: 'ticket-1',
      shiftId: shift.id,
      userId: user.id,
      number: 1,
      status: 'open',
      createdAt: '2026-01-01T10:00:00.000Z'
    };

    const ticket2: Ticket = {
      id: 'ticket-2',
      shiftId: shift.id,
      userId: user.id,
      number: 2,
      status: 'open',
      createdAt: '2026-01-01T11:00:00.000Z'
    };

    ticketServiceSpy.getByShiftId.and.returnValue([ticket1]);

    component.ngOnInit();

    expect(component.openTickets.length).toBe(1);

    ticketServiceSpy.create.and.returnValue(ticket2);
    ticketServiceSpy.getByShiftId.and.returnValue([ticket1, ticket2]);

    component.createTicket();

    expect(component.openTickets.length).toBe(2);
    expect(component.openTickets[0].id).toBe(ticket1.id);
    expect(component.openTickets[1].id).toBe(ticket2.id);
    expect(component.currentTicket?.id).toBe(ticket2.id);
  });


  it('WorkDeskPage debería permitir cambiar entre tickets abiertos', () => {
    const ticket1: Ticket = {
      id: 'ticket-1',
      shiftId: shift.id,
      userId: user.id,
      number: 1,
      status: 'open',
      createdAt: '2026-01-01T10:00:00.000Z'
    };

    const ticket2: Ticket = {
      id: 'ticket-2',
      shiftId: shift.id,
      userId: user.id,
      number: 2,
      status: 'open',
      createdAt: '2026-01-01T11:00:00.000Z'
    };

    ticketServiceSpy.getByShiftId.and.returnValue([ticket1, ticket2]);

    ticketItemServiceSpy.getByTicketId.and.callFake((ticketId: string) => {
      if (ticketId === ticket1.id) {
        return [];
      }

      return [];
    });

    ticketItemServiceSpy.getTicketTotal.and.returnValue(0);

    component.ngOnInit();

    component.selectTicket(ticket1);

    expect(component.currentTicket?.id).toBe(ticket1.id);

    component.selectTicket(ticket2);

    expect(component.currentTicket?.id).toBe(ticket2.id);
  });


  it('WorkDeskPage debería cargar los productos correspondientes al ticket seleccionado', () => {
    const ticket1: Ticket = {
      id: 'ticket-1',
      shiftId: shift.id,
      userId: user.id,
      number: 1,
      status: 'open',
      createdAt: '2026-01-01T10:00:00.000Z'
    };

    const ticket2: Ticket = {
      id: 'ticket-2',
      shiftId: shift.id,
      userId: user.id,
      number: 2,
      status: 'open',
      createdAt: '2026-01-01T11:00:00.000Z'
    };

    const item1: TicketItem = {
      id: 'item-1',
      addedAt: '2026-01-01T10:05:00.000Z',
      ticketId: ticket1.id,
      productId: 'product-1',
      quantity: 2,
      unitPrice: 100,
      subtotal: 200
    };

    const item2: TicketItem = {
      id: 'item-2',
      addedAt: '2026-01-01T11:05:00.000Z',
      ticketId: ticket2.id,
      productId: 'product-2',
      quantity: 1,
      unitPrice: 150,
      subtotal: 150
    };

    ticketServiceSpy.getByShiftId.and.returnValue([ticket1, ticket2]);

    ticketItemServiceSpy.getByTicketId.and.callFake((ticketId: string) => {
      return ticketId === ticket1.id ? [item1] : [item2];
    });

    ticketItemServiceSpy.getTicketTotal.and.callFake((ticketId: string) => {
      return ticketId === ticket1.id ? 200 : 150;
    });

    component.ngOnInit();

    component.selectTicket(ticket1);

    expect(component.ticketItems.length).toBe(1);
    expect(component.ticketItems[0].id).toBe(item1.id);
    expect(component.ticketTotal).toBe(200);

    component.selectTicket(ticket2);

    expect(component.ticketItems.length).toBe(1);
    expect(component.ticketItems[0].id).toBe(item2.id);
    expect(component.ticketTotal).toBe(150);
  });


  it('WorkDeskPage debería mantener los demás tickets abiertos después de pagar uno', () => {
    const ticket1: Ticket = {
      id: 'ticket-1',
      shiftId: shift.id,
      userId: user.id,
      number: 1,
      status: 'open',
      createdAt: '2026-01-01T10:00:00.000Z'
    };

    const ticket2: Ticket = {
      id: 'ticket-2',
      shiftId: shift.id,
      userId: user.id,
      number: 2,
      status: 'open',
      createdAt: '2026-01-01T11:00:00.000Z'
    };

    ticketServiceSpy.getByShiftId.and.returnValue([ticket1, ticket2]);

    ticketItemServiceSpy.getByTicketId.and.returnValue([
      {
        id: 'item-1',
        addedAt: '2026-01-01T10:05:00.000Z',
        ticketId: ticket1.id,
        productId: 'product-1',
        quantity: 1,
        unitPrice: 100,
        subtotal: 100
      }
    ]);

    ticketItemServiceSpy.getTicketTotal.and.returnValue(100);

    checkoutService.checkout.and.returnValue({
      id: 'sale-1',
      shiftId: shift.id,
      userId: user.id,
      ticketId: ticket1.id,
      total: 100,
      paymentMethod: 'cash',
      status: 'completed',
      createdAt: '2026-01-01T12:00:00.000Z'
    });

    component.ngOnInit();
    component.selectTicket(ticket1);

    expect(component.openTickets.length).toBe(2);

    component.paymentMethod = 'cash';

    component.confirmCheckout();

    const paidTicket: Ticket = {
      ...ticket1,
      status: 'paid',
      paidAt: '2026-01-01T12:00:00.000Z'
    };

    ticketServiceSpy.getByShiftId.and.returnValue([paidTicket, ticket2]);

    component['loadOpenTickets']();

    expect(component.openTickets.length).toBe(1);
    expect(component.openTickets[0].id).toBe(ticket2.id);
  });


  it('WorkDeskPage debería agregar productos al ticket seleccionado', () => {
    const ticket1: Ticket = {
      id: 'ticket-1',
      shiftId: shift.id,
      userId: user.id,
      number: 1,
      status: 'open',
      createdAt: '2026-01-01T10:00:00.000Z'
    };

    const ticket2: Ticket = {
      id: 'ticket-2',
      shiftId: shift.id,
      userId: user.id,
      number: 2,
      status: 'open',
      createdAt: '2026-01-01T11:00:00.000Z'
    };

    const product: Product = {
      id: 'product-1',
      name: 'Hamburguesa',
      description: 'Hamburguesa clásica',
      categoryId: undefined,
      imageUrl: undefined,
      price: 250,
      cost: 100,
      stock: 10,
      isActive: true,
      createdAt: '2026-01-01T09:00:00.000Z',
      createdBy: user.id,
      updatedAt: '2026-01-01T09:00:00.000Z',
      updatedBy: user.id
    };

    ticketServiceSpy.getByShiftId.and.returnValue([ticket1, ticket2]);

    component.ngOnInit();

    component.selectTicket(ticket2);

    ticketItemServiceSpy.add.and.returnValue({
      id: 'item-2',
      addedAt: '2026-01-01T12:00:00.000Z',
      ticketId: ticket2.id,
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
      subtotal: product.price
    });

    ticketItemServiceSpy.getByTicketId.and.returnValue([
      {
        id: 'item-2',
        addedAt: '2026-01-01T12:00:00.000Z',
        ticketId: ticket2.id,
        productId: product.id,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price
      }
    ]);

    ticketItemServiceSpy.getTicketTotal.and.returnValue(product.price);

    component.addProduct(product);

    expect(ticketItemServiceSpy.add).toHaveBeenCalledWith(
      ticket2.id,
      product.id,
      1
    );

    expect(component.currentTicket?.id).toBe(ticket2.id);
    expect(component.ticketItems.length).toBe(1);
    expect(component.ticketItems[0].ticketId).toBe(ticket2.id);
    expect(component.ticketTotal).toBe(product.price);
  });



  it('WorkDeskPage debería reemplazar inmediatamente los productos al cambiar de ticket', () => {
    const ticket1: Ticket = {
      id: 'ticket-1',
      shiftId: shift.id,
      userId: user.id,
      number: 1,
      status: 'open',
      createdAt: '2026-01-01T10:00:00.000Z'
    };

    const ticket2: Ticket = {
      id: 'ticket-2',
      shiftId: shift.id,
      userId: user.id,
      number: 2,
      status: 'open',
      createdAt: '2026-01-01T11:00:00.000Z'
    };

    const item1: TicketItem = {
      id: 'item-1',
      addedAt: '2026-01-01T10:05:00.000Z',
      ticketId: ticket1.id,
      productId: 'product-1',
      quantity: 2,
      unitPrice: 100,
      subtotal: 200
    };

    const item2: TicketItem = {
      id: 'item-2',
      addedAt: '2026-01-01T11:05:00.000Z',
      ticketId: ticket2.id,
      productId: 'product-2',
      quantity: 1,
      unitPrice: 300,
      subtotal: 300
    };

    ticketServiceSpy.getByShiftId.and.returnValue([ticket1, ticket2]);

    ticketItemServiceSpy.getByTicketId.and.callFake((ticketId: string) => {
      return ticketId === ticket1.id ? [item1] : [item2];
    });

    ticketItemServiceSpy.getTicketTotal.and.callFake((ticketId: string) => {
      return ticketId === ticket1.id ? 200 : 300;
    });

    component.ngOnInit();

    component.selectTicket(ticket1);

    expect(component.currentTicket?.id).toBe(ticket1.id);
    expect(component.ticketItems.length).toBe(1);
    expect(component.ticketItems[0].id).toBe(item1.id);
    expect(component.ticketTotal).toBe(200);

    component.selectTicket(ticket2);

    expect(component.currentTicket?.id).toBe(ticket2.id);
    expect(component.ticketItems.length).toBe(1);
    expect(component.ticketItems[0].id).toBe(item2.id);
    expect(component.ticketItems[0].ticketId).toBe(ticket2.id);
    expect(component.ticketTotal).toBe(300);
  });


  it('WorkDeskPage debería crear un nuevo ticket sin modificar el ticket anterior', () => {
    const ticket1: Ticket = {
      id: 'ticket-1',
      shiftId: shift.id,
      userId: user.id,
      number: 1,
      status: 'open',
      createdAt: '2026-01-01T10:00:00.000Z'
    };

    const ticket2: Ticket = {
      id: 'ticket-2',
      shiftId: shift.id,
      userId: user.id,
      number: 2,
      status: 'open',
      createdAt: '2026-01-01T11:00:00.000Z'
    };

    const item1: TicketItem = {
      id: 'item-1',
      addedAt: '2026-01-01T10:05:00.000Z',
      ticketId: ticket1.id,
      productId: 'product-1',
      quantity: 2,
      unitPrice: 100,
      subtotal: 200
    };

    ticketServiceSpy.getByShiftId.and.returnValue([ticket1]);

    ticketItemServiceSpy.getByTicketId.and.returnValue([item1]);
    ticketItemServiceSpy.getTicketTotal.and.returnValue(200);

    component.ngOnInit();
    component.selectTicket(ticket1);

    expect(component.currentTicket?.id).toBe(ticket1.id);
    expect(component.ticketItems.length).toBe(1);
    expect(component.ticketTotal).toBe(200);

    ticketServiceSpy.create.and.returnValue(ticket2);
    ticketServiceSpy.getByShiftId.and.returnValue([ticket1, ticket2]);

    ticketItemServiceSpy.getByTicketId.and.returnValue([]);
    ticketItemServiceSpy.getTicketTotal.and.returnValue(0);

    component.createTicket();

    expect(component.openTickets.length).toBe(2);
    expect(component.currentTicket?.id).toBe(ticket2.id);
    expect(component.ticketItems.length).toBe(0);
    expect(component.ticketTotal).toBe(0);

    expect(ticket1.status).toBe('open');
  });


  it('WorkDeskPage debería actualizar los tickets abiertos después de completar un pago', () => {
    const ticket1: Ticket = {
      id: 'ticket-1',
      shiftId: shift.id,
      userId: user.id,
      number: 1,
      status: 'open',
      createdAt: '2026-01-01T10:00:00.000Z'
    };

    const ticket2: Ticket = {
      id: 'ticket-2',
      shiftId: shift.id,
      userId: user.id,
      number: 2,
      status: 'open',
      createdAt: '2026-01-01T11:00:00.000Z'
    };

    ticketServiceSpy.getByShiftId.and.returnValue([
      ticket1,
      ticket2
    ]);

    ticketItemServiceSpy.getByTicketId.and.returnValue([
      {
        id: 'item-1',
        addedAt: '2026-01-01T10:05:00.000Z',
        ticketId: ticket1.id,
        productId: 'product-1',
        quantity: 1,
        unitPrice: 100,
        subtotal: 100
      }
    ]);

    ticketItemServiceSpy.getTicketTotal.and.returnValue(100);

    checkoutService.checkout.and.returnValue({
      id: 'sale-1',
      shiftId: shift.id,
      userId: user.id,
      ticketId: ticket1.id,
      total: 100,
      paymentMethod: 'cash',
      status: 'completed',
      createdAt: '2026-01-01T12:00:00.000Z'
    } as any);

    component.ngOnInit();
    component.selectTicket(ticket1);

    expect(component.openTickets.length).toBe(2);

    const loadOpenTicketsSpy =
      spyOn<any>(component, 'loadOpenTickets')
        .and.callThrough();

    component.confirmCheckout();

    expect(loadOpenTicketsSpy).toHaveBeenCalled();
  });


  it('WorkDeskPage debería mostrar el error cuando falla la creación de un ticket', () => {
    component.currentShift = shift;

    sessionSpy.user.and.returnValue(user);

    ticketServiceSpy.create.and.throwError(
      new Error('No se pudo crear el ticket.')
    );

    component.ticketError = '';

    component.createTicket();

    expect(component.ticketError)
      .toBe('No se pudo crear el ticket.');
  });


});