import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '@tools/i18n';
import storage from '@utils/storage';

import isNil from 'lodash/isNil';

import { namespace } from '../model';
import { kcsensorsManualTrack, kcsensorsClick, addLangToPath } from '../../common/tools';

import { IconDeposit } from './icons';
import { StyledGoldEntry } from './style';
import GoldEntryModal from './GoldEntryModal';

// localstorage保存是否入金过的状态
const CACHE_DEPOSIT_STATUS = 'CACHE_DEPOSIT_STATUS';

export default function GoldEntry({ inTrade, showStatus, lang }) {
  const dispatch = useDispatch();
  const [goldEntryVisible, setGoldEntryVisible] = useState(false);
  const [isFreshman, setIsFreshman] = useState(null);

  const handleGoldEntryClose = () => {
    setGoldEntryVisible(false);
  };
  const { t: _t } = useTranslation('header');
  const title = isFreshman ? _t('4tQhna6cPJmQDoY1FqtFsY') : _t('wtftNFBhtguPWTXAJQrJHe');
  const handleGoldEntryClick = () => {
    // 如果所有支付方式均不可用，则默认跳过中间页，直接进入数字币充值页面
    if (
      !window._SITE_CONFIG_.functions.fast_trade &&
      !window._SITE_CONFIG_.functions.fiat_deposit
    ) {
      kcsensorsClick(['overallNavigationDeposit', '2']);
      window.location.href = addLangToPath('/assets/coin', lang);
      return;
    }

    if (isFreshman) {
      // 点击事件、账户入金
      kcsensorsClick(['overallNavigationFunding', '1']);
      setGoldEntryVisible(true);
    } else {
      // 点击事件、充值
      kcsensorsClick(['overallNavigationDeposit', '2']);
      window.location.href = addLangToPath('/assets/coin', lang);
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
  const uid = useSelector((state) => state.user?.user?.uid);
  useEffect(() => {
    if (showStatus && uid) {
      const info = storage.getItem(CACHE_DEPOSIT_STATUS);
      // 设置6小时缓存，减少qps
      const needUpdate =
        !info || Date.now() - (info?.expired || 0) > 3600 * 6 * 1000 || uid !== +info?.uid;
      if (needUpdate) {
        dispatch({
          type: `${namespace}/getIsDeposit`,
        }).then((res) => {
          storage.setItem(CACHE_DEPOSIT_STATUS, {
            expired: Date.now(),
            isDeposit: res,
            uid,
          });
          setIsFreshman(!res);
        });
      } else {
        const { isDeposit } = storage.getItem(CACHE_DEPOSIT_STATUS);
        setIsFreshman(!isDeposit);
      }
    }
  }, [showStatus, dispatch, uid]);
  if (!showStatus) {
    return null;
  }
  return (
    <>
      <StyledGoldEntry className="nav-deposit" onClick={handleGoldEntryClick} inTrade={inTrade}>
        {/* 用svg图标，方便合伙人侧重定义图标颜色 */}
        <IconDeposit size={16} />
        <span>{title}</span>
      </StyledGoldEntry>
      {goldEntryVisible && (
        <GoldEntryModal
          open={goldEntryVisible}
          onCancel={handleGoldEntryClose}
          title={title}
          lang={lang}
        />
      )}
    </>
  );
}
