/**
 * Owner: eli.xiang@kupotech.com
 */

import EventEmitter from 'event-emitter';
import evtEmitter from 'src/utils/evtEmitter';

jest.mock('event-emitter');

describe('evtEmitter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new event emitter if it does not exist', () => {
    const evtId = 'testEvent';
    const emitter = evtEmitter.getEvt(evtId);

    expect(EventEmitter).toHaveBeenCalledTimes(1);
    expect(emitter).toBeInstanceOf(EventEmitter);
    expect(emitter).toBe(evtEmitter.getEvt(evtId)); // Should return the same instance
  });

  test('should return the same event emitter for the same event ID', () => {
    const evtId = 'testEvent';
    const emitter1 = evtEmitter.getEvt(evtId);
    const emitter2 = evtEmitter.getEvt(evtId);

    expect(emitter1).toBe(emitter2); // Should return the same instance
  });

  test('should has default event emitter', () => {
    const defaultEvt = evtEmitter.getEvt(); // Create the event emitter

    expect(evtEmitter.getEvt('event')).toBe(defaultEvt); // Ensure it exists
  });

  test('should not throw error when removing a non-existent event emitter', () => {
    expect(() => evtEmitter.removeEvt('nonExistentEvent')).not.toThrow();
  });
});
