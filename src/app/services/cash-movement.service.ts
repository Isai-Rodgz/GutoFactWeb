import { Injectable } from '@angular/core';
import { CashMovement } from '../models/cash-movement.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CashMovementService {

  private readonly STORAGE_KEY = 'cash-movements';

  constructor(
    private storage: StorageService
  ) {}


    // Obtener todos los movimientos de caja
    getAll(): CashMovement[] {

    return this.storage.get<CashMovement[]>(
      this.STORAGE_KEY
    ) ?? [];

  }



  // Obtener los movimientos pertenecientes a un turno
  getByShiftId(shiftId: string): CashMovement[] {

    const movements = this.getAll();

    return movements.filter(
      movement => movement.shiftId === shiftId
    );

  }



  // Registrar un nuevo movimiento de caja
    add(
        shiftId: string,
        type: CashMovement['type'],
        amount: number,
        description?: string
    ): CashMovement {

        const movements = this.getAll();

        const now = new Date().toISOString();

        const newMovement: CashMovement = {
        id: crypto.randomUUID(),
        shiftId,
        type,
        amount,
        description,
        createdAt: now
        };

        movements.push(newMovement);

        this.storage.set(
        this.STORAGE_KEY,
        movements
        );

        return newMovement;
    }




    //Para que me devuelva el total esperado en la caja, sumando y restando
    getExpectedCash(shiftId: string): number {

    const movements = this.getByShiftId(shiftId);

    let total = 0;

    for (const movement of movements) {

        switch (movement.type) {

        case 'opening':
        case 'sale':
        case 'deposit':
            total += movement.amount;
            break;

        case 'withdrawal':
        case 'refund':
            total -= movement.amount;
            break;

        case 'adjustment':
            // Por ahora no modificamos el total automáticamente.
            break;

        case 'closing':
            // El cierre no debe modificar el efectivo esperado.
            break;

        }

    }

    return total;

    }

}