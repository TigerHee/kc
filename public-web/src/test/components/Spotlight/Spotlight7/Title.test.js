/**
 * Owner: jessie@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import '@testing-library/jest-dom';
import Title from 'src/components/Spotlight/SpotlightR7/Title.js';
import { customRender } from 'src/test/setup';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(),
  useMediaQuery: jest.fn(),
}));

describe('Title', () => {
  it('renders Title in PC', () => {
    useResponsive.mockReturnValue({ sm: true, lg: true });
    customRender(<Title icon="icon" title="title" />);
  });

  it('renders Title in H5', () => {
    useResponsive.mockReturnValue({ sm: false });
    customRender(<Title icon="icon" title="title" />);
  });
});
