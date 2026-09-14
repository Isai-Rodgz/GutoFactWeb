import { Injectable } from '@angular/core';
import { Shift } from '../models/shift.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  private readonly STORAGE_KEY = 'shifts';

  constructor(
    private storage: StorageService
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
   initialCash: number): Promise<Shift> {

        // Primero verificamos que no exista otro turno abierto
        const existingShift = this.getOpenShift();

        if (existingShift) {
            throw new Error('Ya existe un turno abierto.');
        }

        const shifts = this.getAll();

        const now = new Date().toISOString();

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

        return newShift;
    }

    
    // Cerrar un turno
    closeShift(shiftId: string,
    finalCash: number,
    closedBy: string
    ): Shift {

        const shifts = this.getAll();

        const index = shifts.findIndex(
            shift => shift.id === shiftId
        );

        if (index === -1) {
            throw new Error('El turno no existe.');
        }

        const shift = shifts[index];

        if (shift.status === 'closed') {
            throw new Error('El turno ya está cerrado.');
        }

        const now = new Date().toISOString();

        const closedShift: Shift = {
            ...shift,

            finalCash,

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

        return closedShift;
    }

}