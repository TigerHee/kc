import { CardModal } from 'src/routes/AccountPage/Transfer/components/OneClickProcess/components/Modal';

import { customRender } from 'test/setup';

describe('test AwaitContainer', () => {
  test('test AwaitContainer', () => {
    customRender(
      <CardModal
        title="Hello"
        subtitle="BTC"
        footer="World"
        warning="warning test"
        note="note something"
        items={['Hello1', 'World2']}
        open={false}
        onCancel={() => {}}
        onOk={() => {}}
      />,
      {},
    );
  });
});
