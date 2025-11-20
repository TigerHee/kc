/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { styled } from '@kufox/mui/emotion';
import { WOW } from 'wowjs';
import 'animate.css';
import { get } from 'lodash';
import { _t } from 'utils/lang';
import { SEASON_NAME_MAP } from '../config';
import useRaceResult from '../hooks/useRaceResult';
import DefeatPng from 'assets/cryptoCup/defeat.png';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 8, 13, 0.7);
`;

const Content = styled.div`
  max-width: 375px;
  width: 100%;
`;

const Name = styled.div`
  margin-bottom: 5px;
  font-style: italic;
  font-weight: 800;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  background-image: linear-gradient(90.47deg, #cecece 4.71%, #f8f8f8 95.25%);
  background-clip: text;
  text-fill-color: transparent;
`;

const Defeat = styled.div`
  position: relative;
`;

const LineTop = styled.div`
  height: 1px;
  width: 270px;
  background: linear-gradient(
    90deg,
    #fffadf 0%,
    rgba(225, 225, 225, 0) 0.01%,
    rgba(119, 119, 119, 0.73) 48.77%,
    rgba(220, 220, 220, 0) 108.05%
  );
  margin-left: 25px;
`;

const LineBottom = styled.div`
  height: 1px;
  width: 270px;
  background: linear-gradient(
    90deg,
    #fffadf 0%,
    rgba(225, 225, 225, 0) 0.01%,
    rgba(119, 119, 119, 0.73) 48.77%,
    rgba(220, 220, 220, 0) 108.05%
  );
  margin-left: 85px;
`;

const DefeatText = styled.div`
  text-align: center;
  line-height: 53px;
  font-style: italic;
  font-weight: 800;
  font-size: 50px;
  background-image: linear-gradient(90.47deg, #cecece 4.71%, #f8f8f8 95.25%);
  background-clip: text;
  text-fill-color: transparent;
`;

const DefeatImg = styled.img`
  display: block;
  margin: 31px auto 0;
  width: 89px;
  height: 112px;
  animation: moveAnimation 3s ease-in-out infinite;

  @keyframes moveAnimation {
    from {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-15px);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

const RaceFailResult = () => {
  const dispatch = useDispatch();
  const { curAward } = useRaceResult();
  const { seasonNameEn } = curAward || {};
  const { failRaceModalVisible } = useSelector(state => state.cryptoCup);
  const seasonNameFunc = get(SEASON_NAME_MAP, seasonNameEn, () => null);

  useEffect(
    () => {
      if (failRaceModalVisible) {
        new WOW({
          offset: 20,
        }).init();
        setTimeout(() => {
          dispatch({
            type: 'cryptoCup/update',
            payload: {
              failRewardModalVisible: true,
              failRaceModalVisible: false,
            },
          });
        }, 3000);
      }
    },
    [failRaceModalVisible, dispatch],
  );

  if (failRaceModalVisible)
    return (
      <Container>
        <Content>
          <Defeat>
            <Name>{seasonNameFunc()}</Name>
            <LineTop className="wow slideInLeft" data-wow-delay=".5s" />
            <DefeatText className="wow slideInLeft" data-wow-delay="1.5s">
              {_t('gysUNL12b61NUuRyPvCaY2')}
            </DefeatText>
            <LineBottom className="wow slideInRight" data-wow-delay=".5s" />
          </Defeat>
          <DefeatImg src={DefeatPng} alt="defeat-icon" />
        </Content>
      </Container>
    );

  return null;
};

export default RaceFailResult;
