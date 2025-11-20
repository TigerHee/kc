/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import Confirm from 'src/components/Premarket/containers/Confirm.js';
import { customRender } from 'src/test/setup';

describe('test Confirm', () => {
  test('test Confirm', async () => {
    customRender(<Confirm />, {
      aptp: {
        confirmInfo: {
          content: 'content',
          title: 'title',
          buttonText: 'buttonText',
          buttonAction: () => {},
          open: false,
          hideCancel: true,
        },
      },
    });
  });

  test('test Confirm with open true', async () => {
    customRender(<Confirm />, {
      aptp: {
        confirmInfo: {
          content: 'content',
          title: 'title',
          buttonText: 'buttonText',
          buttonAction: () => {},
          open: true,
        },
      },
    });
    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
  });
});
