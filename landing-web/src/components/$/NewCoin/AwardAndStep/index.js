/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { _t, _tHTML } from 'utils/lang';
import { kcsensorsClick } from 'utils/ga';
import { useSelector } from 'dva';
import { map, debounce } from 'lodash';
import { Button } from '@kufox/mui';
import { useDispatch } from 'dva';
import { useIsMobile } from 'components/$/MarketCommon/config';
import { goPage, handleLogin, handleSignup } from 'components/$/MarketCommon/luckydrawCommon';
import classnames from 'classnames';
import { STEPS_CONFIG } from '../config';
import ArrowIcon from 'assets/luckydrawTurkey/arrow-right.png';
import oneIcon from 'assets/newCoin/one.svg';
import twoIcon from 'assets/newCoin/two.svg';
import threeIcon from 'assets/newCoin/three.svg';
import styles from './index.less';
import bannerStyles from '../Banner/style.less';

const AwardAndStep = ({ namespace = 'newCoinCarnival', round = 'one' }) => {
  const dispatch = useDispatch();
  const StepItem = ({
    title = '',
    text = '',
    buttonText = '',
    webUrl = '',
    h5Url = '',
    appUrl = '',
    loginBackUrl = '',
    index,
    kcsensorsBlockId,
    inspector,
  }) => {
    const isMobile = useIsMobile();
    const { isInApp, supportCookieLogin } = useSelector(state => state.app);
    const { isLogin } = useSelector(state => state.user);

    const gotoPage = useCallback(
      debounce(
        options => {
          kcsensorsClick([kcsensorsBlockId, '1']);
          // 步骤1
          if (index === 0) {
            if (round === 'two') {
              if (isLogin) {
                dispatch({
                  type: `${namespace}/update`,
                  payload: {
                    dialogConfig: {
                      show: true,
                      content: (
                        <div className={bannerStyles.toastText}>{_t('newCoin.toast.signin')}</div>
                      ),
                    },
                  },
                });
                return;
              } else {
                handleSignup(isInApp, supportCookieLogin, loginBackUrl);
                return;
              }
            } else {
              if (isInApp && isLogin) {
                dispatch({
                  type: `${namespace}/update`,
                  payload: {
                    dialogConfig: {
                      show: true,
                      content: (
                        <div className={bannerStyles.toastText}>{_t('newCoin.toast.signin')}</div>
                      ),
                    },
                  },
                });
                return;
              } else {
                goPage(options);
                return;
              }
            }
          }
          // 步骤2/3
          if (isLogin) {
            goPage(options);
          } else {
            round === 'two'
              ? handleSignup(isInApp, supportCookieLogin, loginBackUrl)
              : handleLogin(isInApp, supportCookieLogin, loginBackUrl);
          }
        },
        1000,
        { leading: true, trailing: false },
      ),
      [isLogin, isLogin, namespace, isInApp, supportCookieLogin, loginBackUrl, kcsensorsBlockId],
    );

    return (
      <div className={styles.stepsItem} inspector={inspector}>
        <div className={styles.step}>{title}</div>
        <p className={styles.stepDesc}>{text}</p>
        <Button
          className={styles.stepButton}
          type="primary"
          size="small"
          onClick={() => {
            gotoPage({
              isMobile,
              isInApp,
              webUrl,
              h5Url,
              appUrl,
            });
          }}
        >
          <span>{buttonText}</span>
          <img className={styles.arrowRight} src={ArrowIcon} alt="arrow" />
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className={styles.container} inspector="prize_pool">
        <h2 className={classnames(styles.title, styles.youCanTitle)}>{_t('newCoin.get.title')}</h2>
        <div className={styles.list}>
          <div className={classnames(styles.listItem, styles.two)}>
            <img className={styles.awardPic} src={twoIcon} alt="award" />
            <div className={styles.desc}>
              <div className={styles.line1}>{_tHTML('newCoin.get.money', { num: '100' })}</div>
              <div className={styles.line2}>{_t('newCoin.get.winner', { num: '1000' })}</div>
            </div>
          </div>
          <div className={classnames(styles.listItem, styles.one)}>
            <img className={styles.awardPic} src={oneIcon} alt="award" />
            <div className={styles.desc}>
              <div className={styles.line1}>
                <div className={styles.line1}>
                  {_tHTML('newCoin.get.money', { num: '100,000' })}
                </div>
              </div>
              <div className={styles.line2}>{_t('newCoin.get.winner', { num: '1' })}</div>
            </div>
          </div>
          <div className={classnames(styles.listItem, styles.three)}>
            <img className={styles.awardPic} src={threeIcon} alt="award" />
            <div className={styles.desc}>
              <div className={styles.line1}>
                <div className={styles.line1}>{_tHTML('newCoin.get.money', { num: '50,000' })}</div>
              </div>
              <div className={styles.line2}>{_t('newCoin.get.equal')}</div>
            </div>
          </div>
        </div>
      </div>
      <div inspector="participate" className={classnames(styles.container, styles.stepsContainer)}>
        <h2 className={`${styles.stepTitle} ${styles.title}`}>{_t('newCoin.step.title')}</h2>
        <div className={styles.steps}>
          {map(STEPS_CONFIG.list, (item, index) => (
            <StepItem
              key={index}
              loginBackUrl={STEPS_CONFIG.loginBackUrl[round]}
              {...item}
              index={index}
              inspector={item?.kcsensorsBlockId}
            />
          ))}
        </div>
        <p className={styles.stepsInfo}>{_t('newCoin.step.tips')}</p>
      </div>
    </>
  );
};

export default AwardAndStep;
