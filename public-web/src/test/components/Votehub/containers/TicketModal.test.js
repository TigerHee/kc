/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import TicketModal from 'src/components/Votehub/containers/components/TicketModal/index.js';
import { customRender } from 'src/test/setup';

jest.mock('@kux/mui', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@kux/mui'),
    useSnackbar: () => {
      return {
        message: {
          success: () => {},
        },
      };
    },
  };
});

describe('test TicketModal', () => {
  test('test TicketModal', async () => {
    customRender(<TicketModal />, {
      votehub: { ticketModal: false, detailInfo: {}, remainingVotesNum: '10', votesNum: '100' },
    });
  });
  test('test TicketModal with zero votesNum', async () => {
    customRender(<TicketModal />, {
      votehub: { ticketModal: true, remainingVotesNum: '10', votesNum: '0' },
    });
    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    expect(buttons[2]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
  });
  test('test TicketModal with zero remainingVotesNum', async () => {
    customRender(<TicketModal />, {
      votehub: { ticketModal: true, remainingVotesNum: '0', votesNum: '10' },
    });
    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    expect(buttons[2]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
  });
  test('test TicketModal with zero remainingVotesNum', async () => {
    customRender(<TicketModal />, {
      votehub: { ticketModal: true, remainingVotesNum: '0', votesNum: '0' },
    });
    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    expect(buttons[2]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
  });
  test('test TicketModal', async () => {
    customRender(<TicketModal />, {
      votehub: { ticketModal: true, detailInfo: {}, remainingVotesNum: '10', votesNum: '100' },
    });
    // 按钮点击
    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    expect(buttons[2]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);

    // 文本框输入
    const input = document.querySelector('input');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(buttons[2]);
    fireEvent.change(input, { target: { value: '12' } });
    fireEvent.click(buttons[2]);
  });
});
