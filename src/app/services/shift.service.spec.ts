import { TestBed } from '@angular/core/testing';
import { ShiftService } from './shift.service';
import { StorageService } from './storage.service';
import { TicketService } from './ticket.service';
import { CashMovementService } from './cash-movement.service';

describe('ShiftService', () => {

  let service: ShiftService;
  let storage: StorageService;
  let ticketService: TicketService;
  let cashMovementService: CashMovementService;

  const userId = 'user-1';
  const otherUserId = 'user-2';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShiftService,
        CashMovementService,
        StorageService,
        TicketService
      ]
    });

    service = TestBed.inject(ShiftService);
    cashMovementService =TestBed.inject(CashMovementService);
    storage = TestBed.inject(StorageService);
    ticketService = TestBed.inject(TicketService);


    storage.clear();
  });

  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debe retornar una lista vacía cuando no existen turnos', () => {
    expect(service.getAll()).toEqual([]);
  });

  it('debe abrir un turno correctamente', async () => {
    const shift = await service.openShift(
      userId,
      1000
    );

    expect(shift.id).toBeTruthy();
    expect(shift.userId).toBe(userId);
    expect(shift.initialCash).toBe(1000);
    expect(shift.status).toBe('open');
    expect(shift.openedBy).toBe(userId);
    expect(shift.openedAt).toBeTruthy();
    expect(shift.createdAt).toBeTruthy();
    expect(shift.updatedAt).toBeTruthy();
  });


it('debe crear un movimiento opening al abrir un turno', async () => {
  const initialCash = 1000;

  const shift =
    await service.openShift(
      userId,
      initialCash
    );

  const movements =
    cashMovementService.getByShiftId(
      shift.id
    );

  expect(movements.length).toBe(1);

  expect(movements[0].type)
    .toBe('opening');

  expect(movements[0].amount)
    .toBe(initialCash);

  expect(movements[0].shiftId)
    .toBe(shift.id);
});


it('el efectivo esperado de un turno recién abierto debe coincidir con el initialCash', async () => {
  const initialCash = 1500;

  const shift =
    await service.openShift(
      userId,
      initialCash
    );

  const expectedCash =
    cashMovementService.getExpectedCash(
      shift.id
    );

  expect(expectedCash)
    .toBe(initialCash);
});


  it('debe guardar el turno creado', async () => {
    const shift = await service.openShift(
      userId,
      1000
    );

    const shifts = service.getAll();

    expect(shifts.length).toBe(1);
    expect(shifts[0].id).toBe(shift.id);
  });

  it('debe retornar el turno abierto', async () => {
    const shift = await service.openShift(
      userId,
      1000
    );

    const openShift =
      service.getOpenShift();

    expect(openShift).not.toBeNull();
    expect(openShift?.id).toBe(shift.id);
  });

  it('no debe permitir abrir otro turno si ya existe uno abierto', async () => {
    await service.openShift(
      userId,
      1000
    );

    await expectAsync(
      service.openShift(
        otherUserId,
        2000
      )
    ).toBeRejectedWithError(
      'Ya existe un turno abierto.'
    );
  });

  it('debe permitir abrir un nuevo turno después de cerrar el anterior', async () => {
    const firstShift =
      await service.openShift(
        userId,
        1000
      );

    service.closeShift(
      firstShift.id,
      1500,
      userId
    );

    const secondShift =
      await service.openShift(
        otherUserId,
        2000
      );

    expect(secondShift.id).not.toBe(
      firstShift.id
    );

    expect(secondShift.status).toBe('open');
    expect(service.getOpenShift()?.id)
      .toBe(secondShift.id);
  });

  it('debe cerrar un turno correctamente', async () => {
    const shift =
      await service.openShift(
        userId,
        1000
      );

    const closedShift =
      service.closeShift(
        shift.id,
        1500,
        userId
      );

    expect(closedShift.status).toBe('closed');
    expect(closedShift.finalCash).toBe(1500);
    expect(closedShift.closedBy).toBe(userId);
    expect(closedShift.closedAt).toBeTruthy();
  });

  it('debe guardar el turno cerrado', async () => {
    const shift =
      await service.openShift(
        userId,
        1000
      );

    service.closeShift(
      shift.id,
      1500,
      userId
    );

    const savedShift =
      service.getAll()[0];

    expect(savedShift.status).toBe('closed');
    expect(savedShift.finalCash).toBe(1500);
  });

  it('debe retornar null cuando no existe un turno abierto', () => {
    expect(service.getOpenShift()).toBeNull();
  });

  it('debe rechazar el cierre de un turno inexistente', () => {
    expect(() =>
      service.closeShift(
        'non-existent-shift',
        1000,
        userId
      )
    ).toThrowError(
      'El turno no existe.'
    );
  });

  it('no debe permitir cerrar un turno que ya está cerrado', async () => {
    const shift =
      await service.openShift(
        userId,
        1000
      );

    service.closeShift(
      shift.id,
      1500,
      userId
    );

    expect(() =>
      service.closeShift(
        shift.id,
        2000,
        userId
      )
    ).toThrowError(
      'El turno ya está cerrado.'
    );
  });

  it('debe conservar el turno cerrado en el historial', async () => {
    const shift =
      await service.openShift(
        userId,
        1000
      );

    service.closeShift(
      shift.id,
      1500,
      userId
    );

    const shifts =
      service.getAll();

    expect(shifts.length).toBe(1);
    expect(shifts[0].id).toBe(shift.id);
    expect(shifts[0].status).toBe('closed');
  });


  it('no debe permitir cerrar un turno que tenga tickets abiertos', async () => {
  const shift =
    await service.openShift(
      userId,
      1000
    );

  ticketService.create(
  shift.id,
  userId
  );

  expect(() =>
    service.closeShift(
      shift.id,
      1500,
      userId
    )
  ).toThrowError(
    'No se puede cerrar el turno porque existen tickets abiertos.'
  );
});


