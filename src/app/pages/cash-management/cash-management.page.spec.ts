import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CashManagementPage } from './cash-management.page';

import { ShiftService } from 'src/app/services/shift.service';
import { CurrentShiftService } from 'src/app/services/current-shift.service';
import { CashMovementService } from 'src/app/services/cash-movement.service';
import { SessionService } from 'src/app/services/session.service';

describe('CashManagementPage', () => {
  let component: CashManagementPage;
  let fixture: ComponentFixture<CashManagementPage>;

  let shiftServiceSpy: jasmine.SpyObj<ShiftService>;
  let currentShiftServiceSpy: jasmine.SpyObj<CurrentShiftService>;
  let cashMovementServiceSpy: jasmine.SpyObj<CashMovementService>;
  let sessionServiceSpy: jasmine.SpyObj<SessionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    shiftServiceSpy = jasmine.createSpyObj('ShiftService', [
      'openShift',
      'closeShift'
    ]);

    currentShiftServiceSpy = jasmine.createSpyObj('CurrentShiftService', [
      'getCurrentShift',
      'getCurrentSummary',
      'getCurrentCashMovements'
    ]);

    cashMovementServiceSpy = jasmine.createSpyObj('CashMovementService', [
      'add'
    ]);

    sessionServiceSpy = jasmine.createSpyObj('SessionService', [
      'user'
    ]);

    routerSpy = jasmine.createSpyObj('Router', [
      'navigate'
    ]);

    currentShiftServiceSpy.getCurrentShift.and.returnValue(null);

    await TestBed.configureTestingModule({
      declarations: [
        CashManagementPage
      ],
      imports: [
        IonicModule.forRoot(),
        FormsModule
      ],
      providers: [
        { provide: ShiftService, useValue: shiftServiceSpy },
        { provide: CurrentShiftService, useValue: currentShiftServiceSpy },
        { provide: CashMovementService, useValue: cashMovementServiceSpy },
        { provide: SessionService, useValue: sessionServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CashManagementPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load the current shift', () => {
      component.ngOnInit();

      expect(
        currentShiftServiceSpy.getCurrentShift
      ).toHaveBeenCalled();
    });

    it('should clear summary and movements when there is no open shift', () => {
      currentShiftServiceSpy.getCurrentShift.and.returnValue(null);

      component.ngOnInit();

      expect(component.currentShift).toBeNull();
      expect(component.currentSummary).toBeNull();
      expect(component.cashMovements).toEqual([]);
    });
  });

  describe('open shift form', () => {
    it('should open the form with clean values', () => {
      component.initialCash = 500;
      component.openError = 'error';

      component.openOpenShiftForm();

      expect(component.showOpenForm).toBeTrue();
      expect(component.initialCash).toBeNull();
      expect(component.openError).toBe('');
    });

    it('should close the form and clear the error', () => {
      component.showOpenForm = true;
      component.openError = 'error';

      component.closeOpenShiftForm();

      expect(component.showOpenForm).toBeFalse();
      expect(component.openError).toBe('');
    });
  });

  describe('openMovementForm', () => {
    it('should reset the movement form', () => {
      component.movementType = 'withdrawal';
      component.movementAmount = 300;
      component.movementDescription = 'Retiro';
      component.movementError = 'error';

      component.openMovementForm();

      expect(component.showMovementForm).toBeTrue();
      expect(component.movementType).toBe('deposit');
      expect(component.movementAmount).toBeNull();
      expect(component.movementDescription).toBe('');
      expect(component.movementError).toBe('');
    });
  });

  describe('closeMovementForm', () => {
    it('should close the movement form and clear the error', () => {
      component.showMovementForm = true;
      component.movementError = 'error';

      component.closeMovementForm();

      expect(component.showMovementForm).toBeFalse();
      expect(component.movementError).toBe('');
    });
  });

  describe('openCloseShiftForm', () => {
    it('should reset the close shift form', () => {
      component.finalCash = 1500;
      component.closeError = 'error';

      component.openCloseShiftForm();

      expect(component.showCloseForm).toBeTrue();
      expect(component.finalCash).toBeNull();
      expect(component.closeError).toBe('');
    });
  });

  describe('closeCloseShiftForm', () => {
    it('should close the form and clear the error', () => {
      component.showCloseForm = true;
      component.closeError = 'error';

      component.closeCloseShiftForm();

      expect(component.showCloseForm).toBeFalse();
      expect(component.closeError).toBe('');
    });
  });

  describe('saveOpenShift', () => {
    it('should show an error when there is no logged user', () => {
      sessionServiceSpy.user.and.returnValue(null);

      component.initialCash = 500;
      component.saveOpenShift();

      expect(component.openError).toBe('No hay un usuario en sesión.');
      expect(shiftServiceSpy.openShift).not.toHaveBeenCalled();
    });

    it('should show an error when initial cash is invalid', () => {
      sessionServiceSpy.user.and.returnValue({
        id: 'user-1'
      } as any);

      component.initialCash = -1;
      component.saveOpenShift();

      expect(component.openError).toBe(
        'El efectivo inicial debe ser mayor o igual a cero.'
      );
      expect(shiftServiceSpy.openShift).not.toHaveBeenCalled();
    });

    it('should open the shift successfully', () => {
      const user = { id: 'user-1' } as any;

      sessionServiceSpy.user.and.returnValue(user);
      component.initialCash = 500;

      shiftServiceSpy.openShift.and.returnValue({
        id: 'shift-1'
      } as any);

      component.showOpenForm = true;

      component.saveOpenShift();

      expect(shiftServiceSpy.openShift).toHaveBeenCalledWith(
        'user-1',
        500
      );

      expect(currentShiftServiceSpy.getCurrentShift).toHaveBeenCalled();

      expect(component.showOpenForm).toBeFalse();
      expect(component.openError).toBe('');
    });

    it('should show the service error when opening the shift fails', () => {
      sessionServiceSpy.user.and.returnValue({
        id: 'user-1'
      } as any);

      component.initialCash = 500;

      shiftServiceSpy.openShift.and.throwError(
        'Ya existe un turno abierto.'
      );

      component.saveOpenShift();

      expect(component.openError).toBe(
        'Ya existe un turno abierto.'
      );
    });
  });

  describe('saveMovement', () => {
    it('should show an error when there is no logged user', () => {
      sessionServiceSpy.user.and.returnValue(null);

      component.saveMovement();

      expect(component.movementError).toBe(
        'No hay un usuario en sesión.'
      );

      expect(cashMovementServiceSpy.add).not.toHaveBeenCalled();
    });

    it('should show an error when there is no open shift', () => {
      sessionServiceSpy.user.and.returnValue({
        id: 'user-1'
      } as any);

      component.currentShift = null;
      component.saveMovement();

      expect(component.movementError).toBe(
        'No hay un turno abierto.'
      );

      expect(cashMovementServiceSpy.add).not.toHaveBeenCalled();
    });

    it('should show an error when the amount is invalid', () => {
      sessionServiceSpy.user.and.returnValue({
        id: 'user-1'
      } as any);

      component.currentShift = {
        id: 'shift-1'
      } as any;

      component.movementAmount = 0;

      component.saveMovement();

      expect(component.movementError).toBe(
        'El monto debe ser mayor que cero.'
      );

      expect(cashMovementServiceSpy.add).not.toHaveBeenCalled();
    });

    it('should register a movement successfully', () => {
      sessionServiceSpy.user.and.returnValue({
        id: 'user-1'
      } as any);

      component.currentShift = {
        id: 'shift-1'
      } as any;

      component.movementType = 'deposit';
      component.movementAmount = 500;
      component.movementDescription = 'Ingreso adicional';
      component.showMovementForm = true;

      cashMovementServiceSpy.add.and.returnValue({
        id: 'movement-1'
      } as any);

      component.saveMovement();

      expect(cashMovementServiceSpy.add).toHaveBeenCalledWith(
        'shift-1',
        'deposit',
        500,
        'Ingreso adicional'
      );

      expect(currentShiftServiceSpy.getCurrentShift).toHaveBeenCalled();

      expect(component.showMovementForm).toBeFalse();
      expect(component.movementError).toBe('');
    });

    it('should show the service error when registering a movement fails', () => {
      sessionServiceSpy.user.and.returnValue({
        id: 'user-1'
      } as any);

      component.currentShift = {
        id: 'shift-1'
      } as any;

      component.movementAmount = 500;

      cashMovementServiceSpy.add.and.throwError(
        'No se pudo registrar el movimiento.'
      );

      component.saveMovement();

      expect(component.movementError).toBe(
        'No se pudo registrar el movimiento.'
      );
    });
  });

  describe('saveCloseShift', () => {
    it('should show an error when there is no logged user', () => {
      sessionServiceSpy.user.and.returnValue(null);

      component.saveCloseShift();

      expect(component.closeError).toBe(
        'No hay un usuario en sesión.'
      );

      expect(shiftServiceSpy.closeShift).not.toHaveBeenCalled();
    });

    it('should show an error when there is no open shift', () => {
      sessionServiceSpy.user.and.returnValue({
        id: 'user-1'
      } as any);

      component.currentShift = null;

      component.saveCloseShift();

      expect(component.closeError).toBe(
        'No hay un turno abierto.'
      );

      expect(shiftServiceSpy.closeShift).not.toHaveBeenCalled();
    });

    it('should show an error when final cash is invalid', () => {
      sessionServiceSpy.user.and.returnValue({
        id: 'user-1'
      } as any);

      component.currentShift = {
        id: 'shift-1'
      } as any;

      component.finalCash = -1;

      component.saveCloseShift();

      expect(component.closeError).toBe(
        'El efectivo final debe ser mayor o igual a cero.'
      );

      expect(shiftServiceSpy.closeShift).not.toHaveBeenCalled();
    });

    it('should close the shift successfully', () => {
      sessionServiceSpy.user.and.returnValue({
        id: 'user-1'
      } as any);

      component.currentShift = {
        id: 'shift-1'
      } as any;

      component.finalCash = 1500;
      component.showCloseForm = true;

      shiftServiceSpy.closeShift.and.returnValue({
        id: 'shift-1',
        status: 'closed'
      } as any);

      component.saveCloseShift();

      expect(shiftServiceSpy.closeShift).toHaveBeenCalledWith(
        'shift-1',
        1500,
        'user-1'
      );

      expect(currentShiftServiceSpy.getCurrentShift).toHaveBeenCalled();

      expect(component.showCloseForm).toBeFalse();
      expect(component.closeError).toBe('');
    });

    it('should show the service error when closing the shift fails', () => {
      sessionServiceSpy.user.and.returnValue({
        id: 'user-1'
      } as any);

      component.currentShift = {
        id: 'shift-1'
      } as any;

      component.finalCash = 1500;

      shiftServiceSpy.closeShift.and.throwError(
        'No se puede cerrar el turno porque hay tickets abiertos.'
      );

      component.saveCloseShift();

      expect(component.closeError).toBe(
        'No se puede cerrar el turno porque hay tickets abiertos.'
      );
    });
  });

  describe('getMovementTypeLabel', () => {
    it('should return the correct label for each movement type', () => {
      expect(component.getMovementTypeLabel('opening')).toBe('Apertura');
      expect(component.getMovementTypeLabel('sale')).toBe('Venta');
      expect(component.getMovementTypeLabel('deposit')).toBe('Depósito');
      expect(component.getMovementTypeLabel('withdrawal')).toBe('Retiro');
      expect(component.getMovementTypeLabel('refund')).toBe('Reembolso');
      expect(component.getMovementTypeLabel('adjustment')).toBe('Ajuste');
      expect(component.getMovementTypeLabel('closing')).toBe('Cierre');
    });
  });

  describe('goToWorkDesk', () => {
    it('debe navegar al escritorio de trabajo', () => {
      component.goToWorkDesk();

      expect(routerSpy.navigate).toHaveBeenCalledWith([
        '/work-desk'
      ]);
    });
  });


  describe('goToShiftHistory', () => {
  it('debe navegar al historial de turnos', () => {
    component.goToShiftHistory();

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/shift-history'
    ]);
  });
});

});