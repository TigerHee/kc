/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useCallback, useRef } from 'react';
import { _t, _tHTML } from 'utils/lang';

import { Carousel } from 'components/$/Register/Carousel';
import { useDispatch, useSelector } from 'dva';
import classname from 'classname';
import btcSvg from 'assets/registration/BTC.svg';
import arrowSvg from 'assets/registration/arrow_right.svg';
import appleAllPng from 'assets/registration/apple_all.png';
import iphone12Png from 'assets/registration/iphone12.png';
import modelsPng from 'assets/registration/models.png';
import card1Svg from 'assets/registration/card_1_h5.svg';
import card2Svg from 'assets/registration/card_2_h5.svg';
import card3Svg from 'assets/registration/card_3_h5.svg';
import cryptoSvg from 'assets/registration/crypto_h5.svg';
import icon1Svg from 'assets/registration/icon_1.svg';
import icon2Svg from 'assets/registration/icon_2.svg';
import icon3Svg from 'assets/registration/icon_3.svg';
import qa1Svg from 'assets/registration/QA_ic_1.svg';
import qa2Svg from 'assets/registration/QA_ic_2.svg';
import qa3Svg from 'assets/registration/QA_ic_3.svg';
import qa4Svg from 'assets/registration/QA_ic_4.svg';
import ambcryptoSvg from 'assets/registration/Ambcrypto@2x.png';
import beincryptoSvg from 'assets/registration/Beincrypto@2x.png';
import forbesSvg from 'assets/registration/Forbes@2x.png';
import marketWatchSvg from 'assets/registration/marketwatch@2x.png';
import styles from './style.less';

const rewardBtnData = [100, '1,000', '10,000'];
const rewardData = {
  100: {
    img: iphone12Png,
    title: _tHTML('register.reward.iphone12'),
  },
  '1,000': {
    img: appleAllPng,
    title: _tHTML('register.reward.iphoneAll'),
  },
  '10,000': {
    img: modelsPng,
    title: _tHTML('register.reward.model'),
  },
};

const slides = () => {
  return [
    {
      element: <img src={forbesSvg} alt="1" className={styles.carouselImgs} />,
      title: <div className={styles.carouselTitle}>Forbes</div>,
      quote: <div className={styles.carouselQuote}>{_t('register.forbes')}</div>,
    },
    {
      element: <img src={ambcryptoSvg} alt="2" className={styles.carouselImgs} />,
      title: <div className={styles.carouselTitle}>AMBCrypto</div>,
      quote: <div className={styles.carouselQuote}>{_t('register.ambCrypto')}</div>,
    },
    {
      element: <img src={marketWatchSvg} alt="3" className={styles.carouselImgs} />,
      title: <div className={styles.carouselTitle}>MarketWatch</div>,
      quote: <div className={styles.carouselQuote}>{_t('register.marketWatch')}</div>,
    },
    {
      element: <img src={beincryptoSvg} alt="4" className={styles.carouselImgs} />,
      title: <div className={styles.carouselTitle}>BeInCrypto</div>,
      quote: <div className={styles.carouselQuote}>{_t('register.beinCrypto')}</div>,
    },
  ];
};

