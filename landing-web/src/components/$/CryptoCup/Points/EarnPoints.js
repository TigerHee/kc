/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector, useDispatch } from 'dva';
import { _t, _tHTML } from 'src/utils/lang';
import { styled, keyframes, css } from '@kufox/mui/emotion';
import { debounce } from 'lodash';
import { openPage } from 'src/helper';
import { useIsMobile } from 'src/components/Responsive';
import light from 'assets/cryptoCup/light.svg';
import earnpoints1 from 'assets/cryptoCup/earnpoints1.png';
import rightArrow from 'assets/cryptoCup/right-arrow.svg';
import earnpoints2 from 'assets/cryptoCup/earnpoints2.png';
import earnpoints3 from 'assets/cryptoCup/earnpoints3.png';
import AntiDuplication from 'components/common/AntiDuplication';

import BlockTitle from '../common/BlockTitle';
import useInviteLink from '../hooks/useInviteLink';
import useGetTimeInfo from '../hooks/useGetTimeInfo';
import LineProgress from '../common/LineProgress';
import { GreenBorderBox, CupMain, BlockAnchor } from '../common/StyledComps';
import { cryptoCupTrackClick, cryptoCupExpose, TRADE_URL, isLongTextLang, getPlatformUrlKey } from '../config';
import Toast from '../common/Toast';

const moveAnimation = keyframes`
  0% {
    transform: translate(0px, 0px);
  }

  50% {
    transform: translate(0px, 4px);
  }

  100% {
    transform: translate(0px, 0px);
  }
`;

const BtnTip = styled.div`
  font-weight: 500;
  font-size: 10px;
  height: 16px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  position: absolute;
  top: -14px;
  left: 8px;
  color: #9e6b2e;
  background: #fff469;
  border-radius: 12px;
  border-bottom-left-radius: unset;
  animation: ${css`
    ${moveAnimation} 1.5s linear infinite 1s;
  `};
`;

const Wrapper = styled.div`
  margin-top: 24px;
  width: 100%;
  position: relative;
`;

const Main = styled(GreenBorderBox)`
  margin: 16px auto 24px;
  display: flex;
  padding-left: 0;
  padding-right: 0;
  flex-direction: column;
`;

const TipLine = styled.div`
  font-weight: 500;
  font-size: 12px;
  width: 220px;
  width: max-content;
  max-width: 100%;
  /* min-height: 22px; */
  line-height: 16px;
  display: flex;
  align-items: center;
  /* text-transform: uppercase; */
  color: #2dc985;
  background: #f2fff5;
  border-radius: 90px;
  padding: 3px 8px;
  margin: 0 0 18px 0;

  &::before {
    display: block;
    content: '';
    width: 17px;
    height: 17px;
    background: ${props => `url(${light}) no-repeat`};
    background-size: 100% 100%;
    margin: 0 3px 0 0;
  }
`;

const Block = styled.div`
  margin: 0 0 6px;
  display: flex;
  padding: 7px 12px;
  background: ${props => (props.light ? ' #F4FFFD;' : 'unset;')};
  align-items: center;
`;

const IconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => `url(${props.url}) #f6fffb no-repeat`};
  background-size: 20px 20px;
  background-position: center;
`;

const MidWrap = styled.div`
  margin: 0 0 0 8px;
  width: 188px;
`;

const MidWrapTitle = styled.div`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  margin: 0 0 6px;
  /* text-transform: uppercase; */
  color: #000d1d;
`;

const MidWrapDesc = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  width: 160px;
  /* text-transform: uppercase; */
  color: rgba(0, 13, 29, 0.3);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-box-orient: vertical;
  -webkit-box-orient: vertical;
`;

const RightWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  width: 75px;
  align-items: center;
