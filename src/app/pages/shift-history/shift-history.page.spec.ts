import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ShiftHistoryPage } from './shift-history.page';

import { ShiftService } from 'src/app/services/shift.service';
import { ShiftCloseReportService } from 'src/app/services/shift-close-report.service';

describe('ShiftHistoryPage', () => {
  let component: ShiftHistoryPage;
  let fixture: ComponentFixture<ShiftHistoryPage>;

  let shiftServiceSpy: jasmine.SpyObj<ShiftService>;
  let reportServiceSpy: jasmine.SpyObj<ShiftCloseReportService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    shiftServiceSpy = jasmine.createSpyObj('ShiftService', [
      'getAll'
    ]);

    reportServiceSpy = jasmine.createSpyObj('ShiftCloseReportService', [
      'getByShiftId'
    ]);

    routerSpy = jasmine.createSpyObj('Router', [
      'navigate'
    ]);

    shiftServiceSpy.getAll.and.returnValue([]);

    await TestBed.configureTestingModule({
      declarations: [
        ShiftHistoryPage
      ],
      imports: [
        IonicModule.forRoot(),
        FormsModule
      ],
      providers: [
        { provide: ShiftService, useValue: shiftServiceSpy },
        {
          provide: ShiftCloseReportService,
          useValue: reportServiceSpy
        },
        {
          provide: Router,
          useValue: routerSpy
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShiftHistoryPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load only closed shifts', () => {
      shiftServiceSpy.getAll.and.returnValue([
        {
          id: 'shift-open',
          status: 'open',
          openedAt: '2026-01-02T10:00:00.000Z',
          updatedAt: '2026-01-02T10:00:00.000Z'
        },
        {
          id: 'shift-closed',
          status: 'closed',
          openedAt: '2026-01-01T10:00:00.000Z',
          closedAt: '2026-01-01T18:00:00.000Z',
          updatedAt: '2026-01-01T18:00:00.000Z'
        }
      ] as any);

      component.ngOnInit();

      expect(component.shifts.length).toBe(1);
      expect(component.shifts[0].id).toBe('shift-closed');
    });

    it('should sort closed shifts from newest to oldest', () => {
      shiftServiceSpy.getAll.and.returnValue([
        {
          id: 'shift-old',
          status: 'closed',
          openedAt: '2026-01-01T10:00:00.000Z',
          closedAt: '2026-01-01T18:00:00.000Z',
          updatedAt: '2026-01-01T18:00:00.000Z'
        },
        {
          id: 'shift-new',
          status: 'closed',
          openedAt: '2026-01-03T10:00:00.000Z',
          closedAt: '2026-01-03T18:00:00.000Z',
          updatedAt: '2026-01-03T18:00:00.000Z'
        }
      ] as any);

      component.ngOnInit();

      expect(component.shifts[0].id).toBe('shift-new');
      expect(component.shifts[1].id).toBe('shift-old');
    });
  });

  describe('viewReport', () => {
    it('should load and display the selected report', () => {
      const report = {
        shiftId: 'shift-1'
      } as any;

      reportServiceSpy.getByShiftId.and.returnValue(report);

      const shift = {
        id: 'shift-1',
        status: 'closed'
      } as any;

      component.viewReport(shift);

      expect(
        reportServiceSpy.getByShiftId
      ).toHaveBeenCalledWith('shift-1');

      expect(component.selectedReport).toBe(report);
      expect(component.showReport).toBeTrue();
      expect(component.reportError).toBe('');
    });

    it('should show an error when the report cannot be loaded', () => {
      reportServiceSpy.getByShiftId.and.throwError(
        'El turno no está cerrado.'
      );

      component.viewReport({
        id: 'shift-1',
        status: 'closed'
      } as any);

      expect(component.selectedReport).toBeNull();
      expect(component.showReport).toBeFalse();
      expect(component.reportError).toBe(
        'El turno no está cerrado.'
      );
    });
  });

  describe('closeReport', () => {
    it('should clear the report state', () => {
      component.showReport = true;
      component.selectedReport = {
        shiftId: 'shift-1'
      } as any;
      component.reportError = 'error';

      component.closeReport();

      expect(component.showReport).toBeFalse();
      expect(component.selectedReport).toBeNull();
      expect(component.reportError).toBe('');
    });
  });

  describe('getPaymentTotal', () => {
    it('should return zero when there is no selected report', () => {
      component.selectedReport = null;

      expect(component.getPaymentTotal('cash')).toBe(0);
    });

    it('should return the corresponding payment total', () => {
      component.selectedReport = {
        summary: {
          cashSales: 100,
          cardSales: 200,
          transferSales: 300
        }
      } as any;

      expect(component.getPaymentTotal('cash')).toBe(100);
      expect(component.getPaymentTotal('card')).toBe(200);
      expect(component.getPaymentTotal('transfer')).toBe(300);
    });
  });

  describe('getMovementTypeLabel', () => {
    it('should return the correct label for each movement type', () => {
      expect(component.getMovementTypeLabel('opening')).toBe('Apertura');
      expect(component.getMovementTypeLabel('sale')).toBe('Venta');
      expect(component.getMovementTypeLabel('withdrawal')).toBe('Retiro');
      expect(component.getMovementTypeLabel('deposit')).toBe('Depósito');
      expect(component.getMovementTypeLabel('refund')).toBe('Reembolso');
      expect(component.getMovementTypeLabel('adjustment')).toBe('Ajuste');
      expect(component.getMovementTypeLabel('closing')).toBe('Cierre');
    });
  });

  describe('getMovementSign', () => {
    it('should return the correct sign', () => {
      expect(component.getMovementSign('opening')).toBe('+');
      expect(component.getMovementSign('sale')).toBe('+');
      expect(component.getMovementSign('deposit')).toBe('+');

      expect(component.getMovementSign('withdrawal')).toBe('-');
      expect(component.getMovementSign('refund')).toBe('-');

      expect(component.getMovementSign('adjustment')).toBe('');
      expect(component.getMovementSign('closing')).toBe('');
    });
  });

  describe('goToCashManagement', () => {
    it('should navigate to cash management', () => {
      component.goToCashManagement();

      expect(routerSpy.navigate).toHaveBeenCalledWith([
        '/cash-management'
      ]);
    });
  });
});