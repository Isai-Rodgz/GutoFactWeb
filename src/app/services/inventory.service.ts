import { Injectable } from '@angular/core';
import { InventoryMovement } from '../models/inventory-movement.model';
import { StorageService } from './storage.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private readonly STORAGE_KEY = 'inventory-movements';

  constructor(
    private storage: StorageService,
    private productService: ProductService
  ) {}

  getAll(): InventoryMovement[] {
    return this.storage.get<InventoryMovement[]>(
      this.STORAGE_KEY
    ) ?? [];
  }

  getByProductId(
    productId: string
  ): InventoryMovement[] {

    const movements = this.getAll();

    return movements.filter(
      movement => movement.productId === productId
    );
  }

  addMovement(
    productId: string,
    userId: string,
    type: InventoryMovement['type'],
    direction: InventoryMovement['direction'],
    quantity: number,
    shiftId?: string,
    description?: string
  ): InventoryMovement {

    if (quantity <= 0) {
      throw new Error(
        'La cantidad debe ser mayor que cero.'
      );
    }

    const product =
      this.productService.getById(productId);

    if (!product) {
      throw new Error(
        'El producto no existe.'
      );
    }

    if (
      direction === 'out' &&
      product.stock < quantity
    ) {
      throw new Error(
        'No hay suficiente stock disponible.'
      );
    }

    const movements = this.getAll();
    const now = new Date().toISOString();

    const newMovement: InventoryMovement = {
      id: crypto.randomUUID(),
      productId,
      shiftId,
      userId,
      type,
      direction,
      quantity,
      description,
      createdAt: now
    };

    movements.push(newMovement);

    this.storage.set(
      this.STORAGE_KEY,
      movements
    );

    const newStock =
      direction === 'in'
        ? product.stock + quantity
        : product.stock - quantity;

    this.productService.update(
      productId,
      userId,
      {
        stock: newStock
      }
    );

    return newMovement;
  }

    registerSale(
    productId: string,
    userId: string,
    quantity: number,
    shiftId?: string,
    description?: string
  ): InventoryMovement {

    return this.addMovement(
      productId,
      userId,
      'sale',
      'out',
      quantity,
      shiftId,
      description
    );
  }
}