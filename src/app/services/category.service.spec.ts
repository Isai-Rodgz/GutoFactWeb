import { TestBed } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { StorageService } from './storage.service';

describe('CategoryService', () => {

    let service: CategoryService;
    let storage: StorageService;

    const userId = 'user-1';
    const otherUserId = 'user-2';

    beforeEach(() => {

        TestBed.configureTestingModule({
        providers: [
            CategoryService,
            StorageService
        ]
        });

        service =
        TestBed.inject(CategoryService);

        storage =
        TestBed.inject(StorageService);

        storage.clear();
    });

    afterEach(() => {
        storage.clear();
    });

    it('debería crear el servicio', () => {

        expect(service)
        .toBeTruthy();
    });

    it('debería devolver un arreglo vacío cuando no existen categorías', () => {

        expect(
        service.getAll()
        ).toEqual([]);
    });

    it('debería crear una categoría activa', () => {

        const category =
        service.create(
            '  Bebidas  ',
            userId,
            '  Bebidas frías y calientes  '
        );

        expect(category.id)
        .toBeTruthy();

        expect(category.name)
        .toBe('Bebidas');

        expect(category.description)
        .toBe('Bebidas frías y calientes');

        expect(category.isActive)
        .toBeTrue();

        expect(category.createdBy)
        .toBe(userId);

        expect(category.updatedBy)
        .toBe(userId);

        expect(category.createdAt)
        .toBeTruthy();

        expect(category.updatedAt)
        .toBeTruthy();
    });

    it('debería guardar la categoría creada', () => {

        const category =
        service.create(
            'Comidas',
            userId
        );

        const categories =
        service.getAll();

        expect(categories.length)
        .toBe(1);

        expect(categories[0].id)
        .toBe(category.id);
    });

    it('debería obtener una categoría por id', () => {

        const category =
        service.create(
            'Postres',
            userId
        );

        const result =
        service.getById(
            category.id
        );

        expect(result)
        .not.toBeNull();

        expect(result!.id)
        .toBe(category.id);

        expect(result!.name)
        .toBe('Postres');
    });

    it('debería devolver null cuando la categoría no existe', () => {

        expect(
        service.getById(
            'categoria-inexistente'
        )
        ).toBeNull();
    });

    it('debería devolver únicamente las categorías activas', () => {

        const activeCategory =
        service.create(
            'Bebidas',
            userId
        );

        const inactiveCategory =
        service.create(
            'Comidas',
            userId
        );

        service.update(
        inactiveCategory.id,
        otherUserId,
        {
            isActive: false
        }
        );

        const activeCategories =
        service.getActive();

        expect(activeCategories.length)
        .toBe(1);

        expect(activeCategories[0].id)
        .toBe(activeCategory.id);
    });

    it('debería actualizar el nombre de una categoría', () => {

        const category =
        service.create(
            'Bebidas',
            userId
        );

        const updated =
        service.update(
            category.id,
            otherUserId,
            {
            name: 'Refrescos'
            }
        );

        expect(updated.name)
        .toBe('Refrescos');

        expect(updated.updatedBy)
        .toBe(otherUserId);

        expect(updated.updatedAt)
        .toBeTruthy();

        expect(updated.createdBy)
        .toBe(userId);
    });

    it('debería actualizar la descripción de una categoría', () => {

        const category =
        service.create(
            'Bebidas',
            userId
        );

        const updated =
        service.update(
            category.id,
            otherUserId,
            {
            description:
                '  Todo tipo de bebidas  '
            }
        );

        expect(updated.description)
        .toBe('Todo tipo de bebidas');

        expect(updated.updatedBy)
        .toBe(otherUserId);
    });

    it('debería actualizar el estado activo de una categoría', () => {

        const category =
        service.create(
            'Bebidas',
            userId
        );

        const updated =
        service.update(
            category.id,
            otherUserId,
            {
            isActive: false
            }
        );

        expect(updated.isActive)
        .toBeFalse();

        expect(
        service.getActive()
        ).toEqual([]);
    });

    it('debería conservar los valores que no fueron modificados', () => {

        const category =
        service.create(
            'Bebidas',
            userId,
            'Categoría original'
        );

        const updated =
        service.update(
            category.id,
            otherUserId,
            {
            isActive: false
            }
        );

        expect(updated.name)
        .toBe('Bebidas');

        expect(updated.description)
        .toBe('Categoría original');

        expect(updated.isActive)
        .toBeFalse();

        expect(updated.createdBy)
        .toBe(userId);
    });

    it('debería activar una categoría inactiva', () => {

        const category =
        service.create(
            'Bebidas',
            userId
        );

        service.update(
        category.id,
        userId,
        {
            isActive: false
        }
        );

        const activated =
        service.activate(
            category.id,
            otherUserId
        );

        expect(activated.isActive)
        .toBeTrue();

        expect(activated.updatedBy)
        .toBe(otherUserId);

        expect(
        service.getActive().length
        ).toBe(1);
    });

    it('no debería permitir crear una categoría sin nombre', () => {

        expect(() =>
        service.create(
            '   ',
            userId
        )
        ).toThrowError(
        /El nombre de la categoría es obligatorio/
        );

        expect(
        service.getAll()
        ).toEqual([]);
    });

    it('no debería permitir actualizar una categoría inexistente', () => {

        expect(() =>
        service.update(
            'categoria-inexistente',
            userId,
            {
            name: 'Nueva categoría'
            }
        )
        ).toThrowError(
        /La categoría no existe/
        );
    });

    it('no debería permitir actualizar una categoría con un nombre vacío', () => {

        const category =
        service.create(
            'Bebidas',
            userId
        );

        expect(() =>
        service.update(
            category.id,
            otherUserId,
            {
            name: '   '
            }
        )
        ).toThrowError(
        /El nombre de la categoría es obligatorio/
        );

        const stored =
        service.getById(
            category.id
        );

        expect(stored!.name)
        .toBe('Bebidas');
    });

    it('debería crear varias categorías y conservarlas', () => {

        const category1 =
        service.create(
            'Bebidas',
            userId
        );

        const category2 =
        service.create(
            'Comidas',
            userId
        );

        const category3 =
        service.create(
            'Postres',
            userId
        );

        const categories =
        service.getAll();

        expect(categories.length)
        .toBe(3);

        expect(categories.map(
        category => category.id
        )).toEqual([
        category1.id,
        category2.id,
        category3.id
        ]);
    });

});