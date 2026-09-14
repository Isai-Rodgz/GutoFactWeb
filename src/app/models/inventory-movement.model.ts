export interface InventoryMovement {
  id: string;
  productId: string;
  shiftId?: string;
  userId: string;
  type:
    | 'purchase'
    | 'sale'
    | 'adjustment'
    | 'damage'
    | 'return';
  direction: 'in' | 'out';
  quantity: number;
  description?: string;
  createdAt: string;
}