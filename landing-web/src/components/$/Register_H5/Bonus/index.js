/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';

import { Button } from '@kufox/mui';
import { useDispatch, useSelector } from 'dva';
import siteConfig from 'utils/siteConfig';
import { _t, addLangToPath } from 'utils/lang';
import presentSvg from 'assets/registration/present.svg';
import presentTextSvg from 'assets/registration/presentText.svg';
import styles from './style.less';
import { kcsensorsClick, kcsensorsManualExpose } from 'utils/ga';

const Bonus = () => {
  const dispatch = useDispatch();
  const { currentLang } = useSelector(state => state.app);
  const [bonus, setBonus] = useState(['0']);
  const bonusRef = useRef(null);

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

  useEffect(() => {
    // 创建观察者
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // isIntersecting 判断当前元素是否可见
        if (entry.isIntersecting) {
          bonusRef.current.classList.remove(styles.fixed);
        } else {
          bonusRef.current.classList.add(styles.fixed);
        }
      });
    });
    // 监听footer
    io.observe(document.getElementById('register_h5_footer'));

    return () => {
      // 关闭观察者
      io.disconnect();
    };
  }, []);

  const goBannerSignUp = useCallback(() => {
    // ReactGA.ga('send', 'event', 'ld', 'click', 'registerfloat');
    kcsensorsClick(['confirmButton', '1']);
    dispatch({
      type: 'register/update',
      payload: {
        drawerSignUpOpen: true,
      }
    });
    kcsensorsManualExpose(
      { kc_pageid: 'B1landRegister' },
      ['popUp', '1']
    );
  }, [currentLang]);
  const url = addLangToPath(`${siteConfig.KUCOIN_HOST}/land/newcomer-package-operation`)
  return (
    <div className={styles.modBonus} id="register_h5_modBonus">
      <div className={styles.bonusWrap} ref={bonusRef}>
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
        <Button onClick={goBannerSignUp} type="primary" className={styles.signBtn}>
          {_t('register.signup')}
        </Button>
      </div>
    </div>
  );
};

export default Bonus;
