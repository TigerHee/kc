import React from 'react';
import '@testing-library/jest-dom';
import { useResponsive, useMediaQuery } from '@kux/mui';
import { waitFor, act, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '_tests_/test-setup';
import MuiTooltip from 'src/trade4.0/components/mui/Tooltip.js';
// import useIsMobile from 'src/trade4.0/hooks/common/useIsMobile';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'), 
  useResponsive: jest.fn(),
  useMediaQuery: jest.fn(),
}));
// jest.mock('src/trade4.0/hooks/common/useIsMobile', () => jest.fn());

describe('MuiTooltip', () => {
  it('renders Tooltip with default props', () => {
    useMediaQuery.mockReturnValue(() => false);
    useResponsive.mockReturnValue({ sm: true });
    renderWithTheme(
      <MuiTooltip open title="Test MuiTooltip Title">
        <span>Hover me</span>
      </MuiTooltip>
    );
    const wrapper = document.getElementsByClassName('kux-trade4-tooltip-root');
    const container = wrapper[wrapper.length - 1];
    expect(container).toHaveStyle('background-color: #2D2D2F');
  });

  it('renders MTooltip with default props', async () => {
    useMediaQuery.mockReturnValue(() => true);
    useResponsive.mockReturnValue({ sm: false });
    renderWithTheme(
      <MuiTooltip open title="Test MTooltip Title">
        <span id="jest-mTooltip">Click me</span>
      </MuiTooltip>
    );
    act(() => {
      fireEvent.click(document.getElementById('jest-mTooltip'));
    });

    const wrapper = document.getElementsByClassName('KuxDialog-root');
    const container = wrapper[wrapper.length - 1];
    await waitFor(() => expect(container).toBeInTheDocument());
  });
});