/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import Footer from 'src/components/Premarket/containers/Footer.js';
import { customRender } from 'src/test/setup';

describe('test Footer', () => {
  test('test Footer', async () => {
    customRender(<Footer />, {});
  });
});
