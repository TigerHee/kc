import { storage, getStorage } from '../src/storage'
import { globalObject } from '../src/utils';

describe('storage', () => {
  it('storage', () => {
    const key = 'test'
    const value = 'test'
    storage(key, value)
    expect(storage(key)).toBe(value)
    storage(key, null)
    // TODO: should be undefined
    expect(storage(key)).toBe(null)
  })

  it('storage error', () => {
    const key = 'test'
    const value = 'test'
    storage(key, value)
    expect(storage(key)).toBe(value)
    // failed to set storage
    storage(key, globalThis)
    expect(storage(key)).toBe(value)
    localStorage.setItem(`kucoinv2_${key}`, 'invalid json')
    expect(storage({area: 'local', isPublic: true }, key)).toBe('invalid json')
  })

  it('storage memory', () => {
    const key = 'test'
    const value = 'test'
    storage({ area: 'memory'} ,key, value)
    expect(storage({ area: 'memory'}, key)).toBe(value)
    // failed to set storage
    storage({ area: 'memory'}, key, globalThis)
    expect(storage({ area: 'memory'}, key)).toBe(value)
    storage({ area: 'memory'}, key, null)
    expect(storage({ area: 'memory'}, key)).toBe(undefined)
  })

  it('getStorage ', () => {
    const store = getStorage('unknown storage')
    expect(store).toBeTruthy()
    Object.defineProperty(globalObject, 'inaccessibleStorage', {
      get: () => {
        throw new Error('inaccessibleStorage')
      }
    })
    expect(() => getStorage('inaccessibleStorage')).not.toThrow()
    expect(() => getStorage('inaccessibleStorage')).toBeTruthy()
  })

})
