/**
 * GuidanceButton 组件完善版
 * 结合首页 Banner/index.js 的业务逻辑，补全用户状态判断与跳转、埋点等功能
 */
import useTranslation from '@/hooks/useTranslation';
import { addLangToPath } from '@/tools/i18n';
import { Button, type TButtonType } from '@kux/design';
import { ArrowRight2Icon } from '@kux/iconpack';
import sensors from 'gbiz-next/sensors';
import React from 'react';

import useGuidanceButtonStatus from './hooks/useButtonStatus';
import styles from './index.module.scss';
import { GuidanceStatus, PositionType } from './types';
import { getGuidanceConfig } from './utils';
import clsx from 'clsx';

type Props = {
  positionType?: PositionType;
};

const GuidanceButton: React.FC<Props> = ({ positionType = PositionType.Banner }) => {
  const { t } = useTranslation();

  const { guidanceStatus } = useGuidanceButtonStatus();

  const guidanceConfig = getGuidanceConfig(guidanceStatus, t);

  const handleClick = () => {
    sensors.trackClick(guidanceConfig?.spm, guidanceConfig?.data);
    window.location.href = addLangToPath(guidanceConfig?.path);
  };

  const handleBuyCrypto = () => {
    sensors.trackClick(['buyCrypto', '1'], { after_page_id: 'B7FastTrade', norm_version: 1 });
    window.location.href = addLangToPath('/express');
  };

  const isQuickStart = positionType === PositionType.QuickStart;
  const endIcon = isQuickStart ? <ArrowRight2Icon rtl /> : null;
  const btnClassName = isQuickStart ? styles.quickStartBtn : styles.guidanceBtn;
  let btnType: TButtonType = isQuickStart ? 'outlined' : 'primary';
  const sizeType = isQuickStart ? 'large' : 'huge';

  if (guidanceStatus === GuidanceStatus.needDeposit) {
    // 底部快速启动要用 primary类型
    if (isQuickStart) {
      btnType = 'primary';
    }
    // 已登录但无资产，显示充值和买币按钮
    return (
      <div className={clsx([styles.guidanceBtnBox, 'guidance-button'])}>
        <Button
          size={sizeType}
          type={btnType}
          endIcon={endIcon}
          className={btnClassName}
          onClick={handleBuyCrypto}
          data-inspector="inspector_home_banner_buy_crypto"
        >
          {t('kfyiMmJw1FUGmayepmW5aT')}
        </Button>
        <Button
          size={sizeType}
          type="outlined"
          endIcon={endIcon}
          className={btnClassName}
          onClick={handleClick}
          data-inspector="inspector_home_banner_deposit"
        >
          {guidanceConfig?.text}
        </Button>
      </div>
    );
  }

  return (
    <Button
      size={sizeType}
      type={btnType}
      endIcon={endIcon}
      className={clsx({
        [btnClassName]: true,
        'guidance-button': true,
        [styles.signupButton]: guidanceStatus === GuidanceStatus.needSignup,
      })}
      onClick={handleClick}
    >
      {guidanceConfig?.text}
    </Button>
  );
};

export default GuidanceButton;
