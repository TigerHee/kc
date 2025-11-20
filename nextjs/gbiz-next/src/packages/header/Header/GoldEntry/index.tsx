import React, { useEffect, useState, FC } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'tools/i18n';
import storage from 'tools/storage';
import addLangToPath from 'tools/addLangToPath';

import isNil from 'lodash-es/isNil';

import { kcsensorsManualTrack, kcsensorsClick } from '../../common/tools';

import { IconDeposit } from './icons';
import GoldEntryModal from './GoldEntryModal';
import { useHeaderStore } from '../model';
import styles from './styles.module.scss';
import { bootConfig } from 'kc-next/boot';
import { useLang } from 'hooks';

// localstorage保存是否入金过的状态
const CACHE_DEPOSIT_STATUS = 'CACHE_DEPOSIT_STATUS';

interface GoldEntryProps {
  inTrade?: boolean;
  navStatus: number;
}

const GoldEntry: FC<GoldEntryProps> = ({ inTrade, navStatus }) => {
  const [goldEntryVisible, setGoldEntryVisible] = useState(false);
  const [isFreshman, setIsFreshman] = useState<boolean>(false);
  const { currentLang } = useLang();

  const handleGoldEntryClose = () => {
    setGoldEntryVisible(false);
  };
  const { t: _t } = useTranslation('header');
  const title = isFreshman ? _t('4tQhna6cPJmQDoY1FqtFsY') : _t('wtftNFBhtguPWTXAJQrJHe');
  const handleGoldEntryClick = () => {
    // 如果所有支付方式均不可用，则默认跳过中间页，直接进入数字币充值页面
    if (!bootConfig._SITE_CONFIG_.functions.fast_trade && !bootConfig._SITE_CONFIG_.functions.fiat_deposit) {
      kcsensorsClick(['overallNavigationDeposit', '2']);
      window.location.href = addLangToPath('/assets/coin');
      return;
    }

    if (isFreshman) {
      // 点击事件、账户入金
      kcsensorsClick(['overallNavigationFunding', '1']);
      setGoldEntryVisible(true);
    } else {
      // 点击事件、充值
      kcsensorsClick(['overallNavigationDeposit', '2']);
      window.location.href = addLangToPath('/assets/coin');
    }
  };
  useEffect(() => {
    // 判断totalAssets和recharged是否获取到，当状态没挂载时这两个值都是undefined，当状态没有请求回来时，这两个状态的默认值都是null
    if (!isNil(isFreshman)) {
      if (isFreshman) {
        // 曝光事件、账户入金
        kcsensorsManualTrack(['overallNavigation', '1']);
      } else {
        // 曝光事件、充值
        kcsensorsManualTrack(['overallNavigation', '2']);
      }
    }
  }, [isFreshman]);
  const uid = useHeaderStore(state => state.userInfo?.uid);

  const getIsDeposit = useHeaderStore(state => state.getIsDeposit);

  useEffect(() => {
    if (uid) {
      const info = storage.getItem(CACHE_DEPOSIT_STATUS);
      // 设置6小时缓存，减少qps
      const needUpdate = !info || Date.now() - (info?.expired || 0) > 3600 * 6 * 1000 || uid !== +info?.uid;
      if (needUpdate) {
        getIsDeposit?.().then(res => {
          storage.setItem(
            CACHE_DEPOSIT_STATUS,
            JSON.stringify({
              expired: Date.now(),
              isDeposit: res,
              uid,
            })
          );
          setIsFreshman(!res);
        });
      } else {
        const { isDeposit } = storage.getItem(CACHE_DEPOSIT_STATUS);
        setIsFreshman(!isDeposit);
      }
    }
  }, [uid]);

  return (
    <>
      <button
        className={clsx('nav-deposit', styles.styledGoldEntry, inTrade && styles.styledGoldEntryInTrade)}
        onClick={handleGoldEntryClick}
        style={{ display: navStatus > 3 ? 'none' : 'flex' }}
      >
        {/* 用svg图标，方便合伙人侧重定义图标颜色 */}
        <IconDeposit size={16} />
        <span>{title}</span>
      </button>
      {goldEntryVisible && (
        <GoldEntryModal open={goldEntryVisible} onCancel={handleGoldEntryClose} title={title} lang={currentLang} />
      )}
    </>
  );
};

export default GoldEntry;
