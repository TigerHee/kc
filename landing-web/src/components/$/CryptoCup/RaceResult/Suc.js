/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { styled } from '@kufox/mui/emotion';
import { get } from 'lodash';
import { WOW } from 'wowjs';
import 'animate.css';
import { _t } from 'utils/lang';
// import { loadSVGAAssets, SEASON_NAME_MAP } from '../config';
import { SEASON_NAME_MAP } from '../config';
import useRaceResult from '../hooks/useRaceResult';
import LightImg from 'assets/cryptoCup/light.svga';
import StarImg from 'assets/cryptoCup/star.svg';

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

const AnimationContainer = styled.div`
  margin: -30px auto 0;
  width: 250px;
  height: 300px;
  transform: scale(1.3);
`;

const Name = styled.div`
  margin-bottom: 5px;
  font-style: italic;
  font-weight: 800;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  background-image: linear-gradient(90.47deg, #ffd75e 4.71%, #ffffc3 95.25%);
  background-clip: text;
  text-fill-color: transparent;
`;

const Victory = styled.div`
  position: relative;
`;

const LineTop = styled.div`
  height: 1px;
  width: 270px;
  background: linear-gradient(
    90deg,
    #fffadf 0%,
    rgba(255, 244, 186, 0) 0.01%,
    rgba(255, 250, 227, 0.64) 49.27%,
    rgba(255, 243, 178, 0) 108.05%
  );
  margin-left: 25px;
`;

const LineBottom = styled.div`
  height: 1px;
  width: 270px;
  background: linear-gradient(
    90deg,
    #fffadf 0%,
    rgba(255, 244, 186, 0) 0.01%,
    rgba(255, 250, 227, 0.73) 53.21%,
    rgba(255, 243, 178, 0) 108.05%
  );
  margin-left: 85px;
`;

const VictoryText = styled.div`
  text-align: center;
  line-height: 53px;
  font-style: italic;
  font-weight: 800;
  font-size: 50px;
  background-image: linear-gradient(90.47deg, #ffd75e 4.71%, #ffffc3 95.25%);
  background-clip: text;
  text-fill-color: transparent;
`;

const StarIcon = styled.img`
  position: absolute;
  right: 55px;
  top: 0;
  width: 22px;
`;

const RaceSucResult = () => {
  const dispatch = useDispatch();
  const { sucRaceModalVisible } = useSelector((state) => state.cryptoCup);
  const { curAward } = useRaceResult();
  const { seasonNameEn } = curAward || {};
  const seasonNameFunc = get(SEASON_NAME_MAP, seasonNameEn, () => null);

  // 动画
  useEffect(() => {
    if (sucRaceModalVisible) {
      new WOW({
        offset: 20,
      }).init();
      const _id = '#worldcup-victory';
      const dom = document.querySelector(_id);
      // if (dom) loadSVGAAssets(LightImg, _id);
      setTimeout(() => {
        dispatch({
          type: 'cryptoCup/update',
          payload: {
            sucRewardModalVisible: true,
            sucRaceModalVisible: false,
          },
        });
      }, 3000);
    }
  }, [sucRaceModalVisible, dispatch]);

  if (sucRaceModalVisible)
    return (
      <Container>
        <Content>
          <Victory>
            <Name>{seasonNameFunc()}</Name>
            <LineTop className="wow slideInLeft" data-wow-delay=".5s" />
            <VictoryText className="wow slideInLeft" data-wow-delay="1.5s">
              {_t('aExNQeKiSusTy6iKkaa4MG')}
            </VictoryText>
            <LineBottom className="wow slideInRight" data-wow-delay=".5s" />
            <StarIcon src={StarImg} alt="star" />
          </Victory>
          <AnimationContainer id="worldcup-victory" />
        </Content>
      </Container>
    );

  return null;
};

export default RaceSucResult;
