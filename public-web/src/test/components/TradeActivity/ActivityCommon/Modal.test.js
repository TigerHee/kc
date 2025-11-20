/**
 * Owner: jessie@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { customRender } from 'src/test/setup';
import Modal from 'TradeActivityCommon/Modal';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(),
  useMediaQuery: jest.fn(),
}));

describe('test Modal', () => {
  afterEach(cleanup);
  test('test Modal with pc', async () => {
    useResponsive.mockReturnValue({ sm: true });
    customRender(
      <Modal title="title" open={true}>
        Content
      </Modal>,
      {},
    );
  });

  test('test Modal with h5', async () => {
    useResponsive.mockReturnValue({ sm: false });
    customRender(
      <Modal title="title" open={true}>
        Content
      </Modal>,
      {},
    );
  });
});
