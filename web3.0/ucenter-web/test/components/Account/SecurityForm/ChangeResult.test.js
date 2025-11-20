/**
 * Owner: willen@kupotech.com
 */
import ChangeResult from 'src/components/Account/SecurityForm/ChangeResult';
import { customRender } from 'test/setup';

describe('test ChangeResult', () => {
  test('test ChangeResult', () => {
    customRender(<ChangeResult open={true} vertical cancelText="test" title="has title" />);
  });

  test('test ChangeResult', () => {
    // mock isH5
    Object.defineProperty(window, 'innerWidth', {
      get: () => 480,
      configurable: true,
    });
    customRender(
      <ChangeResult open={true} okText="okText test" title="has title" onOk={() => {}} />,
    );
  });
});
