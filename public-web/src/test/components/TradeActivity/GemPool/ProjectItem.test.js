/**
 * Owner: jessie@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import { customRender } from 'src/test/setup';
import ProjectItem from 'TradeActivity/GemPool/containers/ProjectItem';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(),
  useMediaQuery: jest.fn(),
}));

describe('ProjectItem', () => {
  it('renders ProjectItem with not start', () => {
    useResponsive.mockReturnValue({ sm: true, lg: true });
    const item = {
      campaignId: 'ausd332d3guhv882dfjks9fj2jfdcurrent1', //--活动ID
      earnTokenName: 'RIO', //--挖币名称
      earnTokenLogo: '', //--logo链接
      earnTokenOverview:
        'A simple copy description to express what the content of this project is.A simple copy descript to express what the content of this project is.A simple copy description to express what the', //--活动简介
      totalReturns: '0', //--总奖励
      stakingStartTime: new Date().getTime() + 100000000, //--最早挖矿开始时间
      stakingEndTime: new Date().getTime() + 1000000000, //--挖矿结束时间
      displayStartTime: new Date().getTime() + 100000000, //--活动展示开始时间
      displayEndTime: new Date().getTime() + 1000000000, //--活动展示结束时间
      openBonusTask: 1, //--是否开启加成任务
      userBonusTaskFinish: 0, //--0表示未完成，1表示已完成
      userBonusCoefficient: '0.01', //--用户加成系数
      status: 'notStart',
      pools: [
        {
          stakingTokenLogo: '',
          stakingToken: 'BTC',
          totalStakingParticipants: 0,
          earnTokenAmount: 0,
          totalStakingAmount: 0,
          stakingStartTime: new Date().getTime() + 100000000,
          stakingEndTime: new Date().getTime() + 1000000000,
          minStakingAmount: 0.000001, //--最小质押额
          tokenScale: 8, //--质押token最小精度
          myStakingInfo: {
            stakingAmount: 0, //--我当前质押额
            claimedRewards: 0, //--获得奖励
            unclaimedRewards: '0', //待领取的奖励
          },
        },
      ],
    };
    customRender(<ProjectItem {...item} />);

    const projectCard = document.getElementsByClassName('projectCard');
    expect(projectCard[0]).toBeInTheDocument();
    fireEvent.click(projectCard[0]);
  });

  it('renders ProjectItem with in process', () => {
    const item = {
      campaignId: 'ausd332d3guhv882dfjks9fj2jfdcurrent1', //--活动ID
      earnTokenName: 'RIO', //--挖币名称
      earnTokenLogo: '', //--logo链接
      earnTokenOverview:
        'A simple copy description to express what the content of this project is.A simple copy descript to express what the content of this project is.A simple copy description to express what the', //--活动简介
      totalReturns: '0', //--总奖励
      stakingStartTime: new Date('2024-06-01 10:00:00').getTime(), //--最早挖矿开始时间
      stakingEndTime: new Date().getTime() + 100000000, //--挖矿结束时间
      displayStartTime: new Date('2024-06-10 00:00:00').getTime(), //--活动展示开始时间
      displayEndTime: new Date().getTime() + 100000000, //--活动展示结束时间
      openBonusTask: 1, //--是否开启加成任务
      userBonusTaskFinish: 0, //--0表示未完成，1表示已完成
      userBonusCoefficient: '0.01', //--用户加成系数
      status: 'inProcess',
      pools: [
        {
          stakingTokenLogo: '',
          stakingToken: 'BTC',
          totalStakingParticipants: 0,
          earnTokenAmount: 0,
          totalStakingAmount: 0,
          stakingStartTime: new Date('2024-06-10 10:00:00').getTime(),
          stakingEndTime: new Date().getTime() + 10000000,
          minStakingAmount: 0.000001, //--最小质押额
          tokenScale: 8, //--质押token最小精度
          myStakingInfo: {
            stakingAmount: 0, //--我当前质押额
            claimedRewards: 0, //--获得奖励
            unclaimedRewards: '0', //待领取的奖励
          },
        },
        {
          stakingTokenLogo: '',
          stakingToken: 'BTC',
          totalStakingParticipants: 0,
          earnTokenAmount: 0,
          totalStakingAmount: 0,
          stakingStartTime: new Date('2024-06-10 10:00:00').getTime(),
          stakingEndTime: new Date().getTime() + 10000000,
          minStakingAmount: 0.000001, //--最小质押额
          tokenScale: 8, //--质押token最小精度
          myStakingInfo: {
            stakingAmount: 0, //--我当前质押额
            claimedRewards: 0, //--获得奖励
            unclaimedRewards: '0', //待领取的奖励
          },
        },
        {
          stakingTokenLogo: '',
          stakingToken: 'BTC',
          totalStakingParticipants: 0,
          earnTokenAmount: 0,
          totalStakingAmount: 0,
          stakingStartTime: new Date('2024-06-10 10:00:00').getTime(),
          stakingEndTime: new Date().getTime() + 10000000,
          minStakingAmount: 0.000001, //--最小质押额
          tokenScale: 1, //--质押token最小精度
          myStakingInfo: {
            stakingAmount: 0, //--我当前质押额
            claimedRewards: 0, //--获得奖励
            unclaimedRewards: '0', //待领取的奖励
          },
        },
      ],
    };
    customRender(<ProjectItem {...item} />);
  });

  it('renders ProjectItem with complete', () => {
    useResponsive.mockReturnValue({ sm: true, lg: true });
    const item = {
      campaignId: 'ausd332d3guhv882dfjks9fj2jfdcurrent1', //--活动ID
      earnTokenName: 'RIO', //--挖币名称
      earnTokenLogo: '', //--logo链接
      earnTokenOverview:
        'A simple copy description to express what the content of this project is.A simple copy descript to express what the content of this project is.A simple copy description to express what the', //--活动简介
      totalReturns: '0', //--总奖励
      stakingStartTime: new Date('2024-01-20 10:00:00').getTime(), //--最早挖矿开始时间
      stakingEndTime: new Date('2024-01-31 00:00:00').getTime(), //--挖矿结束时间
      displayStartTime: new Date('2024-01-20 00:00:00').getTime(), //--活动展示开始时间
      displayEndTime: new Date('2024-01-31 00:00:00').getTime(), //--活动展示结束时间
      openBonusTask: 1, //--是否开启加成任务
      userBonusTaskFinish: 0, //--0表示未完成，1表示已完成
      userBonusCoefficient: '0.01', //--用户加成系数
      status: 'completed',
      pools: [
        {
          stakingTokenLogo: '',
          stakingToken: 'BTC',
          totalStakingParticipants: 0,
          earnTokenAmount: 0,
          totalStakingAmount: 0,
          stakingStartTime: new Date('2024-01-20 10:00:00').getTime(),
          stakingEndtime: new Date('2024-01-31 00:00:00').getTime(),
          minStakingAmount: 0.000001, //--最小质押额
          tokenScale: 1, //--质押token最小精度
          myStakingInfo: {
            stakingAmount: 0, //--我当前质押额
            claimedRewards: 0, //--获得奖励
            unclaimedRewards: '0', //待领取的奖励
          },
        },
      ],
    };
    useResponsive.mockReturnValue({ sm: false, lg: false });
    customRender(<ProjectItem {...item} />);
  });
});
