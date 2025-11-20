/**
 * Owner: jacky@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitSiteTransfer } from 'src/services/user_transfer';
import { _t } from 'src/tools/i18n';
import { trackClick } from 'src/utils/ga';
import sessionStorage from 'utils/sessionStorage';
import NetErrorDialog from '../../Entry/NetErrorDialog';
import { useMessageErr } from '../../utils/message';
import { getOriginSiteType, getTargetSiteType, isAT } from '../../utils/site';
import { checkIsAppMigrationContainer } from '../../utils/url';
import AwaitContainer from '../AwaitContainer';
import AssetsTax from './AssetsTax';
import { FORBID_STATUS, PROCESS_CONTENT_TYPE, SKIP_STATUS } from './constants';
import OneClickProcess from './OneClickProcess';
import { getOneClickPromiseList, isDone } from './utils';

const namespace = 'userTransfer';

export default function OneClickProcessContainer({ onBack }) {
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
  const [assetsCostInfo, setAssetsCostInfo] = useState(null);
  const [allCardData, setAllCardData] = useState([]);
  const dispatch = useDispatch();
  const errorMessage = useMessageErr();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetch, setIsFetch] = useState(true);
  const isApp = JsBridge.isApp();
  const [showRetry, setShowRetry] = useState(false);
  const [contentType, setContentType] = useState(PROCESS_CONTENT_TYPE.checking);
  // const [showAssetError, setShowAssetError] = useState(false);

  const targetSiteType = useSelector((state) =>
    getTargetSiteType(state.userTransfer?.userTransferInfo, state.userTransfer?.userTransferStatus),
  );
  const originalSiteType = getOriginSiteType();
  const handleFetchCardData = async () => {
    const promiseList = getOneClickPromiseList(targetSiteType, originalSiteType);
    try {
      setIsFetch(true);
      const allData = await Promise.all(promiseList);
      setAllCardData(allData);
    } catch (error) {
    } finally {
      setIsFetch(false);
    }
  };

  const toAssetsTax = () => {
    setContentType(PROCESS_CONTENT_TYPE.assetsTax);
  };

  const handleContinue = async () => {
    setShowRetry(false);
    // migrationErrorPage
    const targetSiteType = userTransferInfo?.targetSiteType;
    try {
      const { data, success } = await submitSiteTransfer({
        targetSiteType,
        targetRegion: userTransferInfo?.targetRegion,
      });
      if (success && data) {
        // 如果处于重新迁移，则在这里把重新迁移标识去除，由后端接管迁移状态
        sessionStorage.removeItem('ucenter_web_transfer_retry');
        // setBtnText(_t('e28aa8b229824800a2eb'));
        if (isApp && !checkIsAppMigrationContainer()) {
          // app端如果不是在【迁移容器】下，需要跳至【迁移容器】打开，并且停止当前容器的轮询
          JsBridge.open({
            type: 'jump',
            params: { url: '/site/waitMigration?from=h5' },
          });
        }
      } else {
        if (success) {
          // 后端逻辑: 如果已经有一个提单记录未完成时，后续提单将会失败。此时前端需要删除卡点，查询状态
          sessionStorage.removeItem('ucenter_web_transfer_retry');
        }

        setShowRetry(true);
      }
      trackClick(['migrationErrorPage', 'buttonRetry'], {
        user_target_siteType: targetSiteType,
        clickStatus: 'retry_success',
      });
      return { data, success };
    } catch (error) {
      setShowRetry(true);
      trackClick(['migrationErrorPage', 'buttonRetry'], {
        user_target_siteType: targetSiteType,
        clickStatus: 'retry_failure',
      });
      return { success: false, data: null };
    }
  };

  const fetchAssetsCost = async (userTransferInfo) => {
    const { originalSiteType, targetSiteType, targetRegion } = userTransferInfo || {};
    const params = { originalSiteType, targetSiteType, targetRegion, bizType: 'SITE_TRANSFER' };
    const res = await dispatch({ type: `${namespace}/queryUserAssetCost`, payload: params });
    return res;
  };

  // 奥地利用户迁移需要检查最新的资产数据
  const checkIsNeedTax = async () => {
    try {
      if (isAT(userTransferInfo)) {
        // 如果store数据 needToClearData=true 或者 存在资产需要填税时, 将切换页面到资产填报页面
        if (assetsCostInfo?.needToClearData || assetsCostInfo?.assetCostItemList?.length > 0) {
          toAssetsTax();
          return false;
        }
        setIsLoading(true);
        const res = await fetchAssetsCost(userTransferInfo);
        const { success, data } = res || {};
        // 请求失败显示失败弹窗
        if (!success) {
          errorMessage(_t('68a1f352e1dd4000a867'));
          toAssetsTax();
          return false;
        }
        const { needToClearData, assetCostItemList = [] } = data || {};
        setAssetsCostInfo(data);
        // 当需要透传 needToClearData 或者 存在资产需要填税时将切换页面
        if (needToClearData || assetCostItemList.length > 0) {
          toAssetsTax();
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('show checkIsNeedTax error:', error);
      errorMessage(_t('68a1f352e1dd4000a867'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryUserAssetCost = async (userTransferInfo) => {
    const res = await fetchAssetsCost(userTransferInfo);
    // 请求失败显示失败弹窗
    if (!res.success) {
      // setShowAssetError(true);
      return false;
    }
    setAssetsCostInfo(res.data);
    // 只对成功情况进行处理
    return true;
  };

  // 拉取数据逻辑
  useEffect(() => {
    // 默认会在检查页的时候请求一次【六项处理数据】
    if (targetSiteType) {
      handleFetchCardData();
    }

    // 奥地利用户触发一次资产填报数据拉取
    if (isAT(userTransferInfo)) {
      handleQueryUserAssetCost(userTransferInfo);
    }
  }, [targetSiteType]);

  const initProgress = allCardData.map((res) => (isDone(res?.data) ? SKIP_STATUS : FORBID_STATUS));
  const isAllComplete =
    initProgress.every((status) => status === SKIP_STATUS) && initProgress.length > 0;

  // 处理组件展示的内容类型
  const handleContentType = () => {
    // 检查页: 正在请求或者请求失败的状态, 或者不用资产填报并且完成六项的状态
    let type = PROCESS_CONTENT_TYPE.checking;
    if (isFetch || showRetry) {
      type = PROCESS_CONTENT_TYPE.checking;
    } else if (!isAllComplete) {
      // 处理页: 存在未完成的项
      type = PROCESS_CONTENT_TYPE.resolveBizData;
    } else if (
      isAT(userTransferInfo) &&
      (assetsCostInfo?.needToClearData ||
        !assetsCostInfo?.assetCostItemList ||
        assetsCostInfo?.assetCostItemList?.length > 0)
    ) {
      // 资产填报页: 奥地利用户，在完成处理页业务后访问,
      type = PROCESS_CONTENT_TYPE.assetsTax;
    }

    setContentType(type);
  };

  useEffect(() => {
    // 处理页面展示的内容类型
    handleContentType();
    if (
      isAllComplete &&
      !isFetch &&
      (!isAT(userTransferInfo) || assetsCostInfo?.assetCostItemList?.length === 0)
    ) {
      // 如果所有处理项都完成，且不用填报资产，则直接跳到迁移页
      handleContinue();
    }
    return () => {
      setShowRetry(false);
    };
  }, [isFetch, allCardData, assetsCostInfo]);

  // 依据业务场景显示对应处理界面
  const map = {
    [PROCESS_CONTENT_TYPE.resolveBizData]: (
      <OneClickProcess onBack={onBack} initProgress={initProgress} onContinue={checkIsNeedTax} />
    ),
    [PROCESS_CONTENT_TYPE.assetsTax]: (
      <AssetsTax onBack={onBack} handleRetry={handleQueryUserAssetCost} isLoading={isLoading} />
    ),
    [PROCESS_CONTENT_TYPE.checking]: <AwaitContainer title={_t('8d6f469dcca34800aac6')} />,
  };

  const ProcessContent = map[contentType];

  return (
    <>
      {ProcessContent}
      {/* 提交迁移失败弹窗 */}
      <NetErrorDialog
        open={showRetry}
        onCancel={() => setShowRetry(false)}
        onRetry={handleContinue}
      />
    </>
  );
}
