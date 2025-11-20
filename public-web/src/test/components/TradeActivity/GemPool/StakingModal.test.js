/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { customRender } from 'src/test/setup';
import StakingModal from 'TradeActivity/GemPool/containers/StakingModal.js';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),

  useDispatch: jest.fn(),
}));

describe('StakingModal', () => {
  it('renders StakingModal', () => {
    const { getByText } = customRender(<StakingModal />, {
      currency: {
        currency: 'USD',
      },
      gempool: {
        poolInfo: {
          campaignId: '11',
          earnTokenName: 'BTC',
          poolId: 'ss',
          stakingToken: 'KCS',
          stakingTokenLogo: '',
          minStakingAmount: '0.001',
          status: 'notStart',
          tokenScale: 4,
        },
        bonusTaskList: [
          {
            taskType: 2,
            taskState: 1,
            bonusCoefficient: 1,
            vipLevel: 0,
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
        ],
        stakeModal: true,
        taskShowVisible: true,
        kcsAvailable: '100',
      },
      user_assets: {
        tradeMap: {
          BTC: {
            availableBalance: '100',
          },
          KCS: {
            availableBalance: '100',
          },
        },
      },
      market: { records: [{ code: 'BTC-USDT' }, { code: 'KCS-USDT' }] },
    });

    expect(getByText('dfdce9d75b6b4000a782')).toBeInTheDocument();

    const inputs = document.querySelectorAll('input');
    expect(inputs[0]).toBeInTheDocument();
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.blur(inputs[0]);
    fireEvent.change(inputs[0], { target: { value: '' } });
    fireEvent.blur(inputs[0]);
    fireEvent.change(inputs[0], { target: { value: '120' } });
    fireEvent.blur(inputs[0]);
    fireEvent.change(inputs[0], { target: { value: '0.0001' } });
    fireEvent.blur(inputs[0]);
    fireEvent.click(inputs[0]);

    expect(inputs[1]).toBeInTheDocument();
    fireEvent.change(inputs[1], { target: { value: '1' } });
    fireEvent.blur(inputs[1]);
    fireEvent.change(inputs[1], { target: { value: '' } });
    fireEvent.blur(inputs[1]);
    fireEvent.change(inputs[1], { target: { value: '120' } });
    fireEvent.blur(inputs[1]);
    fireEvent.change(inputs[1], { target: { value: '0.0001' } });
    fireEvent.blur(inputs[1]);
    fireEvent.click(inputs[1]);

    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    expect(buttons[2]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
  });

  it('renders StakingModal with detail', () => {
    useDispatch.mockReturnValue(jest.fn());

    customRender(<StakingModal type="detail" />, {
      currency: {
        currency: 'USD',
      },
      gempool: {
        kcsAvailable: '100',
        poolInfo: {},

        bonusTaskList: [
          {
            taskType: 2,
            taskState: 1,
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
        ],
        stakeModal: true,
      },
      user_assets: {
        tradeMap: {},
      },
      market: { records: [{ code: 'BTC-USDT' }, { code: 'KCS-USDT' }] },
    });

    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    const close = document.getElementsByClassName('KuxModalHeader-close');
    expect(close[0]).toBeInTheDocument();
    fireEvent.click(close[0]);
  });
});
