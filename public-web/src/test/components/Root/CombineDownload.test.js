/**
 * Owner: jessie@kupotech.com
 */
import CombineDownload from 'src/components/Root/Download/CombineDownload';
import { customRender } from '../../setup';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useMediaQuery: jest.fn(),
}));

describe('test CombineDownload', () => {
  test('test CombineDownload', () => {
    customRender(<CombineDownload />);
  });
});
