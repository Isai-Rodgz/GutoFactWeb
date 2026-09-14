export interface Shift {
  id: string;

  userId: string;

  openedAt: string;
  closedAt?: string;

  initialCash: number;
  finalCash?: number;

  status: 'open' | 'closed';

  openedBy: string;
  closedBy?: string;

  createdAt: string;
  updatedAt: string;
}