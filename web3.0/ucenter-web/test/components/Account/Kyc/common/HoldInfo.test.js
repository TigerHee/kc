/**
 * Owner: tiger@kupotech.com
 */
import HoldInfo from 'src/components/Account/Kyc/common/components/HoldInfo';
import { customRender } from 'test/setup';

describe('test CommonFunctions', () => {
  test('test kycSeniorSubmit', async () => {
    const props = {
      code: 123,
    };
    const { container, rerender } = customRender(<HoldInfo {...props} />);
    expect(container.innerHTML).toContain('kyc.mechanism.verify.company.verify.holding.upload');
    rerender(<HoldInfo type="test" />);
  });
});