it('debe permitir cerrar un turno cuando todos sus tickets están cerrados', async () => {
  const shift =
    await service.openShift(
      userId,
      1000
    );

  const ticket =
    ticketService.create(
      shift.id,
      userId
    );

  ticketService.markAsPaid(
    ticket.id
  );

  const closedShift =
    service.closeShift(
      shift.id,
      1500,
      userId
    );

  expect(closedShift.status).toBe('closed');
  expect(closedShift.finalCash).toBe(1500);
});


it('debe permitir cerrar un turno con tickets cancelados', async () => {
  const shift =
    await service.openShift(
      userId,
      1000
    );

  const ticket =
    ticketService.create(
      shift.id,
      userId
    );

  ticketService.cancel(
    ticket.id,
    userId,
    'Cliente canceló el pedido'
  );

  const closedShift =
    service.closeShift(
      shift.id,
      1000,
      userId
    );

  expect(closedShift.status).toBe('closed');
  expect(closedShift.finalCash).toBe(1000);
});


it('debe permitir cerrar un turno con tickets eliminados', async () => {
  const shift =
    await service.openShift(
      userId,
      1000
    );

  const ticket =
    ticketService.create(
      shift.id,
      userId
    );

  ticketService.delete(
    ticket.id,
    userId,
    'Ticket eliminado'
  );

  const closedShift =
    service.closeShift(
      shift.id,
      1000,
      userId
    );

  expect(closedShift.status).toBe('closed');
  expect(closedShift.finalCash).toBe(1000);
});



it('debe revertir la apertura del turno si falla la creación del movimiento opening', async () => {
  const initialCash = 1000;

  spyOn(
    cashMovementService,
    'add'
  ).and.throwError(
    'Error al registrar el movimiento de apertura.'
  );

  await expectAsync(
    service.openShift(
      userId,
      initialCash
    )
  ).toBeRejectedWithError(
    'Error al registrar el movimiento de apertura.'
  );

  expect(
    service.getAll().length
  ).toBe(0);

  expect(
    cashMovementService.getAll().length
  ).toBe(0);
});


it('debe crear un movimiento closing al cerrar un turno', async () => {
  const initialCash = 1000;
  const finalCash = 1250;

  const shift =
    await service.openShift(
      userId,
      initialCash
    );

  service.closeShift(
    shift.id,
    finalCash,
    userId
  );

  const movements =
    cashMovementService.getByShiftId(
      shift.id
    );

  const closingMovement =
    movements.find(
      movement => movement.type === 'closing'
    );

  expect(closingMovement)
    .toBeDefined();

  expect(closingMovement!.shiftId)
    .toBe(shift.id);

  expect(closingMovement!.amount)
    .toBe(finalCash);
});


it('el movimiento closing no debe modificar el efectivo esperado', async () => {
  const initialCash = 1000;

  const shift =
    await service.openShift(
      userId,
      initialCash
    );

  cashMovementService.add(
    shift.id,
    'sale',
    500
  );

  const expectedBeforeClose =
    cashMovementService.getExpectedCash(
      shift.id
    );

  service.closeShift(
    shift.id,
    1300,
    userId
  );

  const expectedAfterClose =
    cashMovementService.getExpectedCash(
      shift.id
    );

  expect(expectedBeforeClose)
    .toBe(1500);

  expect(expectedAfterClose)
    .toBe(1500);
});



it('debe guardar el efectivo final contado al cerrar el turno', async () => {
  const initialCash = 1000;
  const finalCash = 1450;

  const shift =
    await service.openShift(
      userId,
      initialCash
    );

  const closedShift =
    service.closeShift(
      shift.id,
      finalCash,
      userId
    );

  expect(closedShift.status)
    .toBe('closed');

  expect(closedShift.finalCash)
    .toBe(finalCash);

  expect(closedShift.closedBy)
    .toBe(userId);

  expect(closedShift.closedAt)
    .toBeDefined();
});



