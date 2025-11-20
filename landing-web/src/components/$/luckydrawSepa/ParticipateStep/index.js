/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { map, get } from 'lodash';
import { useSelector } from 'dva';
import { Button } from '@kufox/mui';
import { isIOS } from 'helper';
import { useIsMobile } from 'components/$/MarketCommon/config';
import { goPage, handleLogin } from 'components/$/MarketCommon/luckydrawCommon';
import { STEPS_CONFIG } from '../config';
import styles from './style.less';
import ArrowIcon from 'assets/luckydrawTurkey/arrow-right.png';

const StepItem = ({
  title = '',
  icon = null,
  text = '',
  buttonText = '',
  webUrl = '',
  h5Url = '',
  appUrl = '',
  loginBackUrl = '',
}) => {
  const isMobile = useIsMobile();
  const { isInApp, supportCookieLogin } = useSelector(state => state.app);
  const { isLogin } = useSelector(state => state.user);

  const gotoPage = () => {
    if (isLogin) {
      goPage({
        isMobile,
        isInApp,
        webUrl,
        h5Url,
        appUrl,
      });
    } else {
      handleLogin(isInApp, supportCookieLogin, loginBackUrl);
    }
  };

  return (
    <div className={styles.flexItem} inspector="participate_step">
      <div className={styles.curStep}>{title}</div>
      <img className={styles.stepIcon} src={icon} alt="icon" />
      <p className={styles.stepText}>{text}</p>
      <Button className={styles.stepButton} type="primary" size="small" onClick={gotoPage}>
        <span>{buttonText}</span>
        <img className={styles.arrowRight} src={ArrowIcon} alt="arrow" />
      </Button>
    </div>
  );
};

const ParticipateStep = ({ namespace = 'luckydrawSepa' }) => {
  const text = STEPS_CONFIG[namespace];
  const { isInApp } = useSelector(state => state.app);
  const { config } = useSelector(state => state[namespace]);
  const videoUrl = get(config, 'videoUrl', undefined);
  const prizePool = get(config, 'param.prizePool', {});
  const coinStr = useMemo(
    () => {
      let result = '';
      for (let obj in prizePool) {
        const coinValue = prizePool[obj] || '';
        const coinArr = coinValue.split(',');
        const coinNum = coinArr[0] || '';
        const coinName = coinArr[1] || '';
        result = `${result}${result === '' ? '' : ','}${coinNum} ${coinName}`;
      }
      return result;
    },
    [prizePool],
  );

  // 视频的兼容处理
  const videoSetting = useMemo(
    () => ({
      controls: true,
      autoPlay: false,
      preload: 'metadata',
      controlslist: isInApp ? 'nodownload' : '',
      muted: true,
      poster: isIOS() || isInApp ? text.thumbImg : '',
    }),
    [isInApp, text],
  );

  return (
    <div className={styles.container} inspector="participate">
      <h2 className={styles.title}>{text.title}</h2>
      <div className={styles.content}>
        <p className={styles.conTitle}>{text.activity1}</p>
        <div>
          {map(text.activity1Item, (item, index) => (
            <p className={styles.conItem} key={`activity_${index}`}>
              {item}
            </p>
          ))}
        </div>
        <p className={styles.conSubTitle}>{text.activity2(coinStr)}</p>
        <p className={styles.conTitle}>{text.activity3}</p>
        <div>
          {map(text.activity3Item, (item, index) => (
            <p className={styles.conItem} key={`conItem_${index}`}>
              * <span>{item}</span>
            </p>
          ))}
        </div>
      </div>
      <h4 className={styles.deposit}>{text.deposit}</h4>
      <div className={styles.flexbox}>
        {map(text.list, (item, index) => (
          <StepItem key={index} loginBackUrl={text.loginBackUrl} {...item} />
        ))}
      </div>
      <div>
        {videoUrl ? (
          <div className={styles.videoPart}>
            <h2 className={styles.title}>{text.videoTitle}</h2>
            <div className={styles.videoContainer}>
              <video inspector="video" className={styles.video} src={videoUrl} {...videoSetting}>
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ParticipateStep;
