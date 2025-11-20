/*
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Coupon from 'src/components/$/Invite/Rewards/Coupon.js';

const theme = {
  colors: { text40: '#333333', text: '#333333' },
  breakpoints: {
    down: () => {},
  },
};

jest.mock('src/components/$/Invite/Rewards/styled.js', () => {
  const originalModule = jest.requireActual('src/components/$/Invite/Rewards/styled.js');

  return {
    __esModule: true,
    default: null,
    ...originalModule,
    CouponWrapper: ({ children }) => <div>{children}</div>,
  };
});

describe('MarqueeItem', () => {
  it('renders the MarqueeItem with correct styles', () => {
    render(<Coupon theme={theme} first={true} title={'title001'} main={true} />);
    const marqueeItem = screen.getByText('title001');
    expect(marqueeItem).toBeInTheDocument();
  });
});
