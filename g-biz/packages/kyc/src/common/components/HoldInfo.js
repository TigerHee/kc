/**
 * Owner: iron@kupotech.com
 */
import React, { useMemo } from 'react';
import { useTheme } from '@kufox/mui';
import { useTranslation, Trans } from '@tools/i18n';
import { includes } from 'lodash';
import { useStyle } from './style.js';
import KycImgGuide from './KycImgGuide';

const HoldInfo = ({ code, realName, date, currentLang }) => {
  const theme = useTheme();
  const classes = useStyle({ color: theme.colors });
  const kycName = realName || '';
  const { t: _t } = useTranslation('kyc');

  const handPhotoTipTransComps = useMemo(() => {
    // Trans翻译组件，如果要带样式，需指定每部分span标签的位置，暂时这样分语言处理
    const specialLang = ['bn_BD', 'hi_IN', 'ja_JP', 'ko_KR', 'tr_TR'];
    if (includes(specialLang, currentLang)) {
      return [
        <span css={classes.warnTxt}>身分証明書</span>,
        null,
        <span css={classes.warnTxt}>手書きのメモ</span>,
        null,
        <span css={classes.warnTxt}>ご自身の顔が写っている必要があります</span>,
      ];
    }
    return [
      null,
      <span className={classes.warnTxt}>证件</span>,
      null,
      <span className={classes.warnTxt}>手写便笺</span>,
      null,
      <span className={classes.warnTxt}>清晰正脸照</span>,
    ];
  }, [currentLang]);

  return (
    <div css={classes.info}>
      <div css={classes.neededAssign}>
        <div css={classes.assignTip}>
          <Trans
            i18nKey="account.kyc.kyc2.handPhoto.tip"
            ns="kyc"
            components={handPhotoTipTransComps}
          />
        </div>
        <div css={classes.neededAssetsTip}>{_t('account.kyc.kyc2.neededAssets.tip')}</div>
        <div css={classes.neededAssetsItem}>
          <div css={classes.neededItemsPrefix} />
          {_t('account.kyc.kyc2.neededAssets.item1')}
          {kycName && (
            <>
              <span>&nbsp;“</span>
              <span css={classes.tipColor}>{kycName}</span>
              <span>“</span>
            </>
          )}
        </div>
        <div css={classes.neededAssetsItem} style={{ margin: '4px 0' }}>
          <div css={classes.neededItemsPrefix} />
          {_t('account.kyc.kyc2.neededAssets.item2')}
          <span>&nbsp;“</span>
          <span css={classes.tipColor}>{code}</span>“
        </div>
        <div css={classes.neededAssetsItem}>
          <div css={classes.neededItemsPrefix} />
          {_t('account.kyc.kyc2.neededAssets.item3')}
          <span>&nbsp;“</span>
          <span css={classes.tipColor}>{date}</span>“
        </div>
      </div>
      <KycImgGuide />
    </div>
  );
};

export default HoldInfo;
