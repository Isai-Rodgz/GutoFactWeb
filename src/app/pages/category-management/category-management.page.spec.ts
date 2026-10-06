import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  CategoryManagementPage
} from './category-management.page';

import {
  Category
} from 'src/app/models/category.model';

import {
  CategoryService
} from 'src/app/services/category.service';

import {
  SessionService
} from 'src/app/services/session.service';

import {
  Router
} from '@angular/router';


describe('CategoryManagementPage', () => {

  let component: CategoryManagementPage;
  let fixture: ComponentFixture<CategoryManagementPage>;

  let categoryService: jasmine.SpyObj<CategoryService>;
  let sessionService: jasmine.SpyObj<SessionService>;
  let router: jasmine.SpyObj<Router>;

  const user = {
    id: 'user-1'
  } as any;

  const category: Category = {
    id: 'category-1',
    name: 'Bebidas',
    description: 'Bebidas frías y calientes',
    isActive: true,
    createdAt: '2026-01-01T10:00:00.000Z',
    createdBy: 'user-1',
    updatedAt: '2026-01-01T10:00:00.000Z',
    updatedBy: 'user-1'
  };

  beforeEach(async () => {

    categoryService =
      jasmine.createSpyObj<CategoryService>(
        'CategoryService',
        [
          'getAll',
          'create',
          'update',
          'activate',
          'deactivate'
        ]
      );

    sessionService =
      jasmine.createSpyObj<SessionService>(
        'SessionService',
        [
          'user'
        ]
      );

    router =
      jasmine.createSpyObj<Router>(
        'Router',
        [
          'navigate'
        ]
      );

    categoryService.getAll
      .and.returnValue([]);

    sessionService.user
      .and.returnValue(user);

    router.navigate
      .and.returnValue(
        Promise.resolve(true)
      );

    await TestBed.configureTestingModule({

      imports: [
        FormsModule
      ],

      declarations: [
        CategoryManagementPage
      ],

      providers: [
        {
          provide: CategoryService,
          useValue: categoryService
        },
        {
          provide: SessionService,
          useValue: sessionService
        },
        {
          provide: Router,
          useValue: router
        }
      ],

      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]

    }).compileComponents();

    fixture =
      TestBed.createComponent(
        CategoryManagementPage
      );

    component =
      fixture.componentInstance;

    fixture.detectChanges();

  });


  it('debería crear el componente', () => {

    expect(component)
      .toBeTruthy();

  });


  it('debería cargar las categorías al iniciar', () => {

    categoryService.getAll
      .and.returnValue([
        category
      ]);

    component.ngOnInit();

    expect(
      categoryService.getAll
    ).toHaveBeenCalled();

    expect(
      component.categories
    ).toEqual([
      category
    ]);

  });


  it('debería abrir el formulario para crear una categoría', () => {

    component.editingCategoryId =
      'category-anterior';

    component.categoryName =
      'Categoría anterior';

    component.categoryDescription =
      'Descripción anterior';

    component.categoryError =
      'Error anterior';

    component.openForm();

    expect(
      component.showForm
    ).toBeTrue();

    expect(
      component.editingCategoryId
    ).toBeNull();

    expect(
      component.categoryName
    ).toBe('');

    expect(
      component.categoryDescription
    ).toBe('');

    expect(
      component.categoryError
    ).toBe('');

  });


  it('debería cerrar el formulario y limpiar sus datos', () => {

    component.showForm = true;

    component.editingCategoryId =
      'category-1';

    component.categoryName =
      'Bebidas';

    component.categoryDescription =
      'Descripción';

    component.categoryError =
      'Error';

    component.closeForm();

    expect(
      component.showForm
    ).toBeFalse();

    expect(
      component.editingCategoryId
    ).toBeNull();

    expect(
      component.categoryName
    ).toBe('');

    expect(
      component.categoryDescription
    ).toBe('');

    expect(
      component.categoryError
    ).toBe('');

  });


  it('debería cargar los datos de una categoría al editarla', () => {

    component.editCategory(category);

    expect(
      component.showForm
    ).toBeTrue();

    expect(
      component.editingCategoryId
    ).toBe(category.id);

    expect(
      component.categoryName
    ).toBe(category.name);

    expect(
      component.categoryDescription
    ).toBe(category.description ?? '');

    expect(
      component.categoryError
    ).toBe('');

  });


  it('debería crear una categoría', () => {

    categoryService.create
      .and.returnValue(category);

    categoryService.getAll
      .and.returnValue([
        category
      ]);

    component.categoryName =
      'Bebidas';

    component.categoryDescription =
      'Bebidas frías y calientes';

    component.saveCategory();

    expect(
      categoryService.create
    ).toHaveBeenCalledWith(
      'Bebidas',
      'user-1',
      'Bebidas frías y calientes'
    );

    expect(
      component.categories
    ).toEqual([
      category
    ]);

    expect(
      component.showForm
    ).toBeFalse();

  });


  it('debería actualizar una categoría', () => {

    const updatedCategory: Category = {
      ...category,
      name: 'Refrescos',
      description: 'Solo bebidas frías',
      updatedBy: 'user-1'
    };

    categoryService.update
      .and.returnValue(updatedCategory);

    categoryService.getAll
      .and.returnValue([
        updatedCategory
      ]);

    component.editCategory(category);

    component.categoryName =
      'Refrescos';

    component.categoryDescription =
      'Solo bebidas frías';

    component.saveCategory();

    expect(
      categoryService.update
    ).toHaveBeenCalledWith(
      category.id,
      'user-1',
      {
        name: 'Refrescos',
        description: 'Solo bebidas frías'
      }
    );

    expect(
      component.categories
    ).toEqual([
      updatedCategory
    ]);

    expect(
      component.showForm
    ).toBeFalse();

  });


  it('debería desactivar una categoría activa', () => {

    const deactivatedCategory: Category = {
      ...category,
      isActive: false,
      updatedBy: 'user-1'
    };

    categoryService.deactivate
      .and.returnValue(
        deactivatedCategory
      );

    categoryService.getAll
      .and.returnValue([
        deactivatedCategory
      ]);

    component.toggleCategoryStatus(
      category
    );

    expect(
      categoryService.deactivate
    ).toHaveBeenCalledWith(
      category.id,
      'user-1'
    );

    expect(
      component.categories
    ).toEqual([
      deactivatedCategory
    ]);

  });


  it('debería activar una categoría inactiva', () => {

    const inactiveCategory: Category = {
      ...category,
      isActive: false
    };

    const activatedCategory: Category = {
      ...inactiveCategory,
      isActive: true,
      updatedBy: 'user-1'
    };

    categoryService.activate
      .and.returnValue(
        activatedCategory
      );

    categoryService.getAll
      .and.returnValue([
        activatedCategory
      ]);

    component.toggleCategoryStatus(
      inactiveCategory
    );

    expect(
      categoryService.activate
    ).toHaveBeenCalledWith(
      category.id,
      'user-1'
    );

    expect(
      component.categories
    ).toEqual([
      activatedCategory
    ]);

  });


  it('no debería guardar una categoría sin usuario en sesión', () => {

    sessionService.user
      .and.returnValue(null);

    component.categoryName =
      'Bebidas';

    component.saveCategory();

    expect(
      component.categoryError
    ).toBe(
      'No hay un usuario en sesión.'
    );

    expect(
      categoryService.create
    ).not.toHaveBeenCalled();

    expect(
      categoryService.update
    ).not.toHaveBeenCalled();

  });


  it('no debería guardar una categoría sin nombre', () => {

    component.categoryName =
      '   ';

    component.saveCategory();

    expect(
      component.categoryError
    ).toBe(
      'El nombre de la categoría es obligatorio.'
    );

    expect(
      categoryService.create
    ).not.toHaveBeenCalled();

  });


  it('debería navegar al Work Desk', () => {

    component.goToWorkDesk();

    expect(
      router.navigate
    ).toHaveBeenCalledWith([
      '/work-desk'
    ]);

  });


  it('debería manejar un error al crear una categoría', () => {

    categoryService.create
      .and.throwError(
        'Error de prueba'
      );

    component.categoryName =
      'Bebidas';

    component.saveCategory();

    expect(
      component.categoryError
    ).toBe(
      'Error de prueba'
    );

    expect(
      component.showForm
    ).toBeFalse();

  });


  it('debería manejar un error al actualizar una categoría', () => {

    categoryService.update
      .and.throwError(
        'Error de prueba'
      );

    component.editCategory(
      category
    );

    component.saveCategory();

    expect(
      component.categoryError
    ).toBe(
      'Error de prueba'
    );

  });


  it('no debería cambiar el estado sin usuario en sesión', () => {

    sessionService.user
      .and.returnValue(null);

    component.toggleCategoryStatus(
      category
    );

    expect(
      categoryService.deactivate
    ).not.toHaveBeenCalled();

    expect(
      categoryService.activate
    ).not.toHaveBeenCalled();

  });

});