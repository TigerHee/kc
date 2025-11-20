/**
 * Owner: jessie@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import '@testing-library/jest-dom';
import { act, fireEvent } from '@testing-library/react';
import Tooltip from 'src/components/Premarket/components/Tooltip.js';
import { customRender } from 'src/test/setup';
import isMobile from 'src/utils/isMobile';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(),
  useMediaQuery: jest.fn(),
}));

jest.mock('src/utils/isMobile', () => jest.fn());

describe('Tooltip', () => {
  it('renders Tooltip with h5', () => {
    useResponsive.mockReturnValue({ sm: false });
    const mockIsMobile = jest.fn(() => true);
    isMobile.mockReturnValue(true);
    customRender(
      <Tooltip title="Test Tooltip Title" header="header">
        <span id="test_children">Hover me</span>
      </Tooltip>,
    );

    const children = document.getElementById('test_children');
    expect(children).toBeInTheDocument();
    fireEvent.click(children);

    act(() => {
      jest.advanceTimersByTime(1000);
      const buttons = document.querySelectorAll('button');
      expect(buttons[0]).toBeInTheDocument();
      fireEvent.click(buttons[0]);
    });

    useResponsive.mockReturnValue({ sm: false });
    customRender(
      <Tooltip title="Test Tooltip Title" disabledOnMobile={true}>
        <span>Hover me</span>
      </Tooltip>,
    );
  });

  it('renders Tooltip with web', async () => {
    useResponsive.mockReturnValue({ sm: true });
    customRender(
      <Tooltip open title="Test Tooltip Title">
        <span id="jest-mTooltip">Click me</span>
      </Tooltip>,
    );
    act(() => {
      fireEvent.click(document.getElementById('jest-mTooltip'));
    });
  });
});
