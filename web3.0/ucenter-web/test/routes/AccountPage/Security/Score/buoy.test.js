import Buoy from 'src/routes/AccountPage/Security/Score/components/Buoy';
import { customRender } from 'test/setup';

describe('test Buoy', () => {

  test('test low', () => {
    customRender(<Buoy level="Low" />, {});
  });

  test('test low', () => {
    customRender(<Buoy level="Medium" />, {});
  });

  test('test high', () => {
    customRender(<Buoy level="High" />, {});
  });
});