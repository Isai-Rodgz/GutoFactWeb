export interface Sale {
  id: string;

  shiftId: string;
  userId: string;

  ticketId: string;

  total: number;

  paymentMethod:
    | 'cash'
    | 'card'
    | 'transfer';

  
  paymentReference?: string;

  status:
    | 'completed'
    | 'cancelled'
    | 'refunded';

  createdAt: string;
}