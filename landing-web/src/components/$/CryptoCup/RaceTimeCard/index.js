/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { _t } from 'utils/lang';
import { useLogin } from 'src/hooks';
import rightArrow from 'assets/cryptoCup/right-arrow.svg';
import AntiDuplication from 'components/common/AntiDuplication';
import DownTime from './DownTime';
import { SPLITER_WIDTH, CONTENT_WIDTH, cryptoCupTrackClick, goToDomBlock } from '../config';
import useGetTimeInfo from '../hooks/useGetTimeInfo';
import { cryptoCupExpose, getAppLoginParams } from '../config';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #ffffff;
  filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.2)) drop-shadow(0px 10px 60px rgba(0, 0, 0, 0.2));
  position: fixed;
  bottom: 0;
  z-index: 4;
  padding: 16px 16px 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  @media (min-width: ${SPLITER_WIDTH}px) {
    max-width: ${CONTENT_WIDTH}px;
  }
`;

const AlreadyWrap = styled.div`
  font-size: 16px;
  line-height: 21px;
  color: rgba(0, 13, 29, 0.68);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
`;

const Begin = styled.div`
  /* margin: -14px 0 7px; */
  margin: 0 0 7px;
`;

const TimeLine = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  /* text-transform: uppercase; */
  color: rgba(0, 13, 29, 0.68);
  display: flex;
  align-items: center;
`;

const BtnWrap = styled.div`
  /* background: linear-gradient(180deg, #b5ffde 0%, #75fbaf 0.01%, #61e0a3 100%); */
  /* box-shadow: 0px 2px 0px #48a986, inset 0px -1px 0px #c5ffe8; */
  background: linear-gradient(180deg, #abfedd 0%, #06e2b5 100%);
  box-shadow: 0px 2px 0px #399c96;
  border-radius: 90px;
  margin-top: 22px;
  height: 42px;
  width: 100%;
  padding: 4px;
  margin-bottom: 17px;
  position: relative;
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
  left: 12px;
  color: #9e6b2e;
  background: #fff469;
  border-radius: 20px;
  border-bottom-left-radius: unset;
`;

const BtnIn = styled.div`
  cursor: pointer;
  border: 0.6px solid #e7fff4;
  border-radius: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  color: #000d1d;

  &::after {
    display: ${props => (props.showArrow ? 'block' : 'none')};
    content: '';
    width: 12px;
    height: 12px;
    background: ${props => `url(${rightArrow}) no-repeat`};
    background-size: 100% 100%;
    margin: 0 0 0 2px;
  }
`;

function RaceTimeCard() {
  const { status } = useGetTimeInfo();
  const { isLogin, handleLogin } = useLogin();

  useEffect(
    () => {
      if (!isLogin) {
        cryptoCupExpose(['login', '1']);
      } else {
        cryptoCupExpose(['join', '1']);
      }
    },
    [isLogin],
  );

  const renderTimeLine = () => {
    if (status === 1) {
      return (
        <AlreadyWrap>
          <Begin>{_t('mj1CfDuzkgzgThA47EbqT1')}</Begin>
          <TimeLine>
            <DownTime />
          </TimeLine>
        </AlreadyWrap>
      );
    }
    if (status === 2) {
      return (
        <AlreadyWrap>
          <Begin>{_t('8z3GQz4JFiZNnkgmiAZRos')}</Begin>
          <TimeLine>
            <DownTime />
          </TimeLine>
        </AlreadyWrap>
      );
    }
  };

  return (
    <Wrapper>
      <>{renderTimeLine()}</>
      <BtnWrap>
        <>
          {isLogin ? (
            <>
              <AntiDuplication>
                <BtnIn
                  showArrow
                  onClick={() => {
                    cryptoCupTrackClick(['join', `1`]);
                    goToDomBlock('CryptoCup-SelectTeam-Anchor');
                  }}
                >
                  {_t('9KsZd3hBKHUu1MFTYZ6St3')}
                </BtnIn>
              </AntiDuplication>
              <BtnTip>{_t('w6UU37KZtxk7TSVc5LhdZM')}</BtnTip>
            </>
          ) : (
            <AntiDuplication>
              <BtnIn
                onClick={() => {
                  cryptoCupTrackClick(['login', `1`]);
                  handleLogin(getAppLoginParams());
                }}
              >
                {_t('nBnFDix2pa8Ycc53sP57dQ')}
                {/* 注册/登录 */}
              </BtnIn>
            </AntiDuplication>
          )}
        </>
      </BtnWrap>
    </Wrapper>
  );
}

export default React.memo(RaceTimeCard);