it('debe revertir el cierre del turno si falla la creación del movimiento closing', async () => {
  const initialCash = 1000;
  const finalCash = 1200;

  const shift =
    await service.openShift(
      userId,
      initialCash
    );

  spyOn(
    cashMovementService,
    'add'
  ).and.callFake(
    (
      shiftId,
      type,
      amount,
      description?
    ) => {

      if (type === 'closing') {
        throw new Error(
          'Error al registrar el movimiento de cierre.'
        );
      }

      return {
        id: crypto.randomUUID(),
        shiftId,
        type,
        amount,
        description,
        createdAt: new Date().toISOString()
      };
    }
  );

  expect(() =>
    service.closeShift(
      shift.id,
      finalCash,
      userId
    )
  ).toThrowError(
    'Error al registrar el movimiento de cierre.'
  );

  const currentShift =
    service.getOpenShift();

  expect(currentShift)
    .not.toBeNull();

  expect(currentShift!.id)
    .toBe(shift.id);

  expect(currentShift!.status)
    .toBe('open');

  const movements =
    cashMovementService.getByShiftId(
      shift.id
    );

  const closingMovements =
    movements.filter(
      movement => movement.type === 'closing'
    );

  expect(closingMovements.length)
    .toBe(0);
});



it('debe calcular y guardar un faltante de caja al cerrar el turno', async () => {
  const initialCash = 1000;
  const saleAmount = 500;
  const finalCash = 1450;

  const shift =
    await service.openShift(
      userId,
      initialCash
    );

  cashMovementService.add(
    shift.id,
    'sale',
    saleAmount
  );

  const closedShift =
    service.closeShift(
      shift.id,
      finalCash,
      userId
    );

  expect(
    (closedShift as any).cashDifference
  ).toBe(-50);
});



it('debe calcular y guardar un sobrante de caja al cerrar el turno', async () => {
  const initialCash = 1000;
  const saleAmount = 500;
  const finalCash = 1600;

  const shift =
    await service.openShift(
      userId,
      initialCash
    );

  cashMovementService.add(
    shift.id,
    'sale',
    saleAmount
  );

  const closedShift =
    service.closeShift(
      shift.id,
      finalCash,
      userId
    );

  expect(
    (closedShift as any).cashDifference
  ).toBe(100);
});



it('debe registrar una diferencia de caja de cero cuando el efectivo coincide', async () => {
  const initialCash = 1000;
  const saleAmount = 500;
  const finalCash = 1500;

  const shift =
    await service.openShift(
      userId,
      initialCash
    );

  cashMovementService.add(
    shift.id,
    'sale',
    saleAmount
  );

  const closedShift =
    service.closeShift(
      shift.id,
      finalCash,
      userId
    );

  expect(
    (closedShift as any).cashDifference
  ).toBe(0);
});




it('debe calcular la diferencia usando todos los movimientos que afectan el efectivo esperado', async () => {
  const initialCash = 1000;

  const shift =
    await service.openShift(
      userId,
      initialCash
    );

  cashMovementService.add(
    shift.id,
    'sale',
    500
  );

  cashMovementService.add(
    shift.id,
    'withdrawal',
    200
  );

  const closedShift =
    service.closeShift(
      shift.id,
      1250,
      userId
    );

  /*
   * Efectivo esperado:
   *
   * 1000 opening
   * +500 sale
   * -200 withdrawal
   * = 1300
   *
   * Efectivo contado: 1250
   *
   * Diferencia:
   * 1250 - 1300 = -50
   */

  expect(
    (closedShift as any).cashDifference
  ).toBe(-50);
});


it('debe revertir completamente el cierre si falla el movimiento closing', async () => {
  const initialCash = 1000;
  const saleAmount = 500;
  const finalCash = 1400;

  const shift =
    await service.openShift(
      userId,
      initialCash
    );

  cashMovementService.add(
    shift.id,
    'sale',
    saleAmount
  );

  spyOn(
    cashMovementService,
    'add'
  ).and.callFake(
    (
      shiftId,
      type,
      amount,
      description?
    ) => {

      if (type === 'closing') {
        throw new Error(
          'Error al registrar el movimiento de cierre.'
        );
      }

      return {
        id: crypto.randomUUID(),
        shiftId,
        type,
        amount,
        description,
        createdAt: new Date().toISOString()
      };
    }
  );

  expect(() =>
    service.closeShift(
      shift.id,
      finalCash,
      userId
    )
  ).toThrowError(
    'Error al registrar el movimiento de cierre.'
  );

  const currentShift =
    service.getAll().find(
      current => current.id === shift.id
    );

  expect(currentShift)
    .toBeDefined();

  expect(currentShift!.status)
    .toBe('open');

  expect(currentShift!.finalCash)
    .toBeUndefined();

  expect(currentShift!.cashDifference)
    .toBeUndefined();

  expect(currentShift!.closedAt)
    .toBeUndefined();

  expect(currentShift!.closedBy)
    .toBeUndefined();

  const movements =
    cashMovementService.getByShiftId(
      shift.id
    );

  expect(
    movements.filter(
      movement => movement.type === 'closing'
    ).length
  ).toBe(0);

  expect(
    movements.filter(
      movement => movement.type === 'opening'
    ).length
  ).toBe(1);

  expect(
    movements.filter(
      movement => movement.type === 'sale'
    ).length
  ).toBe(1);
});

});