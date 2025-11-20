/**
 * Owner: garuda@kupotech.com
 */
import { eventEmmiter } from '@/pages/Futures/import';

import { TriggerControl } from '@/pages/Futures/components/SocketDataFormulaCalc/utils';

import { greaterThanOrEqualTo } from 'utils/operation';

jest.mock('@/pages/Futures/import', () => ({
  eventEmmiter: {
    getEvt: jest.fn().mockReturnValue({
      emit: jest.fn(),
    }),
  },
}));

jest.mock('utils/operation', () => ({
  greaterThanOrEqualTo: jest.fn(),
}));

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

describe('TriggerControl', () => {
  let triggerControl;

  const event = eventEmmiter.getEvt();

  beforeEach(() => {
    triggerControl = new TriggerControl({ eventName: 'test-event' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reset all states', () => {
    triggerControl.state.interval = setInterval(() => {}, 1000);

    triggerControl.resetAll();

    expect(triggerControl.state).toEqual({
      stack: [],

      endTimer: null,

      startTimer: null,

      highTask: false,

      interval: null,
    });
  });

  it('should emit calc event', () => {
    triggerControl.emitCalc();

    expect(event.emit).toHaveBeenCalledWith('futures_start_calc');
  });

  it('should handle interval correctly', () => {
    greaterThanOrEqualTo.mockReturnValue(() => true);

    triggerControl.state.endTimer = Date.now();

    triggerControl.state.stack.push(1);

    triggerControl.handleInterval();

    expect(event.emit).toHaveBeenCalledWith('futures_start_calc');

    expect(triggerControl.state.stack).toEqual([]);
  });

  it('should lock update', () => {
    triggerControl.lockUpdate();

    expect(triggerControl.timer).not.toBeNull();

    expect(event.emit).toHaveBeenCalledWith('futures_start_calc_lock', true);
  });

  it('should trigger calc correctly', () => {
    const now = Date.now();

    jest.spyOn(Date, 'now').mockReturnValue(now);

    triggerControl.triggerCalc();

    expect(triggerControl.state.stack).toEqual([1]);

    expect(triggerControl.state.startTimer).toBe(now);

    expect(triggerControl.state.endTimer).toBe(now + 1000);

    expect(triggerControl.state.interval).not.toBeNull();
  });

  it('calling triggerCalc method 20 times should return 2 emitCalc method calls', () => {
    jest.spyOn(triggerControl, 'emitCalc');

    Array.from({ length: 21 }).forEach(() => {
      triggerControl.triggerCalc();
    });

    greaterThanOrEqualTo.mockImplementationOnce(() => () => true);

    triggerControl.triggerCalc();

    jest.runAllTimers();

    expect(triggerControl.emitCalc).toBeCalledTimes(2);
  });

  it('should unlock update', () => {
    triggerControl.unlockUpdate();

    expect(triggerControl.timer).toBeNull();

    expect(event.emit).toHaveBeenCalledWith('futures_start_calc_lock', false);
  });

  it('repeated calls to lockUpdate will not execute the emit method within a time period', () => {
    triggerControl.lockUpdate();
    triggerControl.lockUpdate();

    expect(event.emit).toBeCalledTimes(1);
  });

  it('should run highTask', () => {
    const now = Date.now();

    jest.spyOn(Date, 'now').mockReturnValue(now);

    jest.spyOn(triggerControl, 'emitCalc');

    greaterThanOrEqualTo.mockImplementationOnce(() => () => false);

    triggerControl.triggerCalc(true);

    jest.runOnlyPendingTimers();

    triggerControl.triggerCalc();

    expect(triggerControl.emitCalc).toBeCalledTimes(1);
  });

  it('call unlock function triggerCalc no longer calls', () => {
    jest.spyOn(triggerControl, 'unlockUpdate');

    triggerControl.triggerCalc();
    triggerControl.lockUpdate();
    triggerControl.triggerCalc();

    jest.runOnlyPendingTimers();

    expect(triggerControl.unlockUpdate).toBeCalledTimes(1);
  });
});
