import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductManagementPage } from './product-management.page';

describe('ProductManagementPage', () => {
  let component: ProductManagementPage;
  let fixture: ComponentFixture<ProductManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
