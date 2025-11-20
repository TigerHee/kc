/**
 * Owner: John.Qi@kupotech.com
 */
import '@testing-library/jest-dom';
import Head from 'src/components/Head';
import { customRender } from 'src/test/setup';

describe('test Head', () => {
  test('test Head 1', async () => {
    customRender(
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>aaa - bbb</title>
      </Head>,
    );
  });
  test('test Head 2', async () => {
    customRender(
      <Head>
        <meta charSet="UTF-8" />
        <meta charSet="UTF-8" />
        <title>aaa - bbb</title>
        <title>111 - 222</title>
        <meta key="$v" name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta key="$v" name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>,
    );
  });
});
