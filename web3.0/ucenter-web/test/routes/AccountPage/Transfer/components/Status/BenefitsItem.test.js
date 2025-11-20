import Benefits from 'src/routes/AccountPage/Transfer/components/Status/BenefitsItem';
import { customRender } from 'test/setup';

describe('test Benefits', () => {
  test('test Benefits', () => {
    customRender(<Benefits />, {});
  });
});
