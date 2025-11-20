/*
 * @owner: borden@kupotech.com
 */
import { keyframes, styled } from '@kux/mui';
import LazyImg from 'components/common/LazyImg';
import { isChrome } from 'src/utils/judgeChrome';
import SeoLink from '../../../components/SeoLink';

export const TaskCard = styled.div`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  margin-top: 16px;
  border: 0.5px solid ${(props) => props.theme.colors.cover8};
  background-color: ${(props) => props.theme.colors.overlay};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    width: calc((100% - 24px) / 2);
    margin-top: 24px;
    padding: 20px 24px;
  }
  ${({ theme }) => theme.breakpoints.up('lg')} {
    width: calc((100% - 48px) / 3);
    &:not(:nth-of-type(3n + 1)) {
      margin-left: 24px;
    }
  }
`;

export const CardBanner = styled(SeoLink)`
  display: block;
  background: #1e2018;
  height: 100px;
  position: relative;
  border-radius: 8px;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    height: 144px;
    border-radius: 12px;
    &:hover {
      .slot-taskItem-name {
        transform: translateX(-50%) scale(1.1);
      }
    }
  }
`;

export const CardBg = styled(LazyImg)`
  position: absolute;
  top: 0;
  left: 50%;
  width: 90%;
  height: 100%;
  transform: translateX(-50%);
  z-index: -1;
  border-radius: 8px;
  filter: blur(130px);
  will-change: filter;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    border-radius: 12px;
  }
`;

export const Mask = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 12px;
  background: rgba(30, 32, 24, 0.8);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  z-index: 1;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    border-radius: 8px;
  }
`;

export const BannerHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const HotAmount = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 4px;
  border-radius: 4px;
  background: rgba(243, 243, 243, 0.12);
  color: #f3f3f3;
  font-size: 12px;
  font-weight: 500;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-weight: 400;
    font-size: 13px;
  }
`;
export const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  position: absolute;
  top: 24px;
  left: 50%;
  width: 100%;
  transform: translateX(-50%) scale(1);
  transition: transform 0.2s;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    top: 40px;
    padding: 0 20px;
  }
`;

export const StatusFlag = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 2px 6px;
  border-radius: 8px 0px 4px 0px;
  font-size: 12px;
  font-weight: 500;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
  }
`;

export const Logo = styled(LazyImg)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(211, 244, 117, 0.34);
`;

export const Name = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  margin-left: 14px;
  color: #fff;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-left: 16px;
    font-size: 32px;
  }
`;

export const BannerFooter = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
`;

export const Progress = styled.div`
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 2px 6px;
  color: #fff;
  background: ${(props) =>
    `linear-gradient(${
      props.isRTL ? 270 : 90
    }deg, rgba(211, 244, 117, 0.4) 0%, rgba(211, 244, 117, 0.1) 100%)`};
`;

export const ProgressLabel = styled.span`
  flex: 1;
  font-size: 12px;
  line-height: 130%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${isChrome ? '12px' : '11px'};
    line-height: 100%;
    zoom: ${isChrome ? 0.91 : 'unset'};
  }
`;

export const Link = styled.div`
  display: flex;
  align-items: center;
  color: rgba(243, 243, 243, 0.6);
  margin-left: 16px;
  font-size: 14px;
  line-height: 130%;
  font-weight: 500;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    /* padding: 2px 0; */
    font-size: ${isChrome ? '12px' : '11px'};
    line-height: 130%;
    zoom: ${isChrome ? 0.91 : 'unset'};
  }
`;

export const DateBox = styled.div`
  color: rgba(243, 243, 243, 0.6);
  margin-left: 16px;
  font-size: 14px;
  line-height: 130%;
  font-weight: 500;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${isChrome ? '12px' : '11px'};
    line-height: 100%;
    zoom: ${isChrome ? 0.91 : 'unset'};
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Buttons = styled(Row)`
  margin-top: 24px;
  button:not(:first-of-type) {
    margin-left: 8px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-size: 14px;
  }
`;

export const Value = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: rgba(28, 28, 30, 1);
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-weight: 500;
    font-size: 14px;
  }
`;

export const HighlightValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 130%;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-weight: 700;
    font-size: 16px;
  }
`;

export const Alert = styled(Row)`
  border-radius: 4px;
  background: rgba(211, 244, 117, 0.16);
  font-size: 12px;
  line-height: 130%;
  padding: 4px 6px 4px 12px;
  margin-top: 8px;
  cursor: ${(props) => (props.exchangeAvailable ? 'pointer' : 'default')};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: 6px 6px 6px 12px;
    font-size: 14px;
  }
`;

export const AlertOpration = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 120%;
  color: ${(props) => props.theme.colors.text40};
  span {
    border-bottom: 1px dashed ${(props) => props.theme.colors.text40};
  }
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-size: 14px;
  }
`;

const steps = [
  {
    duration: 0,
    action: 'transform: rotate(0)',
  },
  {
    duration: 266,
    action: 'transform: rotate(-15deg)',
  },
  {
    duration: 133,
    action: 'transform: rotate(15deg)',
  },
  {
    duration: 133,
    action: 'transform: rotate(-12deg)',
  },
  {
    duration: 133,
    action: 'transform: rotate(12deg)',
  },
  {
    duration: 133,
    action: 'transform: rotate(-9deg)',
  },
  {
    duration: 133,
    action: 'transform: rotate(6deg)',
  },
  {
    duration: 133,
    action: 'transform: rotate(-2deg)',
  },
  {
    duration: 133,
    action: 'transform: rotate(1deg)',
  },
  {
    duration: 133,
    action: 'transform: rotate(0deg)',
  },
];

const totalDuration = steps.reduce((p, n) => {
  return p + n.duration;
}, 0);

const getShake = (isRTL) => {
  let prevDuration = 0;
  const animationStep = [];
  steps.forEach((step) => {
    prevDuration += step.duration;
    const timeRate = (prevDuration / totalDuration) * 100;
    animationStep.push(`
      ${timeRate}% {
        ${step.action}${isRTL ? ' scaleX(-1)' : ''};
      }
    `);
  });
  return keyframes`
    ${animationStep.join(' ')}
  `;
};

export const AnimateTag = styled.img`
  position: absolute;
  width: 20px;
  height: 20px;
  top: -8px;
  right: 0px;
  transform-origin: 40% 100%;
  animation-iteration-count: infinite;
  animation-duration: ${totalDuration}ms;
  animation-name: ${(props) => getShake(props.isRTL)};
  animation-timing-function: cubic-bezier(0.32, -0.1, 0.66, 0.96);
`;
