/**
 * Owner: chris@kupotech.com
 */
import Slide from '../Slide';
import Swiper from './Swiper';

function H5Banner({
  currentLevel,
  levelConfig,
  userLevel,
  updateLevel,
  goUpgradeHandle,
  upgradeHandle,
  randomKey,
  isLottieReady,
}) {
  return (
    <>
      <Slide
        currentLevel={currentLevel}
        levelConfig={levelConfig}
        userLevel={userLevel}
        updateLevel={updateLevel}
        randomKey={randomKey}
      />
      <Swiper
        userLevel={userLevel}
        updateLevel={updateLevel}
        currentLevel={currentLevel}
        goUpgradeHandle={goUpgradeHandle}
        upgradeHandle={upgradeHandle}
        isLottieReady={isLottieReady}
      />
    </>
  );
}
export default H5Banner;
