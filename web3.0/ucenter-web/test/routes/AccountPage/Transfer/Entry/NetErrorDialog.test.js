import NetErrorDialog from 'src/routes/AccountPage/Transfer/Entry/NetErrorDialog';

import { customRender } from 'test/setup';

describe('test NetErrorDialog', () => {
  test('test NetErrorDialog', () => {
    customRender(<NetErrorDialog open={() => {}} onCancel={() => {}} onRetry={() => {}} />, {});
  });
});
