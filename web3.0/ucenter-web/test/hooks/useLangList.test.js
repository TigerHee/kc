/**
 * Owner: eli.xiang@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useLangList from 'src/hooks/useLangList';

jest.mock('react-redux', () => {
  return {
    __esModule: true,
    default: null,
    useDispatch: jest.fn(() => jest.fn()),
  };
});

test('test useConstructor', () => {
  renderHook(useLangList);
});
