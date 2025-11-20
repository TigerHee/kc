/*
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import {
  MarqueeItem,
  CouponWrapper,
  GoBtn,
  MarqueeWrapper,
} from 'src/components/$/Invite/Rewards/styled.js';

const theme = {
  colors: { text40: '#333333' },
  breakpoints: {
    down: () => {},
  },
};

describe('MarqueeItem', () => {
  it('renders the MarqueeItem with correct styles', () => {
    render(
      <ThemeProvider theme={theme}>
        <MarqueeItem theme={theme} first={true}>
          Test Marquee Item
        </MarqueeItem>
      </ThemeProvider>,
    );
    const marqueeItem = screen.getByText('Test Marquee Item');
    expect(marqueeItem).toHaveStyle(
      ` font-family: 'Roboto'; font-style: normal; font-weight: 400; font-size: 12px; line-height: 36px; color: ${theme.colors.text40}; margin-right: 40px; padding-left: 12px; `,
    );
  });

  it('renders the MarqueeItem without padding-left when first prop is false', () => {
    render(
      <ThemeProvider theme={theme}>
        <MarqueeItem theme={theme} first={false}>
          Test Marquee Item
        </MarqueeItem>
      </ThemeProvider>,
    );
    const marqueeItem = screen.getByText('Test Marquee Item');
    expect(marqueeItem).not.toHaveStyle('padding-left: 12px');
  });

  it('renders CouponWrapper', () => {
    render(
      <CouponWrapper theme={theme} topMargin={false}>
        Test Marquee Item
      </CouponWrapper>,
    );
    const marqueeItem = screen.getByText('Test Marquee Item');
    expect(marqueeItem).not.toHaveStyle('margin-top: 22px');
  });

  it('renders CouponWrapper2', () => {
    render(
      <CouponWrapper theme={theme} topMargin={true}>
        Test Marquee Item
      </CouponWrapper>,
    );
    const marqueeItem = screen.getByText('Test Marquee Item');
    expect(marqueeItem).toHaveStyle('margin-top: 22px');
  });

  it('renders CouponWrapper3', () => {
    render(
      <CouponWrapper theme={theme} main={true}>
        Test Marquee Item
      </CouponWrapper>,
    );
    const marqueeItem = screen.getByText('Test Marquee Item');
    expect(marqueeItem).toHaveStyle(
      'background: linear-gradient(180deg, #FFFFFF 0%, #FBF8E7 100%)',
    );
  });

  it('renders CouponWrapper4', () => {
    render(
      <CouponWrapper theme={theme} main={false}>
        Test Marquee Item
      </CouponWrapper>,
    );
    const marqueeItem = screen.getByText('Test Marquee Item');
    expect(marqueeItem).toHaveStyle(
      'background: linear-gradient(180deg, #FFFFFF 0%, #D2F1F3 100%)',
    );
  });

  it('renders CouponWrapper4', () => {
    render(
      <GoBtn theme={theme} isNext={false}>
        Test Marquee Item
      </GoBtn>,
    );
    const marqueeItem = screen.getByText('Test Marquee Item');
    expect(marqueeItem).toHaveStyle('margin-left: 0');
  });

  it('renders CouponWrapper4', () => {
    render(
      <GoBtn theme={theme} isNext={true} disabled={true}>
        Test Marquee Item
      </GoBtn>,
    );
    const marqueeItem = screen.getByText('Test Marquee Item');
    expect(marqueeItem).not.toHaveStyle('margin-left: 0');
  });

  it('renders MarqueeWrapper', () => {
    render(
      <MarqueeWrapper theme={theme} scrollX={1}>
        Test Marquee Item
      </MarqueeWrapper>,
    );
    const marqueeItem = screen.getByText('Test Marquee Item');
    // expect(marqueeItem).toHaveStyle('opacity: 1');
  });

  it('renders MarqueeWrapper', () => {
    render(
      <MarqueeWrapper theme={theme} scrollX={-1}>
        Test Marquee Item
      </MarqueeWrapper>,
    );
    const marqueeItem = screen.getByText('Test Marquee Item');
    // expect(marqueeItem).not.toHaveStyle('opacity: 0');
  });
});
