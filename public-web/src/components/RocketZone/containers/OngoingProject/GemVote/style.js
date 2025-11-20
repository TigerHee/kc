/*
 * @owner: borden@kupotech.com
 */
import { styled } from '@kux/mui';
import LazyImg from 'components/common/LazyImg';

export const TaskCard = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 20px;
  background: ${(props) => props.theme.colors.cover2};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    width: calc((100% - 16px) / 2);
    padding: 20px 24px;
    &:not(:nth-of-type(2n + 1)) {
      margin-left: 16px;
    }
  }
  ${({ theme }) => theme.breakpoints.up('lg')} {
    width: calc((100% - 48px) / 3);
    &:not(:nth-of-type(3n + 1)) {
      margin-left: 24px;
    }
  }
`;

export const CardBanner = styled.div`
  display: block;
  background: rgba(30, 32, 24, 0.8);
  height: 144px;
  position: relative;
  border-radius: 16px;
`;

export const CardBg = styled(LazyImg)`
  position: absolute;
  top: 0;
  left: 50%;
  width: 90%;
  height: 100%;
  transform: translateX(-50%);
  z-index: -1;
  border-radius: 16px;
  filter: blur(130px);
  will-change: filter;
`;

export const RankLogo = styled(LazyImg)`
  position: absolute;
  top: 0;
  left: 50%;
  width: 90%;
  height: 100%;
  transform: translateX(-50%);
  z-index: -1;
  border-radius: 16px;
  filter: blur(130px);
  will-change: filter;
`;

export const Mask = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 16px;
  background: rgba(30, 32, 24, 0.8);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  z-index: 1;

  .rankLogo {
    position: absolute;
    top: 0;
    right: 16px;
    z-index: 2;
    width: 40px;
    height: 40px;
  }
`;

export const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  position: absolute;
  top: ${(props) => (props?.status === 2 ? '32px' : '50%')};
  left: 50%;
  width: 100%;
  transform: translateX(-50%) ${(props) => (props?.status === 2 ? '' : 'translateY(-50%)')} scale(1);
  transition: transform 0.2s;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    &:hover {
      transform: translateX(-50%) ${(props) => (props?.status === 2 ? '' : 'translateY(-50%)')}
        scale(1.1);
    }
  }
`;

export const Logo = styled(LazyImg)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(211, 244, 117, 0.34);
`;

export const Name = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 32px;
  font-weight: 700;
  margin-left: 16px;
  color: #fff;
`;

export const BannerFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
`;

export const Progress = styled.div`
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  background: ${(props) =>
    props?.voteResult === 1
      ? `linear-gradient(${
          props.isRTL ? 270 : 90
        }deg, rgba(211, 244, 117, 0.4) 0%, rgba(211, 244, 117, 0.1) 100%)`
      : 'rgba(243, 243, 243, 0.12)'};

  .label {
    padding: 4px 6px;
    color: ${(props) => (props?.voteResult === 1 ? '#fff' : 'rgba(243, 243, 243, 0.60)')};
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
  }

  .value {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 6px;
    color: ${(props) => (props?.voteResult === 1 ? '#1d1d1d' : 'rgba(243, 243, 243, 0.60)')};
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    background: ${(props) => (props?.voteResult === 1 ? '#d3f475' : 'rgba(243, 243, 243, 0.08)')};
    border-radius: 4px;

    svg {
      width: 16px;
      height: 16px;
      margin-right: 2px;
    }
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Buttons = styled(Row)`
  display: flex;
  align-items: center;
  margin-top: 24px;
  .subscribe-btn {
    flex: 1;
    padding: 0 8px;
  }
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;

export const HighlightValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text};

  img {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
`;

export const StyledProjectItem = styled.div`
  margin-top: 24px;
  position: relative;

  .content {
    position: relative;
    z-index: 3;
    padding: 0;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    border: 1px solid ${(props) => props.theme.colors.divider8};
    border-radius: 16px;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 120px;
      border-radius: 15px 15px 0 0;
    }
    .content {
      padding: 32px 24px 24px;
    }

    &.complementary {
      .bg {
        background: linear-gradient(
          180deg,
          ${(props) => props.theme.colors.complementary8} 0%,
          ${(props) => props.theme.colors.overlay} 100%
        );
      }
    }

    &.primary {
      .bg {
        background: linear-gradient(
          180deg,
          ${(props) => props.theme.colors.primary8} 0%,
          ${(props) => props.theme.colors.overlay} 100%
        );
      }
    }

    &.grey {
      .bg {
        background: linear-gradient(
          180deg,
          ${(props) => props.theme.colors.cover4} 0%,
          ${(props) => props.theme.colors.overlay} 100%
        );
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    .content {
      padding: 32px 40px;
    }
  }
`;

export const HeaderWrapper = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 16px;

  .KuxDivider-vertical {
    margin: 0 16px;
  }

  .dateWraper {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;

    .mark {
      position: relative;
      padding: 2px 6px;
      font-weight: 500;
      font-size: 12px;
      font-style: normal;
      border-radius: 6px !important;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    font-weight: 600;
    font-size: 20px;

    .dateWraper {
      margin-top: 0;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 32px;
    font-size: 24px;
  }
`;

export const CountdownWrapper = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .timeCounter {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
    [dir='rtl'] & {
      direction: rtl; // 日期专属
    }

    .item {
      display: inline-flex;
      align-items: center;
      min-width: 16px;
      height: 16px;
      padding: 0 2px;
      color: #1d1d1d;
      font-weight: 500;
      font-size: 12px;
      font-size: 11px;
      line-height: 1;
      text-align: center;
      background: #d3f475;
      border-radius: 2px;
    }

    .split {
      display: inline-block;
      height: 16px;
      margin: 0 4px;
      color: ${(props) => props.theme.colors.icon60};
      line-height: 16px;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 13px;

    .timeCounter {
      margin-left: 10px;

      .item {
        min-width: 24px;
        height: 24px;
        font-size: 16px;
      }

      .split {
        display: inline-block;
        height: 24px;
        line-height: 24px;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: 16px;
  }
`;

export const PlaceholderText = styled.div`
  color: ${(props) => props.theme.colors.text30};
`;

export const WinWarpper = styled.div`
  display: flex;
  align-items: center;
  .label {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
  }

  .value {
    margin-left: 6px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .label {
      font-size: 16px;
    }

    .value {
      font-size: 16px;
    }
  }
`;
