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
    background: ${(props) => props.theme.colors.overlay};
    border: 1px solid ${(props) => props.theme.colors.cover8};
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
  ${({ theme }) => theme.breakpoints.up('sm')} {
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
`;

export const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  position: absolute;
  top: 32px;
  left: 50%;
  width: 100%;
  transform: translateX(-50%) scale(1);
  transition: transform 0.2s;
  // ${({ theme }) => theme.breakpoints.up('sm')} {
  //   top: 40px;
  //   padding: 0 20px;
  // }
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
  display: flex;
  align-items: end;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
`;

export const Progress = styled.div`
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 4px 6px;
  color: #fff;
  // background: linear-gradient(90deg, rgba(211, 244, 117, 0.40) 0%, rgba(211, 244, 117, 0.10) 100%);
  background: ${(props) =>
    `linear-gradient(${
      props.isRTL ? 270 : 90
    }deg, rgba(211, 244, 117, 0.4) 0%, rgba(211, 244, 117, 0.1) 100%)`};
`;

export const ProgressLabel = styled.span`
  flex: 1;
  font-size: 12px;
  // line-height: 130%;
`;

export const DateBox = styled.div`
  color: rgba(243, 243, 243, 0.6);
  margin-left: 16px;
  font-size: 14px;
  line-height: 130%;
  font-weight: 500;
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
`;
