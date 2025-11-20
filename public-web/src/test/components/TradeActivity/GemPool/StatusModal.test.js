/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import { customRender } from 'src/test/setup';
import StatusModal from 'TradeActivity/GemPool/containers/StatusModal.js';

describe('StatusModal', () => {
  it('renders StatusModal with link empty', () => {
    customRender(<StatusModal />, {
      gempool: {
        statusModalVisible: false,
        statusModalJumpLink: undefined,
      },
    });
  });

  it('renders StatusModal with link', () => {
    customRender(<StatusModal />, {
      gempool: {
        statusModalVisible: true,
        statusModalJumpLink: '/',
      },
    });

    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
  });
});
