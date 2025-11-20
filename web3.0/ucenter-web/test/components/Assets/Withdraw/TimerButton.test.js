import TimerButton from 'src/components/Assets/Withdraw/TimerButton';
import { customRender } from 'test/setup';

describe('test TimerButton', () => {
  test('test TimerButton', () => {
    customRender(
      <TimerButton
        id="id"
        bizType="bizType"
        onClick={() => {}}
        countAfterClick={() => {}}
        timeDelay={60}
      />,
      {},
    );
  });
});
