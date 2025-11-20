import { eventBus, innerEmit } from '../src/event'

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('event', () => {
  it('eventBus normal use', async () => {
    const eventName = 'test'
    const callback = vi.fn()
    eventBus.on(eventName, callback)
    eventBus.emit(eventName, 1)
    await wait(100)
    expect(callback).toBeCalledWith(1)
    eventBus.off(eventName, callback)
    eventBus.off(eventName)
    eventBus.off([eventName, 'test2', 'hhh'])
    eventBus.emit({eventName}, 2)
    await wait(100)
    expect(callback).toBeCalledTimes(1)
  })

  it('eventBus once', async () => {
    const eventName = 'test'
    const callback = vi.fn()
    eventBus.once(eventName, callback)
    eventBus.emit(eventName, 1)
    await wait(100)
    expect(callback).toBeCalledWith(1)
    eventBus.emit(eventName, 2)
    await wait(100)
    expect(callback).toBeCalledTimes(1)
  })

  it('eventBus restrict event', () => {
    expect(() => eventBus.emit('app:ready')).toThrowError()
  })

  it('eventBus off', async () => {
    const eventName = 'test'
    const callback = vi.fn()
    const callback2 = vi.fn()
    eventBus.on(eventName, callback)
    eventBus.on(eventName, callback2)
    eventBus.emit(eventName, 1)
    await wait(100)
    expect(callback).toBeCalledWith(1)
    expect(callback2).toBeCalledWith(1)
    eventBus.off(eventName, callback)
    eventBus.emit(eventName, 2)
    await wait(100)
    expect(callback2).toBeCalledTimes(2)

    eventBus.off(eventName)
    eventBus.off(eventName, callback2)
    eventBus.emit(eventName, 3)
    await wait(100)
    expect(callback2).toBeCalledTimes(2)
  })

  it('eventBus on', async () => {
    const eventName = 'test'
    const callback = () => 33
    eventBus.on(eventName, callback)
    const resp = await eventBus.emit(eventName, 1)
    expect(resp).toEqual(33)
    eventBus.off(eventName, callback)
    const resp2 = await eventBus.emit(eventName, 2)
    expect(resp2).toEqual(undefined)

    const callback2 = () => {
      throw new Error('error')
    }
    eventBus.on('error', callback2)

    expect(eventBus.emit('error')).rejects.toThrowError()

  })

  it('innerEmit', async () => {
    const eventName = 'app:ready'
    const callback = vi.fn()
    eventBus.on(eventName, callback)
    innerEmit(eventName, 1)
    expect(callback).toBeCalledTimes(0)
    await wait(100)
    expect(callback).toBeCalledTimes(1)
    innerEmit({
      eventName,
      immediate: true,
    }, 2)
    expect(callback).toBeCalledTimes(2)
    await innerEmit({
      eventName: 'app:not-exits',
      immediate: false,
    }, 3)
    await innerEmit({
      eventName: 'app:not-exits',
      immediate: false,
    }, 3)
    await innerEmit({
      eventName: 'event-not-exist',
      immediate: false,
    }, 3)
  })

})