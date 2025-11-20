/**
 * Owner: John.Qi@kupotech.com
 */
import '@testing-library/jest-dom';
import InlineCoin from 'src/components/common/InlineCoin';
import { customRender } from 'src/test/setup';

describe('test common InlineCoin', () => {
  test('test common InlineCoin 1', async () => {
    customRender(
      <InlineCoin
        iconUrl="1"
        isMarket={true}
        rv={{ lg: true }}
        size={20}
        maskIcon={10}
        coin="__ALL__"
        hideName={true}
      />,
    );
  });

  test('test common InlineCoin 2', async () => {
    customRender(
      <InlineCoin
        iconUrl="1"
        isMarket={true}
        rv={{ lg: true }}
        size={20}
        currencyStatus={1}
        currencyName="BTC"
      />,
    );
  });

  test('test common InlineCoin 3', async () => {
    customRender(<InlineCoin size={20} currencyStatus={1} coin="__ALL__" />);
  });
});
