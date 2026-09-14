export interface Ticket {
  id: string;

  shiftId: string;
  userId: string;

  number: number;

  status:
    | 'open'
    | 'paid'
    | 'cancelled'
    | 'deleted';

  createdAt: string;

  paidAt?: string;

  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;

  deletedAt?: string;
  deletedBy?: string;
  deletionReason?: string;
}