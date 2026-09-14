import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { CategoryService } from './category.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryManagementService {

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  deactivate(
    categoryId: string,
    updatedBy: string
  ): Category {

    const category =
      this.categoryService.getById(categoryId);

    if (!category) {
      throw new Error(
        'La categoría no existe.'
      );
    }

    if (!category.isActive) {
      throw new Error(
        'La categoría ya está desactivada.'
      );
    }

    const products =
      this.productService.getByCategoryId(
        categoryId
      );

    const activeProducts =
      products.filter(
        product => product.isActive
      );

    if (activeProducts.length > 0) {
      throw new Error(
        'No se puede desactivar la categoría porque tiene productos activos.'
      );
    }

    return this.categoryService.update(
      categoryId,
      updatedBy,
      {
        isActive: false
      }
    );
  }
}