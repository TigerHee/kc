/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import ROUND_PIC from 'assets/prediction/round-pic.png';
import { THEME_COLOR } from '../config';
import '../Banner/index.less';

const getChangeRateColor = changeRate => (changeRate < 0 ? '#ED6666' : '#21C397');

const getDotSize = isActive => (isActive ? '10px' : '6px');
// --- 样式 start ---
export const Index = styled.section`
  width: 100%;
  flex: auto;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${px2rem(15)};
  @media (min-width: 1040px) {
    margin-bottom: 15px;
  }
`;

export const Font = styled.span`
  font-size: ${px2rem(14)};
  line-height: ${px2rem(22)};
  color: rgba(0, 20, 42, 0.3);
`;

export const CarouselWrapper = styled.div`
  width: 100%;
  min-height: ${px2rem(220)};
  .customSlider {
    width: 100%;
    min-height: ${px2rem(220)};
    position: relative;
  }
  .slick-slide[aria-hidden='true'] {
    opacity: 0.6;
  }
  .slick-current[aria-hidden='true'] {
    opacity: 1;
  }
  .slick-prev {
    left: 0;
    z-index: 2;
    top: 0px;
  }
  .slick-next {
    right: 0;
    z-index: 2;
    top: 0px;
  }
  @media (min-width: 1040px) {
    .slick-prev {
      top: 0px;
    }
    .slick-next {
      top: 0px;
    }
  }
`;

export const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FlexSpaceBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const NoDataWrapper = styled(FlexCenter)`
  height: ${px2rem(263)};
  text-align: center;
  border: 1px solid #00142a;
  border-bottom: 4px solid #00142a;
  border-radius: ${px2rem(12)};
  margin: 0 ${px2rem(12)};
  flex-direction: column;
  img {
    width: ${px2rem(100)};
  }
`;

export const MarketInfo = styled.div`
  padding: ${px2rem(12)} ${px2rem(24)};
`;

export const SymbolBar = styled.div`
  font-size: ${px2rem(12)};
  color: #00142a;
  width: max-content;
  .btc-title {
    font-weight: 500;
  }
`;
export const RealTimeText = styled.span`
  color: rgba(0, 20, 42, 0.4);
  margin-left: ${px2rem(6)};
`;
export const ChangeRateText = styled.span`
  color: ${props => getChangeRateColor(props.changeRate)};
  margin-left: ${px2rem(6)};
`;
export const Price = styled.span`
  font-size: ${px2rem(30)};
  font-weight: 900;
  line-height: ${px2rem(46)};
  color: ${props => getChangeRateColor(props.changeRate)};
  position: relative;
  ::after {
    content: '';
    width: 100%;
    height: 2px;
    position: absolute;
    bottom: ${px2rem(2)};
    left: 0;
    border-bottom: dotted 2px rgba(0, 20, 42, 0.3);
  }
`;
export const ScheduleHeader = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
`;
export const ScheduleDots = styled(FlexCenter)`
  padding: ${px2rem(12)} ${px2rem(24)};
`;
export const ScheduleDotItem = styled.img`
  margin: ${px2rem(4)};
  width: ${props => getDotSize(props.isActive)};
  height: ${props => getDotSize(props.isActive)};
`;

export const SlideContentIndex = styled.section`
  width: 100%;
  min-height: ${px2rem(243)};
  padding: 0 2px;
  padding-right: 12px;
  .endWrapper,
  .noStartWrapper {
    padding: ${px2rem(12)} ${px2rem(24)};
  }
  .end {
    .opt {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${px2rem(12)};
      line-height: ${px2rem(12)};
      color: rgba(0, 20, 42, 0.6);
      text-align: right;
      img {
        width: ${px2rem(20)};
        height: ${px2rem(8)};
        margin-left: ${px2rem(4)};
      }
      @media (min-width: 1040px) {
        cursor: pointer;
      }
    }
  }
  .gray {
    font-weight: normal;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(12)};
    color: rgba(0, 20, 42, 0.4);
  }
  .orange {
    color: #fff48f;
  }
`;

export const Content = styled(FlexCenter)`
  flex-direction: column;
  width: 100%;
  border: 1px solid #00142a;
  border-bottom: 4px solid #00142a;
  border-radius: ${px2rem(12)};
  overflow: hidden;
  .inProcessingWrapper {
    justify-content: flex-start;
    .prizePool{
      margin-left: 72px;
    }
  }
