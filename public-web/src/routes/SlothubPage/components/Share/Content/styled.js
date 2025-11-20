/*
 * Owner: harry.lai@kupotech.com
 */
import styled from '@emotion/styled';
import { px2rem } from '@kux/mui/utils';
import recordPrizeItemBg from 'static/slothub/share-record-prize-item-bg.svg';

import { CurrentUserAvatar } from '../../Avatar';

const SLOT_HUB_SHARE_UI_RADIO = 0.88;
const fitRadioPx2rem = (number) => px2rem(Math.floor(number * SLOT_HUB_SHARE_UI_RADIO * 10) / 10);
// const fitRadioPx2rem = (number)=> number + 'px'
export const Wrap = styled.div`
  overflow: hidden;
  background-color: #000;
  width: 265px;
  height: 396px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const AvatarArea = styled.section`
  display: flex;
  align-items: center;
  padding: ${fitRadioPx2rem(24)} ${fitRadioPx2rem(17)} ${fitRadioPx2rem(0)} ${fitRadioPx2rem(19.3)};
  justify-content: space-between;
`;

export const UserInfo = styled.section`
  display: flex;
  align-items: center;
`;

export const UserName = styled.p`
  color: #f3f3f3;
  font-size: ${fitRadioPx2rem(14)};
  font-weight: 600;
  margin-left: ${fitRadioPx2rem(8)};
  max-width: ${fitRadioPx2rem(110)};
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Logo = styled.img`
  height: ${fitRadioPx2rem(12)};
  margin-left: auto;
`;

export const StyledAvatar = styled(CurrentUserAvatar)`
  width: ${fitRadioPx2rem(24)};
  height: ${fitRadioPx2rem(24)};
  font-size: ${fitRadioPx2rem(12.5)};
  line-height: ${fitRadioPx2rem(24)};
`;

export const ContentWrap = styled.div`
  z-index: 2;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${fitRadioPx2rem(18)} ${fitRadioPx2rem(19.3)} 0;
`;

export const HistoryContentWrap = styled(ContentWrap)`
  padding: ${fitRadioPx2rem(18)} ${fitRadioPx2rem(20)} 0;
`;

export const RewardTitle = styled.span`
  color: #fff;
  font-size: ${fitRadioPx2rem(14)};
  font-weight: 500;
  line-height: 130%;
`;

export const RewardAndTipSubtitle = styled(RewardTitle)`
  font-size: ${fitRadioPx2rem(15)};
  margin-top: ${fitRadioPx2rem(16)};

  .highlight {
    width: 100%;
    margin-top: ${fitRadioPx2rem(6)};
    color: #d3f475;
    font-weight: 700;
    font-size: ${fitRadioPx2rem(32)};
    line-height: 130%;
    overflow-wrap: break-word;
  }
`;

export const RewardGreenContentText = styled(RewardTitle)`
  color: #d3f475;
  font-size: ${fitRadioPx2rem(32)};
  font-weight: 700;
  line-height: 130%;
  margin-top: ${fitRadioPx2rem(6)};
  width: 100%;
  overflow-wrap: break-word;
`;

export const AirdropTitle = styled(RewardTitle)`
  font-size: ${fitRadioPx2rem(20)};
  font-weight: 700;
`;

export const RecordHistoryMultiTimesTitle = styled.div`
  margin-bottom: ${fitRadioPx2rem(16)};
  margin-top: 0;
  line-height: 1;
  span {
    color: #fff;
    font-weight: 400;
    font-size: ${fitRadioPx2rem(14)};
  }
  .highlight {
    color: #d3f475;
    font-weight: 700;
    font-size: ${fitRadioPx2rem(14)};
  }
`;

export const RecordHistoryTitle = styled(RewardTitle)`
  font-size: ${fitRadioPx2rem(14)};
  font-weight: 400;
`;

export const RecordHistorySubtitle = styled(RewardAndTipSubtitle)`
  color: #d3f475;
  font-size: ${fitRadioPx2rem(14)};
  font-weight: 700;
  line-height: 130%;
  margin-bottom: ${fitRadioPx2rem(16)};
  margin-top: 0;
`;

export const TopRightEdgeIcon = styled.img`
  position: absolute;
  right: 0;
  top: ${fitRadioPx2rem(42)};
  width: ${fitRadioPx2rem(39)};
  height: ${fitRadioPx2rem(58)};
`;

export const TopLeftEdgeIcon = styled.img`
  position: absolute;
  left: 0;
  bottom: ${fitRadioPx2rem(85)};
  width: ${fitRadioPx2rem(55)};
  height: ${fitRadioPx2rem(90)};
`;

export const BottomBgIcon = styled.img`
  /* position: absolute; */
  z-index: 1;
  margin-left: auto;
  /* bottom: ${fitRadioPx2rem(0)};
  right: ${fitRadioPx2rem(0)}; */
  width: ${fitRadioPx2rem(181)};
  /* height: ${fitRadioPx2rem(158.5)}; */
`;

export const RecordCoinRewardItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 32%;
`;

export const RecordCoinRewardWrap = styled.section`
  overflow: hidden;
  height: ${({ moreThanOneRow }) => (moreThanOneRow ? ` ${fitRadioPx2rem(100)}` : 'auto')};
  position: relative;
  .row-wrap {
    display: flex;
    justify-content: ${({ moreThanTwo }) => (moreThanTwo ? `space-between` : ' flex-start')};

    margin-bottom: ${fitRadioPx2rem(8)};
  }

  .content {
    display: flex;
    flex-grow: 0;
    flex-shrink: 1;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    margin-top: ${fitRadioPx2rem(4)};

    .size {
      width: 100%;
      overflow: hidden;
      color: #d3f475;
      font-weight: 600;
      font-size: ${fitRadioPx2rem(16)};
      line-height: 130%;
      text-align: center;
    }

    .coin {
      margin-bottom: ${fitRadioPx2rem(1)};
      color: rgba(243, 243, 243, 0.6);
      font-weight: 400;
      font-size: ${fitRadioPx2rem(13)};
      line-height: 130%;
      text-align: center;
    }
  }

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: ${({ moreThanOneRow }) => (moreThanOneRow ? `block` : 'none')};
    width: 100%;
    height: ${fitRadioPx2rem(44)};
    background: linear-gradient(357deg, #000 6.3%, rgba(0, 0, 0, 0) 74.27%);
    content: '';
  }
`;

export const RecordCoinRewardImg = styled.div`
  background: url(${recordPrizeItemBg}) no-repeat;
  position: relative;
  width: ${fitRadioPx2rem(36)};
  height: ${fitRadioPx2rem(36)};
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: contain;

  .coin-img {
    width: ${fitRadioPx2rem(22.5)};
    height: ${fitRadioPx2rem(22.5)};
  }
`;

export const RecordGrayTip = styled.p`
  color: rgba(243, 243, 243, 0.4);
  font-size: ${fitRadioPx2rem(12)};
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  margin-top: ${fitRadioPx2rem(4)};
`;
