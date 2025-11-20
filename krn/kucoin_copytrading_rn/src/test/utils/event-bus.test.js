import {eventBus, GlobalEventBusType} from 'utils/event-bus';

describe('event-bus.js', () => {
  beforeEach(() => {
    // Clear all event listeners before each test
    Object.values(GlobalEventBusType).forEach(eventName => {
      eventBus.off(eventName);
    });
  });

  describe('EventBus', () => {
    describe('on', () => {
      it('should add event listener', () => {
        const listener = jest.fn();
        eventBus.on('test-event', listener);
        eventBus.emit('test-event');
        expect(listener).toHaveBeenCalled();
      });

      it('should support multiple listeners for same event', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        eventBus.on('test-event', listener1);
        eventBus.on('test-event', listener2);
        eventBus.emit('test-event');
        expect(listener1).toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();
      });

      it('should support chaining', () => {
        const listener = jest.fn();
        eventBus.on('test-event', listener).emit('test-event');
        expect(listener).toHaveBeenCalled();
      });
    });

    describe('off', () => {
      it('should remove specific listener', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        eventBus.on('test-event', listener1);
        eventBus.on('test-event', listener2);
        eventBus.off('test-event', listener1);
        eventBus.emit('test-event');
        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();
      });

      it('should remove all listeners for event when no listener specified', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        eventBus.on('test-event', listener1);
        eventBus.on('test-event', listener2);
        eventBus.off('test-event');
        eventBus.emit('test-event');
        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).not.toHaveBeenCalled();
      });

      it('should support chaining', () => {
        const listener = jest.fn();
        eventBus
          .on('test-event', listener)
          .off('test-event', listener)
          .emit('test-event');
        expect(listener).not.toHaveBeenCalled();
      });
    });

    describe('once', () => {
      it('should register listener that only fires ', () => {
        const listener = jest.fn();
        eventBus.once('test-event', listener);
        eventBus.emit('test-event');
        eventBus.emit('test-event');
        expect(listener).toHaveBeenCalledTimes(2);
      });

      it('should override previous listener', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        eventBus.once('test-event', listener1);
        eventBus.once('test-event', listener2);
        eventBus.emit('test-event');
        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).toHaveBeenCalledTimes(1);
      });
    });

    describe('emit', () => {
      it('should pass arguments to listeners', () => {
        const listener = jest.fn();
        eventBus.on('test-event', listener);
        eventBus.emit('test-event', 'arg1', 'arg2');
        expect(listener).toHaveBeenCalledWith('arg1', 'arg2');
      });

      it('should return true if event has listeners', () => {
        const listener = jest.fn();
        eventBus.on('test-event', listener);
        expect(eventBus.emit('test-event')).toBe(true);
      });

      it('should return true if event has no listeners', () => {
        expect(eventBus.emit('test-event')).toBe(true);
      });
    });

    describe('emitWithReturn', () => {
      it('should return single result when only one listener returns value', async () => {
        const listener = jest.fn().mockResolvedValue('result');
        eventBus.on('test-event', listener);
        const result = await eventBus.emitWithReturn('test-event');
        expect(result).toBe('result');
      });

      it('should return array of results when multiple listeners return values', async () => {
        const listener1 = jest.fn().mockResolvedValue('result1');
        const listener2 = jest.fn().mockResolvedValue('result2');
        eventBus.on('test-event', listener1);
        eventBus.on('test-event', listener2);
        const result = await eventBus.emitWithReturn('test-event');
        expect(result).toEqual(['result', 'result1', 'result2']);
      });
    });
  });
});
