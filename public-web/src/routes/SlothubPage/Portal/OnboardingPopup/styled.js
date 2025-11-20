/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-11 17:33:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-28 11:08:16
 */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import CurrencyTasks from '../../IndexPage/CurrencyTasks';
import InviteBar from '../../IndexPage/UniversalTasks/InviteTask';
import UniversalTask from '../../IndexPage/UniversalTasks/UniversalTask';
import { SharedPrizeList } from '../PrizeDialog/SharedRewardContent';

export const BlurMask = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(0, 13, 29, 0.8);
  backdrop-filter: blur(8px);
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeInAnimation 0.3s 0s cubic-bezier(0.16, 0, 0.18, 1) forwards;

  @keyframes fadeInAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const TourPopupWrap = styled.div`
  position: relative;
  margin: 0 16px;
  display: flex;
  justify-content: center;
`;

export const TourPopupCard = styled.div`
  position: relative;
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  background: #d3f475;
  z-index: 999;
  width: 241px;
  min-height: 135px;

  .desc {
    margin-bottom: 14px;
    color: #1d1d1d;
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
  }
`;

export const TourButtonArea = styled.section`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-top: auto;

  .last {
    margin-right: 12px;
    color: rgba(29, 29, 29, 0.4);
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    text-align: center;
    background: transparent;
    border: 0;
    cursor: pointer;
  }
  .next {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 9px 16px;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    line-height: 130%;
    text-align: center;
    background: #1d1d1d;
    border: 0;
    border-radius: 24px;
    cursor: pointer;
  }
`;

export const CloseImg = styled.img`
  width: 32px;
  height: 32px;
  /* position: absolute;
  top: 89px;
  right: 68px; */
  margin-bottom: 24px;
  align-self: flex-end;
  cursor: pointer;

  ${(props) => props.theme.breakpoints.down('sm')} {
    /* top: 51px;
    right: 18px; */
    width: 22px;
    height: 22px;
  }
`;

export const AbsoluteH5Close = styled(CloseImg)`
  ${(props) => props.theme.breakpoints.down('sm')} {
    position: absolute;
    top: 50px;
    right: 16px;
  }
`;

export const LayoutWrap = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  ${(props) => props.theme.breakpoints.up('sm')} {
    max-width: 1270px;
  }
`;

export const StepTipTitle = styled.p`
  color: #1d1d1d;
  font-family: Roboto;
  font-size: 15px;
  font-style: italic;
  font-weight: 800;
  line-height: 130%;
  margin-bottom: 8px;
  text-align: left;
  width: 100%;
`;

export const triangleStyles = {
  topRight: css`
    &:after {
      position: absolute;
      top: -16px;
      right: 16px;
      width: 0;
      height: 0;
      border-style: solid;
      border-top: 9px solid transparent;
      border-right: 8px solid transparent; // 半个底边长度
      border-bottom: 9px solid #d3f475; // 三角形颜色
      border-left: 8px solid transparent; // 半个底边长度
      content: '';
    }
  `,
  bottomRight: css`
    &:after {
      position: absolute;
      right: 16px;
      bottom: -16px;
      width: 0;
      height: 0;
      border-style: solid;
      border-top: 9px solid #d3f475;
      border-right: 8px solid transparent; // 半个底边长度
      border-bottom: 9px solid transparent; // 三角形颜色
      border-left: 8px solid transparent; // 半个底边长度
      content: '';
    }
  `,
  left: css`
    &:before {
      position: absolute;
      top: 16px;
      left: -16px;
      width: 0;
      height: 0;
      border-style: solid;
      border-top: 8px solid transparent;
      border-right: 9px solid #d3f475;
      border-bottom: 8px solid transparent;
      border-left: 9px solid transparent;
      content: '';
    }
  `,
};

export const stepRootStyles = {
  verticalCenter: css`
    transform: translateY(-50%);
    position: relative;
    top: 50%;
    display: flex;
    flex-direction: column;
  `,

  firstStep: css`
    position: relative;
    top: 190px;
  `,
  firstStepPc: css`
    position: relative;
    top: 378px;
  `,

  secondStep: css`
    position: relative;
    top: 250px;
  `,
  secondStepPc: css`
    position: relative;
    top: 306px;
  `,

  thirdStep: css`
    position: relative;
    top: 245px;
  `,
  thirdStepPc: css`
    position: relative;
    top: 415px;
  `,

  fourthStep: css`
    position: relative;
    top: 164px;
  `,
  fourthStepPc: css`
    position: relative;
    top: 225px;
  `,
};

export const stepCardWrapStyles = {
  firstStep: css`
    position: absolute;
    bottom: -108px;
  `,
  firstStepPc: css`
    position: absolute;
    /* bottom: 0; */
  `,

  secondStep: css`
    position: absolute;
    top: 378px;
  `,
  secondStepPc: css`
    position: absolute;
    top: 306px;
  `,

  thirdStep: css`
    position: absolute;
    top: 415px;
  `,
  thirdStepPc: css`
    position: absolute;
    top: 415px;
  `,

  fourthStep: css`
    position: absolute;
    top: 225px;
  `,
  fourthStepPc: css`
    position: absolute;
    top: 225px;
  `,
};

export const stepCloseBtnStyles = {
  fourthStepPc: css`
    position: absolute;
    top: -53px;
    right: 0;
  `,

  h5AbsolutePosition: css`
    position: absolute;
    top: 89px;
    right: 68px;
  `,
};

export const stepDescCardStyles = {
  fourthStepPad: css`
    margin-right: calc(50vw - 365px);
  `,
};

export const CommonStepLayout = styled.div`
  width: 100%;
  margin: 0 auto;
  border-radius: 20px;
  background: #fff;
  position: relative;
  pointer-events: none;

  button {
    pointer-events: none;
  }
  a {
    pointer-events: none;
  }
  /* z-index: 10;
  * {
    z-index: 9;
  }
  &::after {
  } */
`;

export const SecondStepLayout = styled(CommonStepLayout)`
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 8px;
  }
`;

export const PrizeStepLayout = styled.div`
  width: 700px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  border-radius: 20px;
  padding: 16px 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
`;

export const StyledSharedPrizeList = styled(SharedPrizeList)`
  margin-top: 0;
  width: calc(100% - 12px) !important;

  ${(props) => props.theme.breakpoints.down('sm')} {
    display: block;
    width: 346px;

    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }

  .prize-item-wrap {
    background: transparent;
  }
`;

export const GestureWrap = styled.div`
  position: relative;
  z-index: 9999;
  transform: ${({ gestureDirection }) =>
    gestureDirection === 'left' ? `rotateY(180deg)` : 'unset'};
`;

export const StyledTaskList = styled(CurrencyTasks)`
  margin-top: 16px;
  padding: 0;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 16px;
    padding: 0 24px;
  }
  > .tasks-common-table {
    margin-bottom: 0 !important;

    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-bottom: 12px !important;
    }
  }
`;

export const StyledInviteBar = styled(InviteBar)`
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 0;
    padding: 8px 16px;
    background: rgba(211, 244, 117, 0.24);
    border: unset;
    border-radius: 24px;
  }
`;

export const InviteWrap = styled(CommonStepLayout)`
  padding: 0 16px 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;

export const EnhanceBarBgFill = styled.div`
  z-index: 9;
  position: relative;
  height: 36px;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(29, 29, 29, 0.08);
  border-radius: 20px;
  width: 100%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: none;
  }
`;

export const StyledUniversalTask = styled(UniversalTask)`
  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: 16px 32px 32px;
  }
`;
