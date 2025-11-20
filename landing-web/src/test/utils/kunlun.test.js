/*
 * Owner: herin.yao@kupotech.com
 */
import { init } from '@kc/web-kunlun';
import initKunlun from 'src/utils/kunlun';

jest.mock('@kc/web-kunlun');

describe('kunlun', () => {
  it('should init api called when call initKunlun', () => {
    expect(initKunlun()).toBeUndefined();
    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({
        // apis: [],
        site: 'KC',
        project: 'landing-web',
      })
    );
  });
});