`;

const Btn = styled.div`
  cursor: pointer;
  position: relative;
  background: linear-gradient(270deg, #6af0b8 0%, #8afcbd 100%);
  border-radius: 40px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  width: 70px;
  font-size: 12px;
  height: 28px;
  align-items: center;
  display: flex;
  opacity: ${props => (props.grayed ? '0.5;' : 'unset')};
  text-align: right;
`;

const BtnText = styled.div`
  flex: 1;
  line-height: ${props => (props.isSmall ? '10px' : 'unset')};
  /* line-height: 10px; */
  margin-right: 4px;
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
  font-size: ${props => (props.isSmall ? '10px' : '12px')};
  word-break: break-word;
  text-align: center;
`;

const BtnIcon = styled.div`
  display: block;
  content: '';
  width: 6px;
  height: 10px;
  background: ${props => `url(${rightArrow}) no-repeat`};
  background-size: 100% 100%;
  /* margin: 0 0 0 2px; */
`;

const BtnDesc = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  text-transform: uppercase;
  margin: 7px 0 4px;
  color: rgba(0, 20, 42, 0.4);
  > span > span {
    color: rgba(45, 201, 133, 1);
  }
`;

let earnPointsTimer = null;
function EarnPoints() {
  const dispatch = useDispatch();
  const { inviteLink } = useInviteLink();
  const { scoreData } = useSelector(state => state.cryptoCup);
  const { status } = useGetTimeInfo();
  const isInApp = useSelector(state => state.app.isInApp);
  const currentLang = useSelector(state => state.app.currentLang);
  const isMobile = useIsMobile();
  const platform = getPlatformUrlKey(isInApp, isMobile);
  useEffect(() => {
    cryptoCupExpose(['invite', '1']);
    cryptoCupExpose(['trade', '1']);
    cryptoCupExpose(['position', '1']);
  }, []);

  // 轮询积分情况
  useEffect(
    () => {
      if (status === 2) {
        dispatch({
          type: 'cryptoCup/getMyScore',
        });

        earnPointsTimer = window.setInterval(() => {
          dispatch({
            type: 'cryptoCup/getMyScore',
          });
        }, 1000 * 60 * 10);
      } else {
        earnPointsTimer && window.clearInterval(earnPointsTimer);
      }

      return () => {
        earnPointsTimer && window.clearInterval(earnPointsTimer);
      };
    },
    [status, dispatch],
  );

  const grayed = status !== 2;

  const handleSup = useCallback(
    debounce(
      () => {
        cryptoCupTrackClick(['invite', '1']);
        if (status <= 1) {
          Toast(_t('mj1CfDuzkgzgThA47EbqT1'));
          return;
        }
        dispatch({
          type: 'cryptoCup/update',
          payload: { innviteModalVisible: true },
        });
      },
      500,
      {
        leading: true,
        trailing: false,
      },
    ),
    [],
  );

  // 3个端的链接，都是去现货交易页面
  const handleTradeNow = useCallback(
    debounce(
      trackClickOpt => {
        if (trackClickOpt) {
          cryptoCupTrackClick(trackClickOpt);
        }

        const url = TRADE_URL[platform];
        if (url) {
          openPage(isInApp, url);
        }
      },
      500,
      {
        leading: true,
        trailing: false,
      },
    ),
    [],
  );

  const isSmall = isLongTextLang.includes(currentLang);

  return (
    <Wrapper id="CryptoCup-EarnPoints">
      <BlockAnchor id="CryptoCup-EarnPoints-Anchor" isInApp={isInApp} />
      <BlockTitle name={_t('np3cLQoPwgxGGMU9ZHfaqv')} />
      <Main>
        <CupMain>
          <TipLine>{_t('ni54pm1AUe28Tk7ZBaBCBq')}</TipLine>
        </CupMain>
        <Block light>
          <IconWrap url={earnpoints1} />
          <MidWrap>
            <MidWrapTitle>{_t('bugmx3wh1XjwUg6EDQ5LJ4', { num: 50 })}</MidWrapTitle>
            <MidWrapDesc>{_t('rvbHdQtgWQ8Jzvsi7px8SF', { num: 500 })}</MidWrapDesc>
          </MidWrap>
          <RightWrap>
            <CopyToClipboard text={inviteLink}>
              <Btn
                grayed={grayed}
                onClick={() => {
                  handleSup();
                }}
              >
                {/* <BtnText isSmall={isSmall}>{_t('aXatCiUQopNVMoKz88FfpX')}</BtnText> */}
                <BtnText isSmall={isSmall}>{_t('3zihrJMMYBSxEfXjcNMPk2')}</BtnText>
                <BtnIcon />
                <>{!grayed && <BtnTip>{_t('6Me9esaicZgo9mucJUUmhR')}</BtnTip>}</>
              </Btn>
            </CopyToClipboard>
            <BtnDesc>
              {_tHTML('49zJiA7X2viz4oVehfkVUy', {
                num: scoreData?.todayInvitationPoint || 0,
                total: 500,
              })}
            </BtnDesc>
            <LineProgress percent={((scoreData?.todayInvitationPoint || 0) / 500) * 100} />
          </RightWrap>
        </Block>
        <Block>
          <IconWrap url={earnpoints2} />
          <MidWrap>
            <MidWrapTitle>{_t('n6PW9VkXU9NYu1xHGN2oa6')}</MidWrapTitle>
            <MidWrapDesc>{_t('iFbJeey3RD9pHHu9QDVVzr', { num1: 1000, num2: 10 })}</MidWrapDesc>
          </MidWrap>
          <RightWrap>
            <AntiDuplication>
              <Btn
                grayed={grayed}
                onClick={() => {
                  handleTradeNow(['trade', '1']);
                }}
              >
                <BtnText isSmall={isSmall}>{_t('nDkjUexonRucu2HD48SgAZ')}</BtnText>
                <BtnIcon />
              </Btn>
            </AntiDuplication>
            <BtnDesc>
              {_tHTML('49zJiA7X2viz4oVehfkVUy', {
                num: scoreData?.todayTradePoint || 0,
                total: 1000,
              })}
            </BtnDesc>
            <LineProgress percent={((scoreData?.todayTradePoint || 0) / 1000) * 100} />
          </RightWrap>
        </Block>
        <Block>
          <IconWrap url={earnpoints3} />
          <MidWrap>
            <MidWrapTitle>{_t('1QaDfyGuEDN6nUDAFgCZ5C')}</MidWrapTitle>
            <MidWrapDesc>{_t('h2G7fDDyefcP6rpp9KWXYc', { num: 500, time: '23:59' })}</MidWrapDesc>
          </MidWrap>
          <RightWrap>
            <AntiDuplication>
              <Btn
                grayed={grayed}
                onClick={() => {
                  handleTradeNow(['position', '1']);
                }}
              >
                <BtnText isSmall={isSmall}>{_t('gu3Z1vWnzW7exg2hG6XtBr')}</BtnText>
                <BtnIcon />
              </Btn>
            </AntiDuplication>
            <BtnDesc>
              {_tHTML('49zJiA7X2viz4oVehfkVUy', {
                num: scoreData?.todayDepositPoint || 0,
                total: 500,
              })}
            </BtnDesc>
            <LineProgress percent={((scoreData?.todayDepositPoint || 0) / 500) * 100} />
          </RightWrap>
        </Block>
      </Main>
    </Wrapper>
  );
}

export default EarnPoints;
