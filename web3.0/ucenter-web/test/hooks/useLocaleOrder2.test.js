/**
 * Owner: tiger@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useLocaleOrder from 'src/hooks/useLocaleOrder';
// import { basename} from 'tools/i18n';

jest.mock('react-redux', () => {
  return {
    __esModule: true,
    default: null,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(() => ({ user: { user: {} } })),
  };
});

// beforeEach(() => {
//   jest.clearAllMocks(); // 清除所有的 mock
// });

jest.mock('tools/i18n', () => ({
  getLocaleFromBrowser: () => 'zh_HK',
  getCurrentLangFromPath: jest.fn(() => 'zh_HK'),
  needConfirmLang: jest.fn(() => false),
  basename: '',
}));

test('test useLocaleOrder', () => {
  renderHook(useLocaleOrder);
});
