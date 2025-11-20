import CountUp from 'src/routes/AccountPage/Security/Score/components/CountUp';
import { customRender } from 'test/setup';

test('test CountUp', () => {
  customRender(<CountUp target={0} />, {});
});