/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { map } from 'lodash';
import { useSelector } from 'dva';
import { Button } from '@kufox/mui';
import Toast from 'components/Toast';
import { useIsMobile } from 'components/$/MarketCommon/config';
import { goPage, STEPS_CONFIG } from '../config';
import styles from './style.less';
import ArrowIcon from 'assets/luckydrawTurkey/arrow-right.png';

const StepItem = ({
  index = null,
  icon = null,
  text = '',
  buttonText = '',
  webUrl = '',
  h5Url = '',
  appUrl = '',
  appLoginedMsg = null,
}) => {
  const isMobile = useIsMobile();
  const { isInApp } = useSelector(state => state.app);
  const { isLogin } = useSelector(state => state.user);

  const gotoPage = useCallback(
    () => {
      if (isInApp && isLogin && appLoginedMsg) {
        Toast({ type: 'warning', msg: appLoginedMsg });
        return;
      }
      goPage({
        isMobile,
        isInApp,
        webUrl,
        h5Url,
        appUrl,
        appLoginedMsg,
      });
    },
    [isMobile, isInApp, webUrl, h5Url, appUrl, isLogin, appLoginedMsg],
  );

  return (
    <div className={styles.flexItem} inspector="participate_step">
      <div className={styles.curStep}>Step {index + 1}</div>
      <img className={styles.stepIcon} src={icon} alt="icon" />
      <p className={styles.stepText}>{text}</p>
      <Button className={styles.stepButton} type="primary" size="small" onClick={gotoPage}>
        {buttonText}
        <img className={styles.arrowRight} src={ArrowIcon} alt="arrow" />
      </Button>
    </div>
  );
};

const ParticipateStep = ({ namespace = 'luckydrawTurkey' }) => {
  const { title, list } = STEPS_CONFIG[namespace] || { title: '', list: [] };

  return (
    <div className={styles.container} inspector="participate">
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.flexbox}>
        {map(list, (item, index) => (
          <StepItem key={index} index={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ParticipateStep;
