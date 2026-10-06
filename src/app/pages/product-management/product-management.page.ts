import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from 'src/app/models/product.model';
import { Category } from 'src/app/models/category.model';

import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.page.html',
  styleUrls: ['./product-management.page.scss'],
  standalone: false,
})
export class ProductManagementPage implements OnInit {

  products: Product[] = [];

  categories: Category[] = [];

  filteredProducts: Product[] = [];

  searchTerm = '';

  selectedCategoryId: string | null = null;

  showForm = false;

  editingProductId: string | null = null;

  productName = '';

  productDescription = '';

  productCategoryId: string | null = null;

  productPrice: number | null = null;

  productCost: number | null = null;

  productStock: number | null = null;

  productImageUrl = '';

  productError = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    public session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadCatalog();

  }

  // Cargar productos y categorías desde los servicios
  private loadCatalog(): void {

    this.products =
      this.productService.getAll();

    this.categories =
      this.categoryService.getActive();

    this.applyFilters();

  }

  // Aplicar filtros de búsqueda y categoría a los productos
  private applyFilters(): void {

    let result = [...this.products];

    if (this.selectedCategoryId) {

      result = result.filter(
        product =>
          product.categoryId === this.selectedCategoryId
      );

    }

    if (this.searchTerm.trim()) {

      const search =
        this.searchTerm.trim().toLowerCase();

      result = result.filter(
        product =>
          product.name
            .toLowerCase()
            .includes(search)
      );

    }

    this.filteredProducts = result;

  }

  // Manejar cambios en el término de búsqueda
  onSearchChange(): void {

    this.applyFilters();

  }

  // Seleccionar una categoría para filtrar productos
  selectCategory(categoryId: string | null): void {

    this.selectedCategoryId = categoryId;

    this.applyFilters();

  }

  // Obtener el nombre de la categoría seleccionada
  getCategoryName(
    categoryId?: string
  ): string {

    if (!categoryId) {
      return 'Sin categoría';
    }

    const category =
      this.categories.find(
        category =>
          category.id === categoryId
      );

    return category?.name ?? 'Sin categoría';

  }

  // Abrir el formulario para crear un nuevo producto
  openForm(): void {

    this.editingProductId = null;

    this.productName = '';
    this.productDescription = '';
    this.productCategoryId = null;
    this.productPrice = null;
    this.productCost = null;
    this.productStock = null;
    this.productImageUrl = '';
    this.productError = '';

    this.showForm = true;
  }

  // Cerrar el formulario de creación/edición de producto
  closeForm(): void {

    this.showForm = false;

    this.editingProductId = null;

    this.productName = '';
    this.productDescription = '';
    this.productCategoryId = null;
    this.productPrice = null;
    this.productCost = null;
    this.productStock = null;
    this.productImageUrl = '';
    this.productError = '';
  }

  // Crear un nuevo producto
  createProduct(): void {

    const user =
      this.session.user();

    if (!user) {

      this.productError =
        'No hay un usuario en sesión.';

      return;

    }

    if (!this.productName.trim()) {

      this.productError =
        'El nombre del producto es obligatorio.';

      return;

    }

    if (
      this.productPrice === null ||
      this.productPrice < 0
    ) {

      this.productError =
        'El precio no puede ser negativo.';

      return;

    }

    if (
      this.productCost === null ||
      this.productCost < 0
    ) {

      this.productError =
        'El costo no puede ser negativo.';

      return;

    }

    if (
      this.productStock === null ||
      this.productStock < 0
    ) {

      this.productError =
        'El stock no puede ser negativo.';

      return;

    }

    try {

      this.productService.create(
        this.productName,
        this.productPrice,
        this.productCost,
        this.productStock,
        user.id,
        this.productDescription,
        this.productCategoryId ?? undefined,
        this.productImageUrl || undefined
      );

      this.loadCatalog();

      this.closeForm();

    } catch (error) {

      this.productError =
        error instanceof Error
          ? error.message
          : 'No se pudo crear el producto.';

    }

  }


  // Editar un producto existente
  editProduct(product: Product): void {

    this.editingProductId = product.id;

    this.productName = product.name;

    this.productDescription =
      product.description ?? '';

    this.productCategoryId =
      product.categoryId ?? null;

    this.productPrice =
      product.price;

    this.productCost =
      product.cost;

    this.productStock =
      product.stock;

    this.productImageUrl =
      product.imageUrl ?? '';

    this.productError = '';

    this.showForm = true;

  }


  // Actualizar un producto existente
  updateProduct(): void {

    const user =
      this.session.user();

    if (!user) {

      this.productError =
        'No hay un usuario en sesión.';

      return;
    }

    if (!this.editingProductId) {

      this.productError =
        'No se ha seleccionado ningún producto.';

      return;
    }

    if (!this.productName.trim()) {

      this.productError =
        'El nombre del producto es obligatorio.';

      return;
    }

    if (
      this.productPrice === null ||
      this.productPrice < 0
    ) {

      this.productError =
        'El precio no puede ser negativo.';

      return;
    }

    if (
      this.productCost === null ||
      this.productCost < 0
    ) {

      this.productError =
        'El costo no puede ser negativo.';

      return;
    }

    if (
      this.productStock === null ||
      this.productStock < 0
    ) {

      this.productError =
        'El stock no puede ser negativo.';

      return;
    }

    try {

      this.productService.update(
        this.editingProductId,
        user.id,
        {
          name: this.productName,
          description: this.productDescription,
          categoryId:
            this.productCategoryId ?? undefined,
          imageUrl:
            this.productImageUrl || undefined,
          price: this.productPrice,
          cost: this.productCost
        }
      );

      this.loadCatalog();

      this.closeForm();

    } catch (error) {

      this.productError =
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el producto.';
    }
  }


  // Cambiar el estado activo/inactivo de un producto
  toggleProductStatus(product: Product): void {

    const user =
      this.session.user();

    if (!user) {
      return;
    }

    try {

      if (product.isActive) {

        this.productService.deactivate(
          product.id,
          user.id
        );

      } else {

        this.productService.activate(
          product.id,
          user.id
        );
      }

      this.loadCatalog();

    } catch (error) {

      this.productError =
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el estado del producto.';
    }
  }

  // Navegar a la página de gestión de productos
  goToWorkDesk(): void {

    this.router.navigate(['/work-desk']);

  }

}