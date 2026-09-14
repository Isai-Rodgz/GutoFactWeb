import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly STORAGE_KEY = 'categories';

  constructor(
    private storage: StorageService
  ) {}

  getAll(): Category[] {
    return this.storage.get<Category[]>(
      this.STORAGE_KEY
    ) ?? [];
  }

  getById(
    categoryId: string
  ): Category | null {

    const categories = this.getAll();

    return categories.find(
      category => category.id === categoryId
    ) ?? null;
  }

  getActive(): Category[] {

    const categories = this.getAll();

    return categories.filter(
      category => category.isActive
    );
  }

  create(
    name: string,
    createdBy: string,
    description?: string
  ): Category {

    if (!name.trim()) {
      throw new Error(
        'El nombre de la categoría es obligatorio.'
      );
    }

    const categories = this.getAll();
    const now = new Date().toISOString();

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description?.trim(),
      isActive: true,
      createdAt: now,
      createdBy,
      updatedAt: now,
      updatedBy: createdBy
    };

    categories.push(newCategory);

    this.storage.set(
      this.STORAGE_KEY,
      categories
    );

    return newCategory;
  }

  update(
    categoryId: string,
    updatedBy: string,
    changes: {
      name?: string;
      description?: string;
      isActive?: boolean;
    }
  ): Category {

    const categories = this.getAll();

    const index = categories.findIndex(
      category => category.id === categoryId
    );

    if (index === -1) {
      throw new Error(
        'La categoría no existe.'
      );
    }

    const category = categories[index];

    if (
      changes.name !== undefined &&
      !changes.name.trim()
    ) {
      throw new Error(
        'El nombre de la categoría es obligatorio.'
      );
    }

    const now = new Date().toISOString();

    const updatedCategory: Category = {
      ...category,

      name:
        changes.name !== undefined
          ? changes.name.trim()
          : category.name,

      description:
        changes.description !== undefined
          ? changes.description.trim()
          : category.description,

      isActive:
        changes.isActive !== undefined
          ? changes.isActive
          : category.isActive,

      updatedAt: now,
      updatedBy
    };

    categories[index] = updatedCategory;

    this.storage.set(
      this.STORAGE_KEY,
      categories
    );

    return updatedCategory;
  }

 
  activate(
    categoryId: string,
    updatedBy: string
  ): Category {

    return this.update(
      categoryId,
      updatedBy,
      {
        isActive: true
      }
    );
  }
}