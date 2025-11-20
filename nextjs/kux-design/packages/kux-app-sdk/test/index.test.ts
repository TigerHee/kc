import { app } from "../src";

describe('app sdk entry', () => { 
  it('app', () => {
    expect(app).toBeDefined();
    expect(app.appMeta).toBeDefined();
    expect(app.is('string', 'string')).toBe(true);
    expect(app.siteCfg._NEW_KUCOIN_HOST_COM).toBeDefined();
    expect(typeof app.basename).toBe('string');
    expect(typeof app.pathname).toBe('string');
    expect(app.global).toBe(globalThis);
    expect(app.lang && typeof app.lang).toBe('string');
    expect(typeof app.isRTL).toBe('boolean');
    expect(typeof app.isInApp).toBe('boolean');
    expect(typeof app.isTMA).toBe('boolean');
    expect(typeof app.isUseSSG).toBe('boolean');

    const extension = (cfg: any, aaa: any) => {
      expect(aaa).toBe(app);
      expect(typeof cfg.innerEmit).toBe('function');
    }

    app.extend(extension);
  });
})