/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import { customRender } from 'src/test/setup';
import TaskModal from 'TradeActivity/GemPool/containers/TaskModal.js';

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

describe('TaskModal', () => {
  it('renders TaskModal with empty', () => {
    customRender(<TaskModal />, {
      gempool: {
        bonusTaskList: [],
        taskModal: false,
      },
    });
  });

  it('renders TaskModal with list', () => {
    customRender(<TaskModal />, {
      gempool: {
        bonusTaskList: [
          {
            taskType: 1,
            taskState: 0,
            bonusCoefficient: 1,
            vipLevel: 1,
          },
          {
            taskType: 0,
            taskState: 0,
            bonusCoefficient: 1,
          },
        ],
        taskModal: true,
      },
    });

    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
  });
});
