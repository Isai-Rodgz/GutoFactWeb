import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from 'src/app/models/product.model';
import { Category } from 'src/app/models/category.model';
import { InventoryMovement } from 'src/app/models/inventory-movement.model';

import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { SessionService } from 'src/app/services/session.service';
import { CurrentShiftService } from 'src/app/services/current-shift.service';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.page.html',
  styleUrls: ['./inventory-management.page.scss'],
  standalone: false
})
export class InventoryManagementPage implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];

  showMovementForm = false;

  selectedProductId = '';
  selectedMovementType: InventoryMovement['type'] = 'purchase';
  selectedDirection: InventoryMovement['direction'] = 'in';
  movementQuantity: number | null = null;
  movementDescription = '';

  movementError = '';

  selectedProductForHistory: Product | null = null;
  productMovements: InventoryMovement[] = [];
  showMovementHistory = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private inventoryService: InventoryService,
    private session: SessionService,
    private currentShiftService: CurrentShiftService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }


  // Cargar productos y categorías desde los servicios
  private loadInventory(): void {
    this.products = this.productService.getAll();
    this.categories = this.categoryService.getAll();
  }

  // Obtener el nombre de la categoría por su ID
  getCategoryName(categoryId?: string): string {
    if (!categoryId) {
      return 'Sin categoría';
    }

    const category = this.categories.find(
      item => item.id === categoryId
    );

    return category?.name ?? 'Sin categoría';
  }

  // Abrir el formulario de movimiento y limpiar los campos
  openMovementForm(): void {
    this.selectedProductId = '';
    this.selectedMovementType = 'purchase';
    this.selectedDirection = 'in';
    this.movementQuantity = null;
    this.movementDescription = '';
    this.movementError = '';

    this.showMovementForm = true;
  }

  // Cerrar el formulario de movimiento y limpiar los campos
  closeMovementForm(): void {
    this.showMovementForm = false;
    this.movementError = '';
  }

  // Ajustar la dirección del movimiento según el tipo seleccionado
  onMovementTypeChange(): void {
    switch (this.selectedMovementType) {
      case 'purchase':
      case 'return':
        this.selectedDirection = 'in';
        break;

      case 'sale':
      case 'damage':
        this.selectedDirection = 'out';
        break;

      case 'adjustment':
        this.selectedDirection = 'in';
        break;
    }
  }

  // Guardar el movimiento de inventario
  saveMovement(): void {
    this.movementError = '';

    const user = this.session.user();

    if (!user) {
      this.movementError =
        'No hay un usuario en sesión.';
      return;
    }

    if (!this.selectedProductId) {
      this.movementError =
        'Debe seleccionar un producto.';
      return;
    }

    if (
      this.movementQuantity === null ||
      this.movementQuantity <= 0
    ) {
      this.movementError =
        'La cantidad debe ser mayor que cero.';
      return;
    }

    try {
      const currentShift =
        this.currentShiftService.getCurrentShift();

      this.inventoryService.addMovement(
        this.selectedProductId,
        user.id,
        this.selectedMovementType,
        this.selectedDirection,
        this.movementQuantity,
        currentShift?.id,
        this.movementDescription.trim() || undefined
      );

      this.loadInventory();
      this.closeMovementForm();

    } catch (error) {
      this.movementError =
        error instanceof Error
          ? error.message
          : 'No se pudo registrar el movimiento.';
    }
  }

  // Ver el historial de movimientos de un producto
  viewMovementHistory(product: Product): void {
  this.selectedProductForHistory = product;

  this.productMovements =
    this.inventoryService.getByProductId(product.id);

  this.showMovementHistory = true;
}

// Cerrar el historial de movimientos
closeMovementHistory(): void {
  this.showMovementHistory = false;
  this.selectedProductForHistory = null;
  this.productMovements = [];
}

// Obtener la etiqueta legible para el tipo de movimiento
getMovementTypeLabel(
  type: InventoryMovement['type']
): string {

  switch (type) {
    case 'purchase':
      return 'Compra';

    case 'sale':
      return 'Venta';

    case 'adjustment':
      return 'Ajuste';

    case 'damage':
      return 'Daño';

    case 'return':
      return 'Devolución';
  }
}

// Obtener la etiqueta legible para la dirección del movimiento
getMovementDirectionLabel(
  direction: InventoryMovement['direction']
): string {

  return direction === 'in'
    ? 'Entrada'
    : 'Salida';
}

  //Navegar a la pagina de work desk
  goToWorkDesk(): void {
    this.router.navigate([
      '/work-desk'
    ]);
  }
}