export interface CashMovement {
  id: string;

  shiftId: string;

  type:
    | 'opening'
    | 'sale'
    | 'withdrawal'
    | 'deposit'
    | 'refund'
    | 'adjustment'
    | 'closing';

  amount: number;

  description?: string;

  createdAt: string;
}