/**
 * Owner: tiger@kupotech.com
 */
import AlertInfo, { Prompt } from 'src/components/Account/SecurityForm/Alert';
import { customRender } from 'test/setup';

describe('test Alert', () => {
  test('test AlertInfo', () => {
    const { rerender, container } = customRender(<AlertInfo />);
    rerender(<AlertInfo addMessage={true} message="test" />);
    expect(container.innerHTML).toContain('test');
  });

  test('test Prompt', () => {
    const { rerender } = customRender(<Prompt />);
    rerender(<Prompt content="test" icon="xx/xx" />);
  });
});
