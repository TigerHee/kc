/**
 * Owner: tiger@kupotech.com
 */
import CustomUpload from 'src/components/Account/Kyc/common/components/CustomUpload';
import { customRender } from 'test/setup';

describe('test CommonFunctions', () => {
  test('test kycSeniorSubmit', async () => {
    const onSuccess = jest.fn(),
      onChange = jest.fn();
    const props = {
      kycType: 'test',
      dispatch: (e) =>
        Promise.resolve({
          success: true,
        }),
      photoType: 'jpg',
      onSuccess,
      onChange,
    };
    let ref;

    const wrapper = customRender(<CustomUpload {...props} ref={ref} />);
  });
});
