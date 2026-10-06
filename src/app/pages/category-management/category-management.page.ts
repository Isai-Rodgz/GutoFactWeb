import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.page.html',
  styleUrls: ['./category-management.page.scss'],
  standalone: false
})
export class CategoryManagementPage implements OnInit {

  categories: Category[] = [];

  showForm = false;

  editingCategoryId: string | null = null;

  categoryName = '';

  categoryDescription = '';

  categoryError = '';

  constructor(
    private categoryService: CategoryService,
    public session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadCategories();

  }

  // Carga todas las categorías desde el servicio
  private loadCategories(): void {

    this.categories =
      this.categoryService.getAll();

  }

  // Abre el formulario para crear una nueva categoría
  openForm(): void {

    this.editingCategoryId = null;

    this.categoryName = '';

    this.categoryDescription = '';

    this.categoryError = '';

    this.showForm = true;

  }

  // Abre el formulario para editar una categoría existente
  editCategory(category: Category): void {

    this.editingCategoryId = category.id;

    this.categoryName = category.name;

    this.categoryDescription =
      category.description ?? '';

    this.categoryError = '';

    this.showForm = true;

  }

  // Cierra el formulario y limpia sus datos
  closeForm(): void {

    this.showForm = false;

    this.editingCategoryId = null;

    this.categoryName = '';

    this.categoryDescription = '';

    this.categoryError = '';

  }

  // Guarda una nueva categoría o actualiza una existente
  saveCategory(): void {

    const user =
      this.session.user();

    if (!user) {

      this.categoryError =
        'No hay un usuario en sesión.';

      return;

    }

    if (!this.categoryName.trim()) {

      this.categoryError =
        'El nombre de la categoría es obligatorio.';

      return;

    }

    try {

      if (this.editingCategoryId) {

        this.categoryService.update(
          this.editingCategoryId,
          user.id,
          {
            name: this.categoryName,
            description: this.categoryDescription
          }
        );

      } else {

        this.categoryService.create(
          this.categoryName,
          user.id,
          this.categoryDescription
        );

      }

      this.loadCategories();

      this.closeForm();

    } catch (error) {

      this.categoryError =
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la categoría.';

    }

  }

  // Activa o desactiva una categoría
  toggleCategoryStatus(category: Category): void {

    const user =
      this.session.user();

    if (!user) {

      return;

    }

    try {

      if (category.isActive) {

        this.categoryService.deactivate(
          category.id,
          user.id
        );

      } else {

        this.categoryService.activate(
          category.id,
          user.id
        );

      }

      this.loadCategories();

    } catch (error) {

      this.categoryError =
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el estado de la categoría.';

    }

  }

  // Navega a la página de escritorio de trabajo
  goToWorkDesk(): void {

    this.router.navigate(['/work-desk']);

  }

}