`;

export const Header = styled(FlexSpaceBetween)`
  width: 100%;
  padding: ${px2rem(6)} ${px2rem(12)};
  height: ${px2rem(54)};
  background: ${props => props.showGreenBg ?  THEME_COLOR.notStartHeaderBg : THEME_COLOR.endHeaderBg};
`;

export const BodyWrapper = styled(FlexCenter)`
  width: 100%;
  flex-direction: column;
  min-height: ${px2rem(220)};
`;

export const ResultItem = styled.div`
  width: 100%;
  height: ${px2rem(42)};
  display: flex;
  background: #f9faff;
  border-radius: ${px2rem(8)};
  margin-top: ${px2rem(8)};
  .resultIcon {
    border-radius: ${px2rem(8)};
  }
`;

export const ResultIcon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${px2rem(42)};
  margin-right: 4px;
  img {
    width: ${px2rem(42)};
    height: ${px2rem(42)};
  }
`;
export const ResultContent = styled.div`
  flex: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 8px;
`;
export const ResultLabel = styled.div`
  .result-text {
    font-weight: 700;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(20)};
    color: rgba(0, 20, 42, 0.6);
    width: max-content;
    max-width: ${px2rem(130)};
    .smallText {
      font-weight: normal;
      color: rgba(0, 20, 42, 0.4);
    }
  }
  .result-text  > span {
    width: 100%;
    display: inline-block;
  }
  .result-round {
    font-style: italic;
    font-weight: 600;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(10)};
    color: ${THEME_COLOR.primary};
  }
`;

export const ResultText = styled(FlexCenter)`
  font-weight: 800;
  height: 100%;
  font-size: ${px2rem(16)};
  color: ${THEME_COLOR.primary};
  text-align: right;
  flex-direction: column;
}
`;

export const TimeTip = styled.div`
  margin: ${px2rem(16)} 0 ${px2rem(6)} 0;
  font-weight: 400;
  font-size: ${px2rem(12)};
  line-height: ${px2rem(20)};
  color: #00142a;
`;

export const ProcessTip = styled.div`
  width: 100%;
  background: url(${ROUND_PIC}) top left / ${px2rem(109)}  ${px2rem(63)}   no-repeat ;
  padding: ${px2rem(12)} ${px2rem(24)};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  font-weight: 400;
  .prizePoolWrapper {
    display: flex;
    justify-content: end;
    width: calc(100% - ${px2rem(110)});
  }
  .processTipText {
    font-size: ${px2rem(12)};
    line-height: ${px2rem(20)};
    text-align: right;
    width: calc(100% - ${px2rem(80)});
    color: rgba(0, 20, 42, 0.4);
    span:not(.highlight) {
      display: inline-block;
      width: 100%;
    }
    span.highlight {
      color: rgba(0, 20, 42, 0.6);
      margin: 0 ${px2rem(2)};
    }
  }
`;

export const Img = styled.img`
  margin-left: ${px2rem(6)};
`;

export const InputWrapper = styled.div`
  width: 100%;
  padding: ${px2rem(24)};
  padding-top: ${px2rem(12)};
  button.submit {
    width: 100%;
    margin-top: ${px2rem(12)};
    border-radius: ${px2rem(40)};
    font-weight: 500;
    word-break: keep-all;
  }
  .inputContainer {
    padding: 0 ${px2rem(24)};
    background: rgba(0, 20, 42, 0.04);
    border: 1px solid rgba(0, 20, 42, 0.04);
    border-radius: ${px2rem(40)};
    box-shadow: ${({isFocus})=> isFocus ?  `${THEME_COLOR.primary} 0 0 0 1px !important`: 'none !important'} ;
    input {
      caret-color: ${THEME_COLOR.primary};
      text-align: center;
      ::input-placeholder {
        text-align: center;
        color: rgba(0, 20, 42, 0.4);
      }
      ::-webkit-input-placeholder {
        text-align: center;
        color: rgba(0, 20, 42, 0.4);
      }
      ::-ms-input-placeholder {
        text-align: center;
        color: rgba(0, 20, 42, 0.4);
      }
    }
  }
`;

export const CountDown = styled(FlexCenter)`
  font-weight: 900;
  font-size: ${px2rem(24)};
`;

export const TimeNumber = styled.div`
  min-width: ${px2rem(50)};
  height: ${px2rem(70)};
  margin: 0 ${px2rem(8)};
  display: flex;
  flex-direction: column;
  bottom: 0%;
  border-radius: 4px;
  border: 1px solid ${THEME_COLOR.notStartCountDownBg};
  .time {
    flex: 2;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    position: relative;
    font-size: ${px2rem(24)};
  }
  .textTime {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: normal;
    font-weight: 600;
    font-size: ${px2rem(12)};
    background: ${THEME_COLOR.notStartCountDownBg};
    border-radius: 0 0 4px 4px;
  }
`;

