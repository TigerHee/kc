import '@testing-library/jest-dom/extend-expect'; // 提供更多的断言方法
import { fireEvent } from '@testing-library/react';
import TimerButton from 'src/components/Assets/Withdraw/TimerButton';
import { customRender } from 'test/setup';

describe('TimerButton component', () => {
  it('renders TimerButton correctly', () => {
    const { getByText } = customRender(<TimerButton />);
    const sendButton = getByText('26f293c147e54000a9ee');
    expect(sendButton).toBeInTheDocument();
  });

  it('handles click event correctly', () => {
    const handleClick = jest.fn();
    const { getByText } = customRender(<TimerButton onClick={handleClick} />);
    const sendButton = getByText('26f293c147e54000a9ee');
    fireEvent.click(sendButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
