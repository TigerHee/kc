import BaseCard from 'src/routes/AccountPage/Kyc/Kyb/Home/components/Card';
import { customRender } from 'test/setup';

describe('test BaseCard', () => {
  test('test BaseCard', () => {
    customRender(<BaseCard bottomSlot="bottomSlot" leftSlot={<div>test</div>} />, {});
  });
});