const Content = () => {
  const dispatch = useDispatch();
  const [reward, setReward] = useState('1,000');
  const { currentLang } = useSelector(state => state.app);
  const imgRef = useRef(null);

  const goBannerSignUp = useCallback(() => {
    // ReactGA.ga('send', 'event', 'ld', 'click', 'registerguide');
    dispatch({
      type: 'register/update',
      payload: {
        drawerSignUpOpen: true,
      }
    });
  }, [dispatch]);

  const handleReward = useCallback(item => {
    imgRef.current.className = styles.imgBox;
    setReward(item);
    setTimeout(() => {
      imgRef.current.className = classname(styles.imgBox, styles.ImgFadein);
    }, 300);
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles.rewardWrap}>
        <div className={classname(styles.title, 'wow fadeInUp')}>{_t('register.reward.title')}</div>
        <div className={classname(styles.reward, 'wow fadeInUp')}>
          <div className={styles.rewardTitle}>
            <img src={btcSvg} alt="" className={styles.btcImg} />
            {_t('register.reward.tip')}
          </div>
          <div className={styles.rewardInput}></div>
          <div className={styles.rewardTitle}>{_t('register.reward.invest')}</div>
          <div className={styles.btnGroup}>
            {rewardBtnData.map(item => (
              <div
                className={`${styles.rewardBtn} ${reward === item ? styles.rewardBtnChecked : ''}`}
                key={item}
                onClick={() => handleReward(item)}
              >
                <div>$</div>
                <div className={styles.rewardCurreny}>{item}</div>
              </div>
            ))}
          </div>
        </div>
        <img src={arrowSvg} alt="" className={classname(styles.arrowImg, 'wow fadeInUp')} />
        <div ref={imgRef} className={classname(styles.imgBox, styles.ImgFadein, 'wow fadeInUp')}>
          <div className={styles.rightTitle}>{rewardData[reward].title}</div>
          <img src={rewardData[reward].img} alt="" className={styles.rightImg} />
        </div>
      </div>

      <div className={styles.infoWrap}>
        <div className={classname(styles.title, 'wow fadeInUp')}>{_t('register.info.title')}</div>
        <div className={styles.info}>
          <div className={classname(styles.infoItem, 'wow fadeInUp')}>
            <img src={card1Svg} alt="" className={styles.infoImg} />
            <div className={styles.infoTitle}>{_t('register.info.serving')}</div>
            <div className={styles.infoContent}>{_t('register.info.services')}</div>
          </div>
          <div className={classname(styles.infoItem, 'wow fadeInUp')}>
            <img src={card2Svg} alt="" className={styles.infoImg} />
            <div className={styles.infoTitle}>{_t('register.info.crypto')}</div>
            <div className={styles.infoContent}>{_t('register.info.promising')}</div>
          </div>
          <div className={classname(styles.infoItem, 'wow fadeInUp')}>
            <img src={card3Svg} alt="" className={styles.infoImg} />
            <div className={styles.infoTitle}>{_t('register.info.trading')}</div>
            <div className={styles.infoContent}>{_t('register.info.pairs')}</div>
          </div>
        </div>
      </div>

      <div className={styles.cryptoWrap}>
        <div className={classname(styles.title, 'wow fadeInUp')}>{_t('register.journey')}</div>
        <div className={classname(styles.crypto, 'wow fadeInUp')}>
          <img src={cryptoSvg} alt="" className={styles.cryptoImg} />
          <div className={styles.cryptoItem}>
            <img src={icon1Svg} alt="" className={styles.cryptoItemImg} />
            <span onClick={goBannerSignUp}>{_tHTML('register.journey.gift')}</span>
          </div>
          <div className={styles.cryptoItem}>
            <img src={icon2Svg} alt="" className={styles.cryptoItemImg} />
            {_t('register.journey.currency')}
          </div>
          <div className={styles.cryptoItem}>
            <img src={icon3Svg} alt="" className={styles.cryptoItemImg} />
            {_t('register.journey.easy')}
          </div>
        </div>
      </div>

      <div className={styles.mediaWrap}>
        <div className={classname(styles.title, 'wow fadeInUp')}>{_t('register.say')}</div>
        <div className={classname(styles.carouselWrap, 'wow fadeInUp')}>
          <Carousel slides={slides()} isMobile={true} />
        </div>
      </div>

      <div className={styles.faqWrap}>
        <div className={classname(styles.title, 'wow fadeInUp')}>{_t('register.faq')}</div>
        <div className={classname(styles.faqItems, 'wow fadeInUp')}>
          <img src={qa1Svg} alt="" className={styles.faqImg} />
          <div>
            <div className={styles.qaTitle}>{_t('register.faq.bitcoin')}</div>
            <div className={styles.qaContent}>{_t('register.bitcoin.sub')}</div>
          </div>
        </div>
        <div className={classname(styles.faqItems, 'wow fadeInUp')}>
          <img src={qa2Svg} alt="" className={styles.faqImg} />
          <div>
            <div className={styles.qaTitle}>{_t('register.faq.safe')}</div>
            <div className={styles.qaContent}>{_t('register.safe.sub')}</div>
          </div>
        </div>
        <div className={classname(styles.faqItems, 'wow fadeInUp')}>
          <img src={qa3Svg} alt="" className={styles.faqImg} />
          <div>
            <div className={styles.qaTitle}>{_t('register.faq.start')}</div>
            <div className={styles.qaContent}>{_t('register.start.sub')}</div>
          </div>
        </div>
        <div className={classname(styles.faqItems, 'wow fadeInUp')}>
          <img src={qa4Svg} alt="" className={styles.faqImg} />
          <div>
            <div className={styles.qaTitle}>{_t('register.faq.limit')}</div>
            <div className={styles.qaContent}>{_t('register.limit.sub')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
