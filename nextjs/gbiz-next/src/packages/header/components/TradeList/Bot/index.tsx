/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useEffect, type FC } from 'react';
import { useTheme, Loading } from '@kux/design';
import isEmpty from 'lodash-es/isEmpty';
import useLang from 'hooks/useLang';
import { useTranslation } from 'tools/i18n';
import { blendColors, fade } from 'tools/colorManipulator';
import addLangToPath from 'tools/addLangToPath';
import { getBotList } from './config';
import { kcsensorsManualTrack, kcsensorsClick } from '../../../common/tools';
import { TRADETYPE_MAP } from '../config';
import parentStyles from '../styles.module.scss';
import styles from './styles.module.scss';
import { useHeaderStore } from 'packages/header/Header/model';
import clsx from 'clsx';
import { usePageProps } from 'provider/PageProvider';

const handleStopPropagation: React.MouseEventHandler<HTMLDivElement> = event => {
  // 阻止事件冒泡，元素点击切换tab会冒泡到父级元素,会调用onSubMenuVisibleChange
  event.stopPropagation();
};

interface BotProps {
  lang: string;
  parentRef: React.RefObject<HTMLDivElement>;
  hostConfig: any;
  className?: any;
}

const Bot: FC<BotProps> = props => {
  const machineMap = useHeaderStore(store => store.machineMap);
  const getBotLists = useHeaderStore(store => store.getBotLists);
  const { lang, parentRef, hostConfig, className = '' } = props;
  const { t } = useTranslation('header');
  const { isRTL } = useLang();
  const theme = useTheme();
  const [wrapperHeight, setWapperHeight] = useState(288);

  useEffect(() => {
    getBotLists?.();
  }, []);

  useEffect(() => {
    const navOverlay = parentRef.current;
    if (navOverlay) {
      const height = navOverlay.offsetHeight;
      setWapperHeight(height);
    }
    kcsensorsManualTrack(['navigationDropDownBotList', '1'], {
      postTitle: TRADETYPE_MAP.TRADING_BOT,
      pagecate: 'navigationDropDownList',
    });
  }, []);

  const handler = bot => {
    kcsensorsClick(['navigationBotList', '1'], {
      id: bot.id,
      postTitle: bot.key,
      pagecate: 'navigationDropDownList',
    });
  };
  return (
    <div
      className={clsx([parentStyles.wrapper, className])}
      onClick={handleStopPropagation}
      style={{
        background: 'var(--kux-textEmphasis)',
      }}
    >
      <div className={styles.clipScrollerBar}>
        <div className={styles.scroller} style={{ maxHeight: wrapperHeight }}>
          {isEmpty(machineMap) ? (
            <Loading className={styles.MSpin} type="brand" size="medium" />
          ) : (
            getBotList(machineMap).map(bot => {
              return (
                <a
                  key={bot.name}
                  className={styles.botItem}
                  onClick={() => handler(bot)}
                  href={addLangToPath(`${hostConfig.KUCOIN_HOST}${bot.href}`)}
                >
                  <div className={styles.flex}>
                    <img src={theme === 'light' ? bot.iconLight : bot.iconDark} className={styles.avatar} />
                    <span className={styles.name}>{t(bot.name)}</span>
                  </div>
                  <div className={styles.note}>{t(bot.note)}</div>
                </a>
              );
            })
          )}
        </div>
      </div>

      {/* wtf!!! 用于堵border-radius */}
      {/* <div
        className={styles.tradeListBlank1}
        style={{
          background: isRTL
            ? // @ts-ignore
              blendColors('var(--kux-textEmphasis)', fade('var(--kux-cover)', 0.02))
            : 'var(--color-layer)',
        }}
      />
      <div
        className={styles.tradeListBlank2}
        style={{
          background: isRTL
            ? // @ts-ignore
              blendColors('var(--kux-textEmphasis)', fade('var(--kux-cover)', 0.02))
            : 'var(--color-layer)',
        }}
      />*/}
    </div>
  );
};

export default Bot;
