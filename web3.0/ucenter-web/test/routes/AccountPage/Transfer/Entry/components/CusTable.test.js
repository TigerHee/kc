import CusTable from 'src/routes/AccountPage/Transfer/Entry/components/CusTable';
import { customRender } from 'test/setup';

describe('test CusTable', () => {
  test('test CusTable', () => {
    customRender(<CusTable columns={{}} dataSource={[]} />, {});
  });
});
