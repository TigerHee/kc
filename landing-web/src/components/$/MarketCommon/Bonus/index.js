/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@kufox/mui';
import { useSelector } from 'dva';
import classname from 'classname';
import { get } from 'lodash';
import { useIsMobile, handleSignUp, BONUS_CONFIG } from '../config';
import { addLangToPath } from 'utils/lang';
import siteConfig from 'utils/siteConfig';
import styles from './style.less';
import presentSvg from 'assets/registration/present.svg';
import presentTextSvg from 'assets/registration/presentText.svg';
import fingerSvg from 'assets/registration/finger.svg';

const Bonus = ({ namespace = 'luckydrawTurkey' }) => {
  const { isInApp, supportCookieLogin } = useSelector(state => state.app);
  const { isLogin } = useSelector(state => state.user);
  const modalData = useSelector(state => state[namespace]);
  const channelCode = get(modalData, 'config.channelCode', '');
  const [bonus, setBonus] = useState(['0']);
  const bonusRef = useRef(null);
  const isMobile = useIsMobile();
  const content = BONUS_CONFIG[namespace];

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

  useEffect(
    () => {
      if (!isInApp && !isLogin) {
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
        io.observe(document.getElementById('luckydraw_footer'));

        return () => {
          // 关闭观察者
          io.disconnect();
        };
      }
    },
    [isInApp, isLogin],
  );

  const goBannerSignUp = () => {
    handleSignUp(isInApp, supportCookieLogin, content.signUpUrl(channelCode));
  };

  return isInApp || isLogin ? null : (
    <div className={styles.modBonus}>
      <div className={styles.bonusWrap} inspector="bonus" ref={bonusRef}>
        <div className={styles.inner}>
          <div className={styles.bonusLeft}>
            <a
              href={addLangToPath(`${siteConfig.LANDING_HOST}/newcomer-guide`)}
              onClick={(e)=>{
                e.preventDefault();
                const url = content.newcomerUrl(channelCode) ||
                addLangToPath(`${siteConfig.LANDING_HOST}/newcomer-guide${window.location.search}`);
                window.open(url,"_blank");
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.presentBox}>
                <img src={presentSvg} alt="present-icon" className={styles.presentImg} fetchpriority="low"  />
                <img src={presentTextSvg} alt="present-text-icon" className={styles.presentTextImg}  fetchpriority="low" />
              </div>
            </a>
            <div className={styles.numWrap}>
              <div className={styles.numBox}>
                <div className={styles.numItems}>
                  <span className={bonus[0] === '0' ? styles.numRed : ''}>0</span>
                </div>
                <div>
                  {bonus.length === 1 ? (
                    <div className={styles.numItems}>
                      <span className={bonus[0] === '0' ? styles.numRed : ''}>0</span>
                    </div>
                  ) : null}
                </div>
                <div className={styles.numBox}>
                  {bonus.map((item, index) => (
                    <div className={styles.numItems} key={`${item}${index}`}>
                      <span className={bonus[0] === '0' ? styles.numRed : ''}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.numInfo}>{content.numInfo(bonus.join(''))}</div>
            </div>
          </div>
          <div className={styles.bonusRight}>
            <div>
              {isMobile ? null : (
                <div className={styles.flexCenter}>
                  <span
                    className={classname([styles.bonusWelcome, bonus[0] === '0' && styles.delLine])}
                  >
                    {content.welcome}
                  </span>
                  <img src={fingerSvg} alt="finger-icon" className={styles.fingerImg}  fetchpriority="low" />
                </div>
              )}
            </div>
            <Button onClick={goBannerSignUp} className={styles.signBtn}>
              {content.signUp}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bonus;
