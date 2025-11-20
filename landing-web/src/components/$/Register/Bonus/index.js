/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';

import { Button } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { _t, addLangToPath } from 'utils/lang';
import siteConfig from 'utils/siteConfig';
import classname from 'classname';
import presentSvg from 'assets/registration/present.svg';
import presentTextSvg from 'assets/registration/presentText.svg';
import fingerSvg from 'assets/registration/finger.svg';
import styles from './style.less';
import { kcsensorsClick } from 'utils/ga';

const Bonus = () => {
  const dispatch = useDispatch();
  const { currentLang } = useSelector(state => state.app);
  const [bonus, setBonus] = useState(['0']);

  useEffect(() => {
    let bonusNum = 95;
    setBonus(`${bonusNum}`.split(''));

    const timer = setInterval(() => {
      bonusNum -= 1;
      if (bonusNum > 0) {
        setBonus(`${bonusNum}`.split(''));
      }
      if (bonusNum === 0) {
        setBonus(['0']);
        clearInterval(timer);
      }
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const goBannerSignUp = useCallback(() => {
    // ReactGA.ga('send', 'event', 'ld', 'click', 'registerfloat');
    kcsensorsClick(['confirmButton', '1']);
    dispatch({
      type: 'register/update',
      payload: {
        signupVisible: true,
      },
    });
  }, []);

  const url = addLangToPath(`${siteConfig.KUCOIN_HOST}/land/newcomer-package-operation}`);
  return (
    <div inspector="bonus" className={styles.bonusWrap}>
      <div className={styles.inner}>
        <div className={styles.bonusLeft}>
          <a
            href={url}
            onClick={(e)=>{
              e.preventDefault();
              window.open(url,"_blank");
            }}
            rel="noopener noreferrer"
          >
            <div className={styles.presentBox}>
              <img src={presentSvg} alt="" className={styles.presentImg} />
              <img src={presentTextSvg} alt="" className={styles.presentTextImg} />
            </div>
          </a>
          <div className={styles.numWrap}>
            <div className={styles.numBox}>
              <div className={styles.numItems}>
                <span className={bonus[0] === '0' ? styles.numRed : ''}>0</span>
              </div>
              {bonus.length === 1 && (
                <div className={styles.numItems}>
                  <span className={bonus[0] === '0' ? styles.numRed : ''}>0</span>
                </div>
              )}
              {bonus.map((item, index) => (
                <div className={styles.numItems} key={`${item}${index}`}>
                  <span className={bonus[0] === '0' ? styles.numRed : ''}>{item}</span>
                </div>
              ))}
            </div>
            <div className={styles.numInfo}>{_t('register.prizes', { 1: bonus.join('') })}</div>
          </div>
        </div>
        <div className={styles.bonusRight}>
          <span className={classname([styles.bonusWelcome, bonus[0] === '0' && styles.delLine])}>
            {_t('register.signup.now')}
          </span>
          <img src={fingerSvg} alt="" className={styles.fingerImg} />
          <Button onClick={goBannerSignUp} type="primary" className={styles.signBtn}>
            {_t('register.signup')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Bonus;
