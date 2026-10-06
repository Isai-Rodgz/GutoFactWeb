import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Shift } from 'src/app/models/shift.model';
import { ShiftCloseReport } from 'src/app/models/shift-close-report.model';

import { ShiftService } from 'src/app/services/shift.service';
import { ShiftCloseReportService } from 'src/app/services/shift-close-report.service';

@Component({
  selector: 'app-shift-history',
  templateUrl: './shift-history.page.html',
  styleUrls: ['./shift-history.page.scss'],
  standalone: false
})
export class ShiftHistoryPage implements OnInit {

  shifts: Shift[] = [];
  selectedReport: ShiftCloseReport | null = null;

  showReport = false;
  reportError = '';

  constructor(
    private shiftService: ShiftService,
    private shiftCloseReportService: ShiftCloseReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadShifts();
  }

  //Carga los turnos cerrados y los ordena por fecha de cierre (o actualización si no hay fecha de cierre)
  private loadShifts(): void {
    this.shifts = this.shiftService
      .getAll()
      .filter(shift => shift.status === 'closed')
      .sort(
        (a, b) =>
          new Date(b.closedAt ?? b.updatedAt).getTime() -
          new Date(a.closedAt ?? a.updatedAt).getTime()
      );
  }

  // Muestra el reporte de cierre de turno seleccionado
  viewReport(shift: Shift): void {
    this.reportError = '';

    try {
      this.selectedReport =
        this.shiftCloseReportService.getByShiftId(shift.id);

      this.showReport = true;
    } catch (error) {
      this.selectedReport = null;
      this.reportError =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el reporte del turno.';
    }
  }

  // Cierra el reporte de cierre de turno y vuelve a la lista de turnos
  closeReport(): void {
    this.showReport = false;
    this.selectedReport = null;
    this.reportError = '';
  }

  // Navega a la página de gestión de efectivo
  goToCashManagement(): void {
    this.router.navigate(['/cash-management']);
  }

  // Obtiene el total de ventas por método de pago del reporte de cierre de turno
  getPaymentTotal(
    paymentMethod: 'cash' | 'card' | 'transfer'
  ): number {
    if (!this.selectedReport) {
      return 0;
    }

    switch (paymentMethod) {
      case 'cash':
        return this.selectedReport.summary.cashSales;

      case 'card':
        return this.selectedReport.summary.cardSales;

      case 'transfer':
        return this.selectedReport.summary.transferSales;
    }
  }

  // Obtiene la etiqueta del tipo de movimiento de efectivo
  getMovementTypeLabel(
    type: 'opening' | 'sale' | 'withdrawal' | 'deposit' |
      'refund' | 'adjustment' | 'closing'
  ): string {
    switch (type) {
      case 'opening':
        return 'Apertura';

      case 'sale':
        return 'Venta';

      case 'withdrawal':
        return 'Retiro';

      case 'deposit':
        return 'Depósito';

      case 'refund':
        return 'Reembolso';

      case 'adjustment':
        return 'Ajuste';

      case 'closing':
        return 'Cierre';
    }
  }

  // Obtiene el signo del tipo de movimiento de efectivo
  getMovementSign(
    type: 'opening' | 'sale' | 'withdrawal' | 'deposit' |
      'refund' | 'adjustment' | 'closing'
  ): string {
    switch (type) {
      case 'opening':
      case 'sale':
      case 'deposit':
        return '+';

      case 'withdrawal':
      case 'refund':
        return '-';

      case 'adjustment':
      case 'closing':
        return '';
    }
  }
}