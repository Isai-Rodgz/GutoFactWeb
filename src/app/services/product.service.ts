import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly STORAGE_KEY = 'products';

  constructor(
    private storage: StorageService
  ) {}



    // Obtener todos los productos
    getAll(): Product[] {

        return this.storage.get<Product[]>(
        this.STORAGE_KEY
        ) ?? [];

    }



    // Obtener un producto por ID
    getById(
        productId: string): Product | null {

        const products = this.getAll();

        return products.find(
        product => product.id === productId
        ) ?? null;

    }



    // Obtener solamente los productos activos
    getActive(): Product[] {

        const products = this.getAll();

        return products.filter(
        product => product.isActive
        );

    }



    // Obtener productos por categoría
    getByCategoryId(
        categoryId: string): Product[] {

        const products = this.getAll();

        return products.filter(
        product => product.categoryId === categoryId
        );

    }



    // Crear un producto
    create(
        name: string,
        price: number,
        cost: number,
        stock: number,
        createdBy: string,
        description?: string,
        categoryId?: string): Product {

        if (!name.trim()) {
        throw new Error(
            'El nombre del producto es obligatorio.'
        );
        }

        if (price < 0) {
        throw new Error(
            'El precio no puede ser negativo.'
        );
        }

        if (cost < 0) {
        throw new Error(
            'El costo no puede ser negativo.'
        );
        }

        if (stock < 0) {
        throw new Error(
            'El stock no puede ser negativo.'
        );
        }

        const products = this.getAll();

        const now = new Date().toISOString();

        const newProduct: Product = {

            id: crypto.randomUUID(),

            name: name.trim(),

            description: description?.trim(),

            categoryId,

            price,

            cost,

            stock,

            isActive: true,

            createdAt: now,

            createdBy,

            updatedAt: now,

            updatedBy: createdBy

        };

        products.push(newProduct);

        this.storage.set(
        this.STORAGE_KEY,
        products
        );

        return newProduct;
    }




    //Actualizar los productos
  update(
  productId: string,
  updatedBy: string,
  changes: {
    name?: string;
    description?: string;
    categoryId?: string;
    price?: number;
    cost?: number;
    isActive?: boolean;
  }
): Product {

  const products = this.getAll();

  const index = products.findIndex(
    product => product.id === productId
  );

  if (index === -1) {
    throw new Error(
      'El producto no existe.'
    );
  }

  const product = products[index];

  if (
    changes.name !== undefined &&
    !changes.name.trim()
  ) {
    throw new Error(
      'El nombre del producto es obligatorio.'
    );
  }

  if (
    changes.price !== undefined &&
    changes.price < 0
  ) {
    throw new Error(
      'El precio no puede ser negativo.'
    );
  }

  if (
    changes.cost !== undefined &&
    changes.cost < 0
  ) {
    throw new Error(
      'El costo no puede ser negativo.'
    );
  }

  const now = new Date().toISOString();

  const updatedProduct: Product = {
    ...product,

    name:
      changes.name !== undefined
        ? changes.name.trim()
        : product.name,

    description:
      changes.description !== undefined
        ? changes.description.trim()
        : product.description,

    categoryId:
      changes.categoryId !== undefined
        ? changes.categoryId
        : product.categoryId,

    price:
      changes.price !== undefined
        ? changes.price
        : product.price,

    cost:
      changes.cost !== undefined
        ? changes.cost
        : product.cost,

    isActive:
      changes.isActive !== undefined
        ? changes.isActive
        : product.isActive,

    updatedAt: now,
    updatedBy
  };

  products[index] = updatedProduct;

  this.storage.set(
    this.STORAGE_KEY,
    products
  );

  return updatedProduct;
}


//Ajustar el stock de un producto
adjustStock(
  productId: string,
  quantity: number,
  updatedBy: string
): Product {

  if (quantity === 0) {
    throw new Error(
      'La cantidad debe ser diferente de cero.'
    );
  }

  const products = this.getAll();

  const index = products.findIndex(
    product => product.id === productId
  );

  if (index === -1) {
    throw new Error(
      'El producto no existe.'
    );
  }

  const product = products[index];

  const newStock =
    product.stock + quantity;

  if (newStock < 0) {
    throw new Error(
      'El stock no puede ser negativo.'
    );
  }

  const now = new Date().toISOString();

  const updatedProduct: Product = {
    ...product,
    stock: newStock,
    updatedAt: now,
    updatedBy
  };

  products[index] = updatedProduct;

  this.storage.set(
    this.STORAGE_KEY,
    products
  );

  return updatedProduct;
}

    
    //Desactivar producto
    deactivate(
        productId: string,
        updatedBy: string): 
        Product {

        return this.update(
            productId,
            updatedBy,
            {
            isActive: false
            }
        );
    }



    //Activar producto
    activate(
        productId: string,
        updatedBy: string): 
        Product {

        return this.update(
            productId,
            updatedBy,
            {
            isActive: true
            }
        );
    }


}