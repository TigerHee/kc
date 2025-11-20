/*
 * Owner: melon@kupotech.com
 */

/**
 * 单测文件
 */
import { supportUrl } from 'src/components/UserTransfer/config.js';

describe('test UserTransfer/config', () => {
  test('test supportUrl', () => {
    expect(supportUrl).toBeDefined();
  });
});
