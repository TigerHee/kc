import KCSvgIcon from 'src/components/common/KCSvgIcon';
import { customRender } from 'test/setup';

describe('test KCSvgIcon', () => {
  const onErrorMock = jest.fn();
  // iconId, onCompleted, onError
  test('test KCSvgIcon regular', () => {
    customRender(<KCSvgIcon iconId="Checkmark" onError={onErrorMock} />, { categories: {} });
  });
  test('test KCSvgIcon error', () => {
    customRender(<KCSvgIcon iconId={null} />, { categories: {} });
  });
  test('test KCSvgIcon onCompleted', () => {
    customRender(<KCSvgIcon onCompleted={true} onError={onErrorMock} iconId="Checkmark" />, {
      categories: {},
    });
  });
});
