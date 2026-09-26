import { Injectable } from '@angular/core';
import { Shift } from '../models/shift.model';
import { StorageService } from './storage.service';
import { TicketService } from './ticket.service';
import { CashMovementService } from './cash-movement.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  private readonly STORAGE_KEY = 'shifts';

  constructor(
    private storage: StorageService,
    private ticketService: TicketService,
    private cashMovementService: CashMovementService
  ) {}

  // Obtener todos los turnos
  getAll(): Shift[] {
    return this.storage.get<Shift[]>(
      this.STORAGE_KEY
    ) ?? [];
  }

  // Obtener el turno actualmente abierto
  getOpenShift(): Shift | null {
    const shifts = this.getAll();

    return shifts.find(
      shift => shift.status === 'open'
    ) ?? null;
  }

  // Abrir un turno nuevo
  async openShift(
    userId: string,
    initialCash: number
  ): Promise<Shift> {

    // Primero verificamos que no exista otro turno abierto
    const existingShift =
      this.getOpenShift();

    if (existingShift) {
      throw new Error(
        'Ya existe un turno abierto.'
      );
    }

    return this.storage.runTransaction(
      [
        this.STORAGE_KEY,
        'cash-movements'
      ],
      () => {

        const shifts = this.getAll();

        const now =
          new Date().toISOString();

        const newShift: Shift = {
          id: crypto.randomUUID(),
          userId,
          openedAt: now,
          initialCash,
          status: 'open',
          openedBy: userId,
          createdAt: now,
          updatedAt: now
        };

        shifts.push(newShift);

        this.storage.set(
          this.STORAGE_KEY,
          shifts
        );

        // Registrar el efectivo inicial
        // como movimiento de apertura
        this.cashMovementService.add(
          newShift.id,
          'opening',
          initialCash
        );

        return newShift;
      }
    );
  }

  // Cerrar un turno
  closeShift(
    shiftId: string,
    finalCash: number,
    closedBy: string
  ): Shift {

    const shifts = this.getAll();

    const index = shifts.findIndex(
      shift => shift.id === shiftId
    );

    if (index === -1) {
      throw new Error(
        'El turno no existe.'
      );
    }

    const shift = shifts[index];

    if (shift.status === 'closed') {
      throw new Error(
        'El turno ya está cerrado.'
      );
    }

    const openTickets =
      this.ticketService
        .getByShiftId(shiftId)
        .filter(ticket => ticket.status === 'open');

    if (openTickets.length > 0) {
      throw new Error(
        'No se puede cerrar el turno porque existen tickets abiertos.'
      );
    }

    return this.storage.runTransaction(
      [
        this.STORAGE_KEY,
        'cash-movements'
      ],
      () => {


        const expectedCash =
          this.cashMovementService.getExpectedCash(
            shiftId
          );

        const cashDifference =
          finalCash - expectedCash;

        const now =
          new Date().toISOString();

        const closedShift: Shift = {
          ...shift,
          finalCash,
          cashDifference,
          status: 'closed',
          closedAt: now,
          closedBy,
          updatedAt: now
        };

        
        shifts[index] = closedShift;

        this.storage.set(
          this.STORAGE_KEY,
          shifts
        );

        // Registrar el efectivo contado al cerrar
        // el turno. Este movimiento no modifica
        // el efectivo esperado.
        this.cashMovementService.add(
          shiftId,
          'closing',
          finalCash
        );

        return closedShift;
      }
    );
  }

}