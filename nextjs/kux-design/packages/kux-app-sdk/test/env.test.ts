import { isUseSSG, isTMA } from '../src/env'

describe('env', () => {
  it('isUseSSG check', () => {
    expect(!!isUseSSG).toBe(false)
  })
  it('isTMA check', () => {
    expect(!!isTMA()).toBe(false)
  })
})