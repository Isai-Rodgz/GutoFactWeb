export interface Product {
  id: string;

  name: string;
  description?: string;

  categoryId?: string;

  imageUrl?: string;

  price: number;
  cost: number;

  stock: number;

  isActive: boolean;

  createdAt: string;
  createdBy: string;

  updatedAt: string;
  updatedBy: string;
}