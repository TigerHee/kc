/**
 * Owner: jessie@kupotech.com
 */
import { Link } from 'src/components/Router/index.js';
import { customRender } from '../setup';

describe('test Link', () => {
  test('test Link', () => {
    customRender(<Link href="/" />, {});
  });
});
