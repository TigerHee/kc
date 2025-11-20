import { config, now, siteCfg } from '../src/config'

describe('config module', () => {
  it('config', () => {
    expect(!!config()).toBe(true)
    expect(config('timeDiff')).toBe(0)
    config('timeDiff', 2)
    expect(config('timeDiff')).toBe(2)
    config({'timeDiff': 1})
    expect(config('timeDiff')).toBe(1)
    expect(config('jsBridge', {} as any)).toBeUndefined()
  })
  it('now', () => {
    config('timeDiff', 0)
    expect(now()).toBe(Date.now())
    config('timeDiff', 2)
    expect(now()).toBe(Date.now()+2)
    config('timeDiff', 0)
  })
  it('siteCfg', () => {
    expect(typeof siteCfg).toBe('object')
    expect(typeof siteCfg._NEW_KUCOIN_HOST_COM).toBe('string')
  })
})
