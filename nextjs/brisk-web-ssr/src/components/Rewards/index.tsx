import { homePageInfoUsingGet1 } from '@/api/platform-reward/sdk.gen';
import { SignUpSubTitleV2EntryVo } from '@/api/platform-reward/types.gen';
import sensors from 'gbiz-next/sensors';
import useTranslation from '@/hooks/useTranslation';
import dollarCashDarkSvg from '@/static/rewards/dollar-cash-circle-dark.svg';
import dollarCashSvg from '@/static/rewards/dollar-cash-circle.svg';
import { useUserStore } from '@/store/user';
import { addLangToPath } from '@/tools/i18n';
import { Button, useResponsive } from '@kux/design';
import useTheme from '@/hooks/useTheme';
import { BonusIcon, CouponsIcon, TetherIcon } from '@kux/iconpack';
import { useEffect, useRef, useState } from 'react';
import AnimatedContent from '../CommonComponents/Animations/AnimatedContent';
import { calculateDelayTime } from '../CommonComponents/Animations/AnimatedContent/utils';
import LazyVideo from '../CommonComponents/LazyVideo';
import styles from './styles.module.scss';

import videoSrcDark from '@/static/coin_dark.webm';
import videoSrcLight from '@/static/coin.webm';

import rewardImg from '@/static/rewards/reward.png';
import rewardImgDark from '@/static/rewards/reward-dark.png';
import { manualTrack } from '@/tools/ga';

// const REWARD_TYPE = {
//   10: 'USDT', // 现金
//   20: 'COUPON', // 卡券
//   30: 'EXP_AMOUNT', // 体验金
//   40: 'OTHER', // 其他
// };

const REWARD_TYPE = [10, 20, 30, 40];

const Rewards = () => {
  const { theme } = useTheme();
  const isLogin = useUserStore(state => state.isLogin);

  const [list, setList] = useState<SignUpSubTitleV2EntryVo[]>([]);

  const { t } = useTranslation();

  const size = useResponsive();
  const textAreaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isSm = size === 'sm';
  const isMd = size === 'md';

  const videoPoster = theme === 'light' ? rewardImg : rewardImgDark;
  const otherIcon = theme === 'light' ? dollarCashDarkSvg : dollarCashSvg;
  const videoSrc = theme === 'light' ? videoSrcLight : videoSrcDark;

  // 动态设置 content::after 的宽度，为了实现中屏模糊效果
  const updateAfterWidth = () => {
    if (textAreaRef.current && contentRef.current) {
      const textAreaWidth = textAreaRef.current.offsetWidth;
      contentRef.current.style.setProperty('--after-width', `${textAreaWidth}px`);
    }
  };

  useEffect(() => {
    if (isSm) {
      return;
    }

    const handleResize = () => {
      updateAfterWidth();
    };
    updateAfterWidth();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSm, list]);

  useEffect(() => {
    // 请求接口数据
    homePageInfoUsingGet1()
      .then(res => {
        const subTitleV2 = res?.data?.taskList?.find(i => i.taskType === 'SIGN_UP')?.subTitleV2;
        // 1. 数据按 item.couponType 从小到大排序
        // 2. 只选择在 REWARD_TYPE 范围内的数据
        // 3. 数据截断最多三个
        const data = subTitleV2
          ?.sort((a, b) => a.couponType! - b.couponType!)
          .filter(i => REWARD_TYPE.includes(i.couponType!))
          ?.slice(0, 3);
        setList(data || []);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    manualTrack(['homepageWatchFullFilm', '1']);
  }, []);

  if (isLogin) {
    return null;
  }

  const getIcon = (type: number) => {
    switch (type) {
      case 10:
        return <TetherIcon />;
      case 20:
        return <CouponsIcon />;
      case 30:
        return <BonusIcon />;
      default:
        return <img src={otherIcon} alt="icon" />;
    }
  };
  // 小屏不用延时,直接渐出
  const videoDelay = isSm || isMd ? 0 : 0.6;

  return (
    <section className={styles.container}>
      <div ref={contentRef} className={styles.content}>
        <AnimatedContent className={styles.videoBox} delay={videoDelay}>
          <LazyVideo
            className={styles.video}
            src={videoSrc}
            poster={videoPoster}
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
          />
        </AnimatedContent>
        <div ref={textAreaRef} className={styles.textArea}>
          <AnimatedContent delay={0.2}>
            <div className={styles.desc}>{t('5200ae88b39b4800aa49')}</div>
            <h2 className={styles.title}>{t('cd20555ff0d34800a462')}</h2>
          </AnimatedContent>
          <div>
            <div className={styles.items}>
              {list.map((item, index) => {
                const delay = calculateDelayTime(index, 0.1, 0.3);
                return (
                  <AnimatedContent className={styles.item} key={item.couponType} delay={delay}>
                    <span className={styles.icon}>{getIcon(item.couponType!)}</span>
                    <a
                      href={addLangToPath('/land/KuRewards')}
                      rel="noopener noreferrer"
                      target="_blank"
                      className={styles.text}
                    >
                      {item.subTitle}
                    </a>
                  </AnimatedContent>
                );
              })}
            </div>
          </div>
          <AnimatedContent delay={0.6}>
            <Button
              size={isSm ? 'large' : 'huge'}
              type="primary"
              block={isSm}
              onClick={() => {
                sensors.trackClick(['homepageSignUpNow', '1'], {});
                window.open(addLangToPath('/ucenter/signup'), '_blank');
              }}
            >
              {t('b3a4a4d825484000ac36')}
            </Button>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
};

export default Rewards;
