/**
 * Owner: John.Qi@kupotech.com
 */
import '@testing-library/jest-dom';
import ChangeRate from 'src/components/common/ChangeRate';
import { customRender } from 'src/test/setup';

describe('test common ChangeRate', () => {
  test('test common ChangeRate 1', async () => {
    customRender(<ChangeRate value="1" type="normal" />);
  });

  test('test common ChangeRate 2', async () => {
    customRender(<ChangeRate value={-1} type="bordered" />);
  });

  test('test common ChangeRate 2', async () => {
    customRender(<ChangeRate value={0} />);
  });
});
