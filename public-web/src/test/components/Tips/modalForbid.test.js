/**
 * Owner: jessie@kupotech.com
 */
import ModalForbid from 'src/components/Tips/ModalForbid';
import { customRender } from 'src/test/setup';

// mock @kucoin-biz/entrance
jest.mock('@kucoin-biz/entrance', () => {
  return {
    __esModule: true,
    ModalForbid: () => {
      return 'ModalForbid';
    },
  };
});

describe('Test Index component', () => {
  test('render ok', () => {
    const onCancelMock = jest.fn();
    const { getByText } = customRender(<ModalForbid onCancel={onCancelMock} />);
  });
});
