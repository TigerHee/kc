/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import { customRender } from 'src/test/setup';
import TaskContent from 'TradeActivity/GemPool/containers/TaskContent.js';

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

describe('TaskContent', () => {
  it('renders TaskContent with empty', () => {
    customRender(<TaskContent list={[]} />);
  });

  it('renders TaskContent with list', () => {
    customRender(
      <TaskContent
        onClose={() => {}}
        questionId="1"
        list={[
          {
            taskType: 2,
            taskState: 0,
            bonusCoefficient: 1,
            vipLevel: 1,
          },
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
        ]}
      />,
    );

    const buttons = document.getElementsByTagName('button');
    expect(buttons[0]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
  });

  it('renders TaskContent with list 2', () => {
    customRender(
      <TaskContent
        onClose={() => {}}
        questionId="1"
        list={[
          {
            taskType: 2,
            taskState: 1,
            bonusCoefficient: 1,
            vipLevel: 0,
          },
          {
            taskType: 1,
            taskState: 1,
            bonusCoefficient: 1,
            vipLevel: 1,
          },
          {
            taskType: 0,
            taskState: 0,
            bonusCoefficient: 1,
          },
          {
            "taskName": null,
            "taskId": "67eb50c19f37cf0001095279",
            "taskState": 0,
            "bonusCoefficient": "0.00",
            inviteActivityPeopleNumber: 1,
            maxBonusCoefficient: 0.5,
            "vipLevel": 0,
            "kcsLevel": 0,
            "taskType": 3
          },
        ]}
      />,
    );

    const buttons = document.getElementsByTagName('button');
    expect(buttons[0]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
  });
});
