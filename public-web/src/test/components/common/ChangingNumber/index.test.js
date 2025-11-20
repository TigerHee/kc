/**
 * Owner: John.Qi@kupotech.com
 */
import '@testing-library/jest-dom';
import ChangingNumber from 'src/components/common/ChangingNumber';
import { customRender } from 'src/test/setup';

jest.mock('lodash', () => {
  return {
    __esModule: true,
    default: {
      debounce: (fn) => fn,
    },
  };
});

describe('test common ChangingNumber', () => {
  jest.useFakeTimers();

  test('test common ChangingNumber 1', async () => {
    const { rerender } = customRender(<ChangingNumber value={1} />);
    jest.runAllTimers();
    rerender(<ChangingNumber value={2} showIcon />);
    jest.runAllTimers();
  });

  test('test common ChangingNumber 2', async () => {
    const { rerender } = customRender(<ChangingNumber value={2} />);
    jest.runAllTimers();
    rerender(<ChangingNumber value={1} showIcon />);
    jest.runAllTimers();
  });

  test('test common ChangingNumber 2', async () => {
    const { rerender } = customRender(<ChangingNumber value={1} />);
    jest.runAllTimers();
    rerender(<ChangingNumber value={2} showIcon />);
    jest.runAllTimers();
    rerender(<ChangingNumber value={1} showIcon />);
    jest.runAllTimers();
  });

  test('test common ChangingNumber 4', async () => {
    customRender(
      <ChangingNumber value={1} showIcon>
        xxx
      </ChangingNumber>,
    );
    jest.runAllTimers();
  });
});
