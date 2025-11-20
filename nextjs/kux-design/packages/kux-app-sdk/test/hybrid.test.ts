import { hybrid, getAppMeta } from '../src/hybrid'

describe('hybrid', () => {
  it('hybrid', () => {
    hybrid.on('test', () => {
      console.log('test')
    });
    hybrid.off('test');
    hybrid.call('getUserInfo');
    hybrid.config('getUserInfo');
  })

  it('getAppMeta', () => {
    const meta = getAppMeta();
    expect(meta).toEqual({});
  })
})