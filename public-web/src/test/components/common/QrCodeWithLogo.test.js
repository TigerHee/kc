/**
 * Owner: John.Qi@kupotech.com
 */
import '@testing-library/jest-dom';
import QRCode from 'components/QrCodeWithLogo';
import { customRender } from 'src/test/setup';

describe('test common ChangeRate', () => {
  test('test common ChangeRate 1', async () => {
    customRender(<QRCode value="222" size={144} level="M" />);
  });
});
