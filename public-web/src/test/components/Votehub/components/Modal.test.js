/**
 * Owner: jessie@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import '@testing-library/jest-dom';
import { cleanup, fireEvent } from '@testing-library/react';
import Modal from 'src/components/Votehub/components/Modal.js';
// import { useResponsiveSize } from 'src/components/Votehub/hooks';
import { customRender } from 'src/test/setup';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(),
  useMediaQuery: jest.fn(),
}));

// jest.mock('src/components/Votehub/hooks', () => ({
//   useResponsiveSize: jest.fn(),
// }));

describe('test Modal', () => {
  afterEach(cleanup);
  test('test Modal with pc', async () => {
    // const mockUseResponsiveSize = jest.fn(() => 'lg');
    // useResponsiveSize.mockReturnValue(mockUseResponsiveSize);
    useResponsive.mockReturnValue({ sm: true });
    customRender(
      <Modal title="title" open={true}>
        Content
      </Modal>,
      {},
    );
    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
  });

  test('test Modal with h5', async () => {
    // const mockUseResponsiveSize = jest.fn(() => 'sm');
    // useResponsiveSize.mockReturnValue(mockUseResponsiveSize);
    useResponsive.mockReturnValue({ sm: false });
    customRender(
      <Modal title="title" open={true}>
        Content
      </Modal>,
      {},
    );
    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
  });
});