export const StatusWrapper = styled.section`
  div.statusTitle,
  div.status-text {
    padding: 0;
    margin: 0;
    font-weight: 500;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(16)};
  }
  .statusTitle {
    color: ${props => (props.isActive ? '#fff' : 'rgba(0, 20, 42, 0.6)')};
  }
  .num {
    font-style: italic;
    display: inline-block;
    margin: ${px2rem(2)};
    font-weight: 800;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(16)};
    color: ${props => (props.isActive ? '#FFF48F' : 'rgba(0, 20, 42, 1)')};
  }
  div.status-text {
    font-weight: 400;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(16)};
    color: ${props => (props.isActive ? '#FFF48F' : '#F89F1A')};
  }
  img.processTip {
    display: inline-block;
    width: ${px2rem(12)};
    height: ${px2rem(12)};
    margin-bottom: ${px2rem(2)};
    margin-left: ${px2rem(4)};
    @media (min-width: 1040px) {
      cursor: pointer;
    }
  }
`;

export const PrizePoolDiv = styled.div`
  padding: 0 ${px2rem(2)};
  font-weight: 400;
  font-size: ${px2rem(14)};
  line-height: ${px2rem(24)};
  position: relative;
  z-index: 2;
  .nowPrize {
    color: #00142a;
  }
  .highlight {
    display: inline-block;
    position: relative;
    z-index: 2;
    font-weight: 600;
    font-style: italic;
    font-size: ${px2rem(16)};
    font-size: ${px2rem(24)};
    color: ${THEME_COLOR.primary};
    font-family: Roboto;
    z-index: 1;
    .normal {
      font-family: Roboto, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei';
      display: inline-block;
      font-weight: 400;
      font-size: ${px2rem(14)};
      line-height: ${px2rem(18)};
      color: #00142a;
      margin-left: ${px2rem(2)};
    }
    &::after {
      content: '';
      position: absolute;
      z-index: -1;
      bottom: ${px2rem(2)};
      left: 0;
      width: calc(100%);
      height: 50%;
      background: ${THEME_COLOR.highLightBg};
    }
  }

`;

export const NotStartTip = styled.div`
  min-width: ${px2rem(100)};
  text-align: right;
`;

export const RoundCountDown = styled.div`
  min-width: ${px2rem(100)};
  text-align: right;
  .roundCountDown {
    font-weight: 400;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(16)};
    color: #fff;
    span.time {
      display: inline-block;
      margin: 0 ${px2rem(4)};
      font-weight: 600;
      font-size: ${px2rem(10)};
      line-height: ${px2rem(16)};
      color: ${THEME_COLOR.primary};
      padding: 0 ${px2rem(2)};
      border-radius: 3px;
      background: #ffffff;
    }
    span.time:last-of-type {
      margin-right: 0;
    }
  }
`;

export const ProcessHeader = styled.div`
  width: 100%;
  padding: ${px2rem(6)} ${px2rem(12)};
  height: ${px2rem(54)};
  background: ${THEME_COLOR.processHeaderBg};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const ProcessStatusWrapper = styled(FlexSpaceBetween)`
  .statusTitle {
    padding: 0;
    margin: 0;
    font-weight: 500;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(12)};
    color: #fff;
  }
  .num {
    font-style: italic;
    display: inline-block;
    margin: ${px2rem(2)};
    font-weight: 800;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(16)};
    color: #f8ed8b;
  }
  img.processTip {
    display: inline-block;
    width: ${px2rem(12)};
    height: ${px2rem(12)};
    margin-bottom: ${px2rem(2)};
    margin-left: ${px2rem(4)};
    @media (min-width: 1040px) {
      cursor: pointer;
    }
  }
  .status-text{
    font-weight: 400;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(14)};
    color: #fff48f;
  }
  .left_box {
    margin-top: -2px;
  }
`;

export const ProcessStatusTip = styled(FlexSpaceBetween)`
  div.status-text {
    font-weight: 400;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(16)};
    color: #fff48f;
  }
`;

export const Text = styled.div`
  font-weight: 400;
  font-size: ${px2rem(12)};
  line-height: ${px2rem(16)};
  color: rgba(255, 255, 255, 0.6);
  text-align: right;
`;
// --- 样式 end ---
