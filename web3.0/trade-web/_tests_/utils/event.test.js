/**
 * Owner: garuda@kupotech.com
 */

import EventBus from '@/utils/event';

describe('EventBus', () => {
  let eventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('should register and trigger an event correctly', () => {
    const callback = jest.fn();
    eventBus.on('testEvent', callback);

    eventBus.emit('testEvent');
    expect(callback).toHaveBeenCalled();
  });

  it('should trigger an event only once when registered with once', () => {
    const callback = jest.fn();
    eventBus.once('testEvent', callback);

    eventBus.emit('testEvent');
    eventBus.emit('testEvent');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should trigger an event only a certain number of times when registered with exactly', () => {
    const callback = jest.fn();
    eventBus.exactly('testEvent', callback, 2);

    eventBus.emit('testEvent');
    eventBus.emit('testEvent');
    eventBus.emit('testEvent');
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not trigger an event after it has been killed with die', () => {
    const callback = jest.fn();
    eventBus.on('testEvent', callback);

    eventBus.die('testEvent');
    eventBus.emit('testEvent');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not trigger an event after it has been killed with off', () => {
    const callback = jest.fn();
    eventBus.on('testEvent', callback);

    eventBus.off('testEvent');
    eventBus.emit('testEvent');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not trigger a specific callback after it has been detached', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    eventBus.on('testEvent', callback1);
    eventBus.on('testEvent', callback2);

    eventBus.detach('testEvent', callback1);
    eventBus.emit('testEvent');
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  it('should not trigger any callbacks after all have been detached', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    eventBus.on('testEvent', callback1);
    eventBus.on('testEvent', callback2);

    eventBus.detachAll('testEvent');
    eventBus.emit('testEvent');
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });

  it('should support wildcard event names', () => {
    const callback = jest.fn();
    eventBus.on('testEvent.*', callback);

    eventBus.emit('testEvent.\*\*');
    expect(callback).not.toHaveBeenCalled();
  });
});
