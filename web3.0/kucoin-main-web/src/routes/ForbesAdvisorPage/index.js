/**
 * Owner: willen@kupotech.com
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Tooltip, Button } from '@kc/mui';
import { push } from 'utils/router';
import { useSelector } from 'src/hooks/useSelector';
import { ga } from 'utils/ga';
import styles from './style.less';
import LogoImg from 'static/forbes/logo.svg';
import InfoImg from 'static/forbes/info.svg';
import AdvisorImg from 'static/forbes/advisor.svg';
import GuideImg from 'static/newhomepage/forbes-guide.png';
import { addLangToPath } from 'tools/i18n';
import SpanForA from 'src/components/common/SpanForA';
// 这个页面不考虑国际化，本身就是引用福布斯网站对kucoin的评价，全英文
const ForbesAdvisorPage = () => {
  const [showMore, setShowMore] = useState(false);
  const { isLogin } = useSelector((state) => state.user);

  const toggleShow = useCallback(() => {
    setShowMore((cur) => !cur);
  }, []);

  const renderEndTexts = useMemo(() => {
    if (showMore) {
      return 'cybersecurity features, user reviews and educational resources. We chose the top exchanges based on weighting assigned to the categories.';
    }
    return 'cybersecu... ';
  }, [showMore]);

  // 去登录
  const goLogin = useCallback((e) => {
    e.preventDefault();
    ga('ForbesPage_GoLogin_Click');
    push('/ucenter/signin');
  }, []);

  // 去注册: landing-web的注册落地页
  const goRegister = useCallback(() => {
    ga('ForbesPage_GoRegister_Click');
  }, []);

  // 回首页
  const goHome = useCallback((e) => {
    e.preventDefault();
    ga('ForbesPage_GoHome_Click');
    push('/');
  }, []);

  // 渲染按钮
  const renderBtns = useMemo(() => {
    if (isLogin) {
      return (
        <div className={styles.btns}>
          <Button as="a" href="/" className={styles.button} onClick={goHome}>
            Home Page
          </Button>
        </div>
      );
    }
    return (
      <div className={styles.btns}>
        <Button
          as="a"
          href={addLangToPath('/ucenter/signin')}
          className={styles.button}
          onClick={goLogin}
        >
          Log In
        </Button>
        <Button
          as="a"
          href={addLangToPath('/land/register')}
          className={styles.button}
          onClick={goRegister}
        >
          Sign Up
        </Button>
      </div>
    );
  }, [isLogin, goHome, goLogin, goRegister]);

  // 手动增加PV、UV统计Key
  useEffect(() => {
    ga('ForbesPage_Views');
  }, []);

  return (
    <div className={styles.forbes} data-inspector="forbes_advisor_page">
      <div className={styles.head} data-inspector="forbes_advisor_page_head">
        <a href="https://www.forbes.com/advisor" target="_blank" rel="noopener noreferrer">
          <img src={LogoImg} alt="forbes-advisor" />
        </a>
      </div>
      <div className={styles.main} data-inspector="forbes_advisor_page_main">
        <div className={styles.box}>
          <div className={styles.left}>
            <img className={styles.forbesLogo} src={GuideImg} alt="forbes-advisor" />
            <img className={styles.kucoinLogo} src={window._BRAND_LOGO_} alt="kucoin-logo" />
          </div>
          <div className={styles.right}>
            <h1 className={styles.title}>Among The Best Crypto Exchanges</h1>
            <p className={styles.date}>Awarded on May 27, 2021</p>
            <div className={styles.rank}>
              <p className={styles.name}>KuCoin</p>
              <Tooltip
                placement="bottom"
                classes={{ tooltip: styles.tooltip, arrow: styles.tooltipArow }}
                title="Our ratings take into account the card’s rewards, fees, rates along with the card’s category. All ratings are determined solely by our editorial team."
              >
                <div className={styles.scorebox}>
                  <span className={styles.score}>4.1</span>
                  <div className={styles.starbox}>
                    <span className={styles.star}>
                      <span className={styles.starInner} />
                    </span>
                    <div className={styles.advisorbox}>
                      <img className={styles.advisor} src={AdvisorImg} alt="forbes advisor icon" />
                      <img className={styles.infoIcon} src={InfoImg} alt="info-icon" />
                    </div>
                  </div>
                </div>
              </Tooltip>
            </div>
            <p className={styles.p1}>
              Cryptocurrency is the must-have investment right now, but you can’t just buy Bitcoin
              anywhere. That’s where digital currency exchanges come in. Not all exchanges are
              identical, and you’ll need to consider trading fees, exchange offerings and security
              when investing.
            </p>
            <p className={styles.p2}>WHY WE PICKED IT</p>
            <p className={styles.p3}>
              We reviewed 10 of the leading cryptocurrency exchanges based on their web traffic,
              liquidity, trading volume and availability for U.S.-based customers. We then collected
              nearly two dozen data points per exchange to arrive at our ratings, including types of
              cryptocurrencies available, fees,
              {renderEndTexts}
              <SpanForA className={styles.toggle} onClick={toggleShow}>
                {showMore ? 'Read Less' : 'Read More'}
              </SpanForA>
            </p>
          </div>
        </div>
        {renderBtns}
      </div>
    </div>
  );
};

export default ForbesAdvisorPage;
