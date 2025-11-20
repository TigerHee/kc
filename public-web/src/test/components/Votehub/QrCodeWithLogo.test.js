/**
 * Owner: larvide.peng@kupotech.com
 */
import QRCode from 'components/QrCodeWithLogo';
import { customRender } from 'src/test/setup';

describe('QrCodeWithLogo', () => {
  it('should render correctly', () => {
    customRender(<QRCode value={''} size={192} level="M" />);
  });

  it('should render correctly', () => {
    customRender(
      <QRCode
        value={'https://assets.staticimg.com/brisk-web/1.0.24/svg/logo-icon.d6c8e4f9.svg'}
        size={192}
        level="M"
      />,
    );
  });
});
