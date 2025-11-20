/**
 * Owner: sean.shi@kupotech.com
 */
import HelpModal from 'src/components/Account/Overview/Market/HelpModal';
import { customRender } from 'test/setup';

describe('test OverviewMarket', () => {
  test('renders HelpModal', () => {
    customRender(<HelpModal />);
  });
});
