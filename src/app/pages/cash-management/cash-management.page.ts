import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Shift } from 'src/app/models/shift.model';
import { ShiftSummary } from 'src/app/models/shift-summary.model';
import { CashMovement } from 'src/app/models/cash-movement.model';

import { ShiftService } from 'src/app/services/shift.service';
import { CurrentShiftService } from 'src/app/services/current-shift.service';
import { CashMovementService } from 'src/app/services/cash-movement.service';
import { SessionService } from 'src/app/services/session.service';


@Component({
  selector: 'app-cash-management',
  templateUrl: './cash-management.page.html',
  styleUrls: ['./cash-management.page.scss'],
  standalone: false,

})
export class CashManagementPage implements OnInit {

  currentShift: Shift | null = null;
  currentSummary: ShiftSummary | null = null;
  cashMovements: CashMovement[] = [];

  showOpenForm = false;
  initialCash: number | null = null;
  openError = '';

  showMovementForm = false;
  movementType: 'deposit' | 'withdrawal' = 'deposit';
  movementAmount: number | null = null;
  movementDescription = '';
  movementError = '';

  showCloseForm = false;
  finalCash: number | null = null;
  closeError = '';

  constructor(
    private shiftService: ShiftService,
    private currentShiftService: CurrentShiftService,
    private cashMovementService: CashMovementService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentShift();
  }

  //Carga el turno actual, el resumen y los movimientos de efectivo
  private loadCurrentShift(): void {
    this.currentShift = this.currentShiftService.getCurrentShift();

    if (!this.currentShift) {
      this.currentSummary = null;
      this.cashMovements = [];
      return;
    }

    this.currentSummary =
      this.currentShiftService.getCurrentSummary();

    this.cashMovements =
      this.currentShiftService.getCurrentCashMovements();
  }

  // Abre el formulario para abrir un turno
  openOpenShiftForm(): void {
    this.initialCash = null;
    this.openError = '';
    this.showOpenForm = true;
  }

  // Cierra el formulario para abrir un turno
  closeOpenShiftForm(): void {
    this.showOpenForm = false;
    this.openError = '';
  }

  // Abre el formulario para registrar un movimiento de efectivo
  openMovementForm(): void {
    this.movementType = 'deposit';
    this.movementAmount = null;
    this.movementDescription = '';
    this.movementError = '';
    this.showMovementForm = true;
  }

  // Cierra el formulario para registrar un movimiento de efectivo
  closeMovementForm(): void {
    this.showMovementForm = false;
    this.movementError = '';
  }

  // Abre el formulario para cerrar un turno
  openCloseShiftForm(): void {
    this.finalCash = null;
    this.closeError = '';
    this.showCloseForm = true;
  }

  // Cierra el formulario para cerrar un turno
  closeCloseShiftForm(): void {
    this.showCloseForm = false;
    this.closeError = '';
  }

  // Guarda el turno abierto
  saveOpenShift(): void {
    this.openError = '';

    const user = this.session.user();

    if (!user) {
      this.openError = 'No hay un usuario en sesión.';
      return;
    }

    if (
      this.initialCash === null ||
      this.initialCash < 0
    ) {
      this.openError =
        'El efectivo inicial debe ser mayor o igual a cero.';
      return;
    }

    try {
      this.shiftService.openShift(
        user.id,
        this.initialCash
      );

      this.loadCurrentShift();
      this.closeOpenShiftForm();
    } catch (error) {
      this.openError =
        error instanceof Error
          ? error.message
          : 'No se pudo abrir el turno.';
    }
  }

  // Guarda un movimiento de efectivo
  saveMovement(): void {
    this.movementError = '';

    const user = this.session.user();

    if (!user) {
      this.movementError = 'No hay un usuario en sesión.';
      return;
    }

    if (!this.currentShift) {
      this.movementError = 'No hay un turno abierto.';
      return;
    }

    if (
      this.movementAmount === null ||
      this.movementAmount <= 0
    ) {
      this.movementError =
        'El monto debe ser mayor que cero.';
      return;
    }

    try {
      this.cashMovementService.add(
        this.currentShift.id,
        this.movementType,
        this.movementAmount,
        this.movementDescription.trim() || undefined
      );

      this.loadCurrentShift();
      this.closeMovementForm();
    } catch (error) {
      this.movementError =
        error instanceof Error
          ? error.message
          : 'No se pudo registrar el movimiento.';
    }
  }

  // Guarda el cierre del turno
  saveCloseShift(): void {
    this.closeError = '';

    const user = this.session.user();

    if (!user) {
      this.closeError = 'No hay un usuario en sesión.';
      return;
    }

    if (!this.currentShift) {
      this.closeError = 'No hay un turno abierto.';
      return;
    }

    if (
      this.finalCash === null ||
      this.finalCash < 0
    ) {
      this.closeError =
        'El efectivo final debe ser mayor o igual a cero.';
      return;
    }

    try {
      this.shiftService.closeShift(
        this.currentShift.id,
        this.finalCash,
        user.id
      );

      this.loadCurrentShift();
      this.closeCloseShiftForm();
    } catch (error) {
      this.closeError =
        error instanceof Error
          ? error.message
          : 'No se pudo cerrar el turno.';
    }
  }

  // Obtiene la etiqueta legible para el tipo de movimiento de efectivo
  getMovementTypeLabel(
    type: CashMovement['type']
  ): string {
    switch (type) {
      case 'opening':
        return 'Apertura';

      case 'sale':
        return 'Venta';

      case 'deposit':
        return 'Depósito';

      case 'withdrawal':
        return 'Retiro';

      case 'refund':
        return 'Reembolso';

      case 'adjustment':
        return 'Ajuste';

      case 'closing':
        return 'Cierre';
    }
  }

  // Navega a la página de escritorio de trabajo
  goToWorkDesk(): void {
    this.router.navigate(['/work-desk']);
  }

  // Navega a la página de historial de turnos
  goToShiftHistory(): void {
  this.router.navigate(['/shift-history']);
}
}
