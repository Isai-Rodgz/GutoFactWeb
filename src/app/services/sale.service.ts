import { Injectable } from '@angular/core';
import { Sale } from '../models/sale.model';
import { StorageService } from './storage.service';
import { CashMovementService } from './cash-movement.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private readonly STORAGE_KEY = 'sales';

  constructor(
    private storage: StorageService,
    private cashMovementService: CashMovementService
  ) {}

    // Obtener todas las ventas
    getAll(): Sale[] {

        return this.storage.get<Sale[]>(
        this.STORAGE_KEY
        ) ?? [];

    }



    // Obtener una venta por ID
    getById(
        saleId: string): Sale | null {

        const sales = this.getAll();

        return sales.find(
          sale => sale.id === saleId
        ) ?? null;

    }



    // Obtener las ventas pertenecientes a un turno
    getByShiftId(shiftId: string): Sale[] {

        const sales = this.getAll();

        return sales.filter(
        sale => sale.shiftId === shiftId
        );

    }




    // Obtener las ventas de un ticket
    getByTicketId(
        ticketId: string): Sale[] {

        const sales = this.getAll();

        return sales.filter(
          sale => sale.ticketId === ticketId
        );

    }




    // Registrar una venta
    add(
    shiftId: string,
    userId: string,
    ticketId: string,
    total: number,
    paymentMethod: Sale['paymentMethod'],
    paymentReference?: string): Sale {


      if (total <= 0) {
      throw new Error(
        'El total de la venta debe ser mayor que cero.');
      }

      if (
        paymentMethod === 'card' ||
        paymentMethod === 'transfer'
      ) {

        if (!paymentReference?.trim()) {
          throw new Error(
            'Se requiere una referencia para este método de pago.'
          );
        }

      }

        const sales = this.getAll();

        const now = new Date().toISOString();

        const newSale: Sale = {
          id: crypto.randomUUID(),

          shiftId,
          userId,
          ticketId,

          total,

          paymentMethod,

          paymentReference,

          status: 'completed',

          createdAt: now
        };

        sales.push(newSale);

        this.storage.set(
          this.STORAGE_KEY,
          sales
        );

        
        
        // Solo el efectivo afecta la caja física
        if (paymentMethod === 'cash') {

          this.cashMovementService.add(
              shiftId,
              'sale',
              total,
              `Venta del ticket ${ticketId}`
          );

        }

      return newSale;
    }

}