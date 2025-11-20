/**
 * Owner: chris@kupotech.com
 */

import { Button, styled } from '@kux/mui';
import clsx from 'clsx';
import { _t } from 'src/tools/i18n';
import sensors from 'tools/ext/kc-sensors';
import { levelConfigMap, totalLevel } from '../../config';
import { getScene } from '../../utils';
import { WebBannerSlide } from '../Slide';
import StarBorderButton from '../StarBorderButton';
import AssetsProportion from './AssetsProportion';
import { SwiperWeb } from './Swiper';

const Container = styled.div`
  width: 100%;
  .ml40 {
    margin-left: 40px;
  }
  .content {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-tiems: center;
    .btnLeft {
      // margin-left: 40px;
    }
  }
`;
const Buttons = styled(StarBorderButton)`
  min-width: 200px;
`;

function WebBanner({
  goUpgradeHandle: goUpgradeHandleProps,
  isLg,
  userLevel,
  currentLevel,
  updateLevel,
  ruleHandle,
  upgradeHandle,
  randomKey,
  isLottieReady
}) {
  const isLastLevel = userLevel === totalLevel;
  const { hintColor, bgColor, shineColor } = levelConfigMap[currentLevel] || {};
  const goUpgradeHandle = () => {
    sensors.trackClick([`Update`, `1`], {
      kcs_level: userLevel,
      pagePosition: `${currentLevel}`,
      ...getScene(),
    });
    goUpgradeHandleProps();
  };
  return (
    <Container>
      <div className="content">
        <div
          className={clsx({
            ['flex1']: isLg,
          })}
        >
          <SwiperWeb
            currentLevel={currentLevel}
            userLevel={userLevel}
            upgradeHandle={upgradeHandle}
            randomKey={randomKey}
            isLottieReady={isLottieReady}
          />
        </div>
        <div className="flex-center ml40">
          {isLg && <AssetsProportion />}
          <Buttons
            className="btnLeft help"
            onClick={goUpgradeHandle}
            shineColor={shineColor}
            style={{
              color: hintColor,
              background: bgColor,
              minWidth: 200,
            }}
            size="large"
          >
            {isLastLevel ? _t('43be8ba0ff1d4000ad18') : _t('e00aa1c68b994000a66e')}
          </Buttons>
          <Button onClick={ruleHandle} className="ml-24 rule" type="default" size="large">
            {_t('rules')}
          </Button>
        </div>
      </div>
      <WebBannerSlide
        currentLevel={currentLevel}
        userLevel={userLevel}
        updateLevel={updateLevel}
        randomKey={randomKey}
      />
    </Container>
  );
}
export default WebBanner;
