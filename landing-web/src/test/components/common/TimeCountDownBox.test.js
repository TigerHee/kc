/*
 * @Owner: jesse.shao@kupotech.com
 */
// import TimeCountDownBox from '@kp-toc/anti-duplication';
import TimeCountDownBox from 'components/common/TimeCountDownBox';
import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

jest.mock('utils/ga', () => {
  return {
    __esModule: true,
    default: {
      kcsensorsClick: jest.fn(),
    },
  };
});

describe('test TimeCountDownBox', () => {
  test('renders TimeCountDownBox component', () => {
    render(
      <TimeCountDownBox
        categories={{}}
        numberBoxClassName="numberBoxClassName"
        className="className"
      />,
    );
    expect(screen.queryAllByText('0').length).toBe(8);
    // expect(screen.queryAllByText('S').length).toBe(8);
    expect(screen.queryByText('S')).toBeInTheDocument();
    // screen.debug();
  });

  test('renders TimeCountDownBox component', () => {
    const res = render(
      <TimeCountDownBox
        categories={{}}
        numberBoxClassName="numberBoxClassName"
        className="className"
        plainTextMod={() => '1234'}
      />,
    );
    // screen.debug();
    expect(screen.queryAllByText('0').length).toBe(0);
    expect(screen.queryByText('S')).toBeNull();
    res.rerender(
      <TimeCountDownBox
        restSec={10}
        // categories={{}}
        numberBoxClassName="numberBoxClassName"
        className="className"
        plainTextMod={() => '1234'}
      />,
    );
  });

  test('renders TimeCountDownBox component', async () => {
    act(() => {
      render(<TimeCountDownBox numberBoxClassName="numberBoxClassName" className="className" />);
    });

    await new Promise((r) => setTimeout(r, 1050));

    expect(screen.queryAllByText('0').length).toBe(8);
  });

  test('renders TimeCountDownBox component', async () => {
    const handleCountEnd = jest.fn();
    act(() => {
      render(
        <TimeCountDownBox
          // handleCountEnd={handleCountEnd}
          numberBoxClassName="numberBoxClassName"
          className="className"
        />,
      );
    });

    await new Promise((r) => setTimeout(r, 1050));

    expect(screen.queryAllByText('0').length).toBe(8);
    // expect(handleCountEnd).toHaveBeenCalled();
  });

  test('renders TimeCountDownBox component', async () => {
    const handleCountChange = jest.fn();

    act(() => {
      render(
        <TimeCountDownBox
          restSec={10}
          // handleCountChange={handleCountChange}
          numberBoxClassName="numberBoxClassName"
          className="className"
        />,
      );
    });

    await new Promise((r) => setTimeout(r, 1050));

    expect(screen.queryAllByText('0').length).toBe(8);
    // expect(handleCountChange).toHaveBeenCalled();
  });
});
