/**
 * Owner: lucas.l.lu@kupotech.com
 */

import { session } from 'utils/kcSession';

describe('session', () => {
  test('base scene', () => {
    session.setItem('key', 'value');
    expect(session.getItem('key')).toBe('value');

    session.setItem('from_tg', 1);
    expect(session.getItem('from_tg')).toBe(1);

    session.setItem('json', {
      name: 'test',
    });
    expect(session.getItem('json')).toEqual({
      name: 'test',
    });

    session.removeItem('key');
    expect(session.getItem('key')).toBe(null);

    session.removeItem('json');
    expect(session.getItem('json')).toBe(null);
  });

  test('throw _storage error', () => {
    // undefined or null
    session._storage = null;
    session.setItem('key', 'value');
    expect(session.setItem('key2')).toBe(false);
    expect(session.getItem('key')).toBe(null);
    expect(session.removeItem('key')).toBe(false);

    // implementation error
    session._storage = {
      setItem() {
        throw new Error('not support');
      },
      getItem() {
        throw new Error('not support');
      },
      removeItem() {
        throw new Error('not support');
      },
    };

    // 异常不会抛出
    expect(session.setItem('key', 'value')).toBe(false);
    expect(session.getItem('key')).toBe(null);
    expect(session.removeItem('key')).toBe(false);
  });
});
