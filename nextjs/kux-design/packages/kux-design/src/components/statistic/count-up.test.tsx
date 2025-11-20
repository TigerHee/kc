
import { render, screen, waitFor } from '@testing-library/react';
import CountUp from './count-up';

describe('CountUp Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('duration is 0', () => {
    render(<CountUp start={0} end={100000000000000} duration={0} />);
    expect(screen.getByText('100,000,000,000,000')).toBeInTheDocument();
    render(<CountUp start={0} end={1000000000000.999} duration={0} />);
    expect(screen.getByText('1,000,000,000,000.999')).toBeInTheDocument();
    render(<CountUp start={0} end={-100000000000.8999} duration={0} />);
    expect(screen.getByText('-100,000,000,000.8999')).toBeInTheDocument();
    render(<CountUp end={0} duration={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('动画执行过程', () => {
    const mockRequestAnimationFrame = jest.spyOn(window, 'requestAnimationFrame');
    render(<CountUp start={0} end={100} duration={1000} />);
    for (let i = 0; i < 10; i++) {
      jest.advanceTimersByTime(100);
    }

    const lastCall = mockRequestAnimationFrame.mock.calls.length;
    expect(lastCall).toBeGreaterThan(0);
    mockRequestAnimationFrame.mockRestore();
  });

  it('不设置decimals，预期小数位按照终值小数位展示', async () => {
    render(<CountUp end={123.456} duration={1000} />);
    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(screen.getByText('123.456')).toBeInTheDocument();
    });
  });

  it('负数，duration不为0', async () => {
    render(<CountUp start={-100} end={-1232378238.9945} duration={1000} decimals={2} />);
    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(screen.getByText('-1,232,378,238.99')).toBeInTheDocument();
    });
  });

  it('onFinish回调执行', async () => {
    const onFinish = jest.fn();
    render(<CountUp start={10} end={100} duration={1000} onFinish={onFinish} />);
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(onFinish).toHaveBeenCalled();
    });
  });
});