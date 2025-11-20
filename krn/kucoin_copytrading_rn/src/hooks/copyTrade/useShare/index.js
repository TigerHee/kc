import {useMemoizedFn} from 'ahooks';
import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {copyTradingBridge, showToast} from '@krn/bridge';

import {useGetFormatNumber} from 'components/Common/NumberFormat/useFormatNumber';
import {useGetUSDTCurrencyInfo} from 'hooks/useGetUSDTCurrencyInfo';
import useLang from 'hooks/useLang';
import {getNativeInfo} from 'utils/helper';
import {
  FooterTitleTransKeyBySharePostSceneType,
  SharePostSceneType,
} from './constant';
import {
  formatShareCopyTraderFollowOneTraderPnlEntity,
  formatShareCopyTraderTotalPnlEntity,
  formatShareCopyTradingPositionEntity,
  formatShareLeadTraderTotalPnlEntity,
  formatShareLeadUserInfoEntity,
} from './helper';
const {
  shareCopyTradingPosition,
  shareLeadUserInfo,
  shareLeadTraderTotalPnl,
  shareCopyTraderTotalPnl,
  shareCopyTraderFollowOneTraderPnl,
} = copyTradingBridge;

/**
 * 使用分享功能
 * @param {Object} payload - 传入的参数
 * @param {string} [payload.sharePostScene=SharePostSceneType.Common] - 分享场景类型
 * @returns {void}
 */
export const useShare = payload => {
  const {sharePostScene = SharePostSceneType.Common} = payload || {};

  const {_t} = useLang();
  const {displayPrecision} = useGetUSDTCurrencyInfo();
  const {numberFormat} = useLang();
  const formatNumberFn = useGetFormatNumber();

  const profitNumberFormat = useMemoizedFn((number, options) => {
    const {appendUnit = false} = options || {};

    return formatNumberFn(number, {
      isProfitNumber: true,
      needUSDTUnit: appendUnit,
      options: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    });
  });

  const userInfo = useSelector(state => state.app.userInfo);

  const getDownloadGuideFooterInfo = useCallback(
    async _t => {
      const NATIVE_INFO = await getNativeInfo();

      //.plus -> .com 浏览器访问
      const encodedUrl = `https://${NATIVE_INFO.webApiHost}/download`.replace(
        '.plus',
        '.com',
      );
      const footerTitle = _t(
        FooterTitleTransKeyBySharePostSceneType[sharePostScene] ||
          FooterTitleTransKeyBySharePostSceneType[SharePostSceneType.Common],
      );

      const referText = _t('myreferralcode');
      const footerDesc = userInfo?.referralCode
        ? `${referText} ${userInfo?.referralCode}`
        : _t('d10ce0096b844000afd1');

      return {
        footerTitle,
        footerDesc,
        qrCodeUrl: encodedUrl,
      };
    },
    [sharePostScene, userInfo?.referralCode],
  );

  const getFooterInfo = async () => await getDownloadGuideFooterInfo(_t);

  const handlePositionShare = async copyTradingShareInfo => {
    try {
      const entity = formatShareCopyTradingPositionEntity(
        copyTradingShareInfo,
        {
          numberFormat,
          profitNumberFormat,
        },
      );
      const footerInfo = await getFooterInfo();

      shareCopyTradingPosition(entity, footerInfo);
    } catch (error) {
      showToast(error);
      console.log('share positions error', error);
    }
  };

  const handleShareLeadUserInfo = async leadTradingInfo => {
    try {
      const entity = formatShareLeadUserInfoEntity(leadTradingInfo, {
        displayPrecision,
        profitNumberFormat,
      });
      const footerInfo = await getFooterInfo();

      shareLeadUserInfo(entity, footerInfo);
    } catch (error) {
      showToast(error);
      console.log('share shareLeadUserInfo error', error);
    }
  };

  const handleShareCopyTraderFollowOneTraderPnl = async traderInfo => {
    try {
      const entity = formatShareCopyTraderFollowOneTraderPnlEntity(traderInfo, {
        displayPrecision,
        profitNumberFormat,
      });

      const footerInfo = await getFooterInfo();
      shareCopyTraderFollowOneTraderPnl(entity, footerInfo);
    } catch (error) {
      showToast(error);
      console.log('share handleShareCopyTraderFollowOneTraderPnl error', error);
    }
  };
  const handleShareLeadTraderTotalPnl = async traderPnlInfo => {
    try {
      const entity = formatShareLeadTraderTotalPnlEntity(traderPnlInfo, {
        displayPrecision,
        profitNumberFormat,
      });
      const footerInfo = await getFooterInfo();
      shareLeadTraderTotalPnl(entity, footerInfo);
    } catch (error) {
      showToast(error);
      console.log('share handleShareLeadTraderTotalPnl error', error);
    }
  };
  const handleShareCopyTraderTotalPnl = async traderPnlInfo => {
    try {
      const entity = formatShareCopyTraderTotalPnlEntity(traderPnlInfo, {
        displayPrecision,
        profitNumberFormat,
      });
      const footerInfo = await getFooterInfo();
      shareCopyTraderTotalPnl(entity, footerInfo);
    } catch (error) {
      showToast(error);
      console.log('share handleShareCopyTraderTotalPnl error', error);
    }
  };
  return {
    handlePositionShare,
    handleShareLeadUserInfo,
    handleShareCopyTraderFollowOneTraderPnl,
    handleShareLeadTraderTotalPnl,
    handleShareCopyTraderTotalPnl,
  };
};
