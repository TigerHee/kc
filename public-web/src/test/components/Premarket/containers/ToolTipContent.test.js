/**
 * Owner: jessie@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import Tooltip from 'src/components/Premarket/containers/TradeModal/ToolTipContent';
import { customRender } from 'src/test/setup';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(),
  useMediaQuery: jest.fn(),
}));

describe('Tooltip', () => {
  it('renders Tooltip with h5', () => {
    useResponsive.mockReturnValue({ sm: false });
    customRender(<Tooltip />, { aptp: { taxTips: 'ssss sac asssss saa' } });
    const svgs = document.querySelectorAll('svg');
    expect(svgs[0]).toBeInTheDocument();
    fireEvent.click(svgs[0]);
  });

  it('renders Tooltip with web', async () => {
    useResponsive.mockReturnValue({ sm: false });
    customRender(<Tooltip />, { aptp: {} });
  });
});
