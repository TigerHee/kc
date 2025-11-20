/**
 * Owner: tiger@kupotech.com
 */
import { useState, useMemo, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import { cloneDeep, isEqual } from 'lodash';
import loadable from '@loadable/component';
import { useSnackbar, useTheme, useResponsive } from '@kux/mui';
import JsBridge from '@tools/bridge';
import addLangToPath from '@tools/addLangToPath';
import storage from '@utils/storage';
import { kcsensorsClick, kcsensorsManualTrack } from '@packages/kyc/src/common/tools';
import useLang from '@packages/kyc/src/hookTool/useLang';
import useDebounceFn from '@kycCompliance/hooks/useDebounceFn';
import MobileSteps from '@kycCompliance/components/Steps/MobileSteps';
import { StyledSpin } from '@kycCompliance/components/commonStyle';
import {
  postJsonWithPrefix,
  GetComplianceFlow,
  GetTransactionSettings,
  getFlowConfig,
  setSiteType,
} from './service';
import * as config from './config';
import { Wrapper, Main } from './style';
import { CommonContext } from './context';

// 服务异常提示
const SystemError = loadable(() => import('./components/SystemError'));
// 懒加载page组件
const FormPage = loadable(() => import('./components/FormPage'));
const IdentityReadyPage = loadable(() => import('./components/IdentityReadyPage'));
const JumioPage = loadable(() => import('./components/JumioPage'));
const SumsubPage = loadable(() => import('./components/SumsubPage'));
const SubmitResultPage = loadable(() => import('./components/SubmitResultPage'));
const QuestionPage = loadable(() => import('./components/QuestionPage'));
// TH 专属
const NDIDAgreementPage = loadable(() => import('./components/NDIDPage/AgreementPage'));
const NDIDIDPPage = loadable(() => import('./components/NDIDPage/IDPPage'));
const NDIDPendingPage = loadable(() => import('./components/NDIDPage/PendingPage'));
// TR 专属
const VideoGuidePage = loadable(() => import('./components/TR/VideoGuidePage'));
// AU 专属
const AUTermsPage = loadable(() => import('./components/AU/TermsPage'));
const AUQuestionTipPage = loadable(() => import('./components/AU/QuestionTipPage'));
const AUQuestionPage = loadable(() => import('./components/AU/QuestionPage'));
// EU
const EUTermsPage = loadable(() => import('./components/EU/TermsPage'));
const EUCraLoading = loadable(() => import('./components/EU/CraLoading'));
const EUQuestionPage = loadable(() => import('./components/EU/QuestionPage'));
const TermsV2Page = loadable(() => import('./components/EU/TermsV2Page'));

const query = config.searchToJson();
const useObjectMemo = (obj) => useMemo(() => obj, Object.values(obj));

const PageObj = {
  [config.IdentityReadyPageCode]: IdentityReadyPage,
  [config.JumioPagePageCode]: JumioPage,
  [config.SubmitResultPageCode]: SubmitResultPage,
  [config.questionPageCode1]: QuestionPage,
  [config.questionPageCode2]: QuestionPage,
  [config.sumsubPageCode]: SumsubPage,
  [config.sumsubVideoPageCode]: SumsubPage,
  [config.sumsubPoaPageCode]: SumsubPage,
  [config.NDIDAgreementPageCode]: NDIDAgreementPage,
  [config.NDIDIDPPageCode]: NDIDIDPPage,
  [config.NDIDPendingPageCode]: NDIDPendingPage,
  [config.TRVideoGuidePageCode]: VideoGuidePage,
  [config.AUTermsPageTemplateCode]: AUTermsPage,
  [config.AUQuestionTipPageTemplateCode]: AUQuestionTipPage,
  [config.AUQuestionPageTemplateCode]: AUQuestionPage,
  [config.EUTermsPageTemplateCode]: EUTermsPage,
  [config.EUCraLoadingPageCode]: EUCraLoading,
  [config.EUQuestionPageTemplateCode]: EUQuestionPage,
  [config.EUTermsV2PageTemplateCode]: TermsV2Page,
  default: FormPage,
};

export default ({
  isInDialog,
  onSetDialogData = () => {},
  onCancel = () => {},
  onOk = () => {},
  complianceType,
  extraContent = null,
  hideFormFooterPreBtn, // 隐藏弹窗 footer 的 pre 按钮
  siteType,
}) => {
  const { _t } = useLang();
  const { message } = useSnackbar();
  const inApp = JsBridge.isApp();
  const { setTheme } = useTheme();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const [flowData, setFlowData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isShowErr, setShowErr] = useState(false);
  // 当前 page index
  const [curPage, setCurPage] = useState(-1);
  // 缓存的表单数据
  const [formData, setFormData] = useState({});
  // step数据
  const [stepData, setStepData] = useState({});
  // 不能进行流程的错误 msg
  const [errMsg, setErrMsg] = useState('');
  // 缓存ocr数据
  const [ocrData, setOcrData] = useState({});
  // page内部接口返回的pageElements
  const [innerPageElements, setInnerPageElements] = useState({});
  // 问卷页面 - 记分问卷步骤
  const [scoreStep, setScoreStep] = useState(1);
  // 存放一些页面间传递的额外数据
  const [crossPageData, setCrossPageData] = useState({});
  // 当前操作是否为下一步
  const [isNextAction, setNextAction] = useState(true);

  // 拉取流程数据
  const initData = async (restart = false) => {
    setLoading(true);
    setShowErr(false);
    setSiteType(siteType || query?.siteType || null);
    const complianceStandardAlias = complianceType || query?.complianceType || 'kucardStandard';
    try {
      if (!restart) {
        kcsensorsClick(['KYCComplianceInit', '1'], {
          kyc_standard: complianceStandardAlias,
        });
      }

      const flowConfig = await getFlowConfig({
        complianceStandardAlias,
      });
      const preRes = await postJsonWithPrefix(flowConfig?.data?.flowBeforeApi, {
        complianceStandardAlias,
        source: config.getSource({ inApp, isInDialog }),
      });
      const transactionId = preRes?.data?.transactionId;
      const transSettingRes = await GetTransactionSettings({ transactionId });
      const includeMetaAliasList = transSettingRes?.data?.settings?.includeMetaAliasList || [];
      const metadataList = transSettingRes?.data?.metadataList || [];

      GetComplianceFlow({ complianceStandardAlias, transactionId: preRes?.data?.transactionId })
        .then(async (res) => {
          if (res?.success) {
            const info = res?.data?.flowRenderInfo || {};
            const { pages, lastPageId } = info;
            initFormData(pages, metadataList);
            setFlowData(info);

            const realPages = cloneDeep(pages)
              .map((item) => {
                const { componentGroups } = item;
                if (!componentGroups) {
                  return item;
                }

                const componentGroups_new = componentGroups.map((componentGroupItem) => {
                  return {
                    ...componentGroupItem,
                    components: componentGroupItem.components.filter(({ complianceMetaAlias }) => {
                      if (includeMetaAliasList?.length === 0) {
                        return true;
                      }
                      return includeMetaAliasList.includes(complianceMetaAlias);
                    }),
                  };
                });
                return { ...item, componentGroups: componentGroups_new };
              })
              .filter(({ componentGroups }) => {
                if (!componentGroups) {
                  return true;
                }
                if (componentGroups && componentGroups?.components?.length === 0) {
                  return false;
                }
                return !componentGroups.every((i) =>
                  i?.components?.every((j) => j.isDisplay === 0),
                );
              });

            if (pages?.length >= 0) {
              setFlowData({
                ...info,
                ...flowConfig?.data,
                transactionId,
                pages: realPages,
                complianceStandardAlias,
                settings: transSettingRes?.data?.settings || {},
              });

              const lastTimeIndex = lastPageId
                ? realPages.findIndex((i) => i.pageId === lastPageId) + 1
                : 0;
              setCurPage(restart ? 0 : lastTimeIndex);
            }
          }
        })
        .catch((err) => {
          setShowErr(true);
          if (err?.msg) {
            message.error(err?.msg);
            setErrMsg(err?.msg);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      const msg = error?.msg || error.message;
      if (msg) {
        message.error(msg);
      }
    }
  };

  // 根据flowData缓存接口返回的表单数据
  const initFormData = (pages, initFormData) => {
    const obj = {};
    initFormData.forEach(({ metaCode, metaAlias, metaData }) => {
      if (metaCode) {
        obj[metaCode] = metaData;
      }
      if (metaAlias) {
        obj[metaAlias] = metaData;
      }
    });
    pages?.forEach(({ componentGroups }) => {
      componentGroups?.forEach(({ components }) => {
        components?.forEach(
          ({
            componentCode,
            complianceMetaCode,
            complianceMetaData,
            componentDefaultMetaData,
            complianceMetaAlias,
          }) => {
            const val = complianceMetaData || componentDefaultMetaData;
            if (val) {
              obj[complianceMetaCode] = val;
              if (componentCode) {
                obj[componentCode] = val;
              }
              if (complianceMetaAlias) {
                obj[complianceMetaAlias] = val;
              }
            }
          },
        );
      });
    });
    onCacheFormData(obj);
  };

  // 初始化flow数据
  useEffect(() => {
    initData();
  }, []);

  // 隐藏app的头
  useEffect(() => {
    if (inApp) {
      const onUpdateHeader = (statusBarIsLightMode) => {
        JsBridge.open({
          type: 'event',
          params: {
            name: 'updateHeader',
            visible: false,
            statusBarTransparent: true,
            statusBarIsLightMode,
          },
        });
      };

      onUpdateHeader(false);
      // 获取native主题
      JsBridge.open({ type: 'func', params: { name: 'getAppInfo' } }, (params) => {
        // 同步主题
        setTheme(params?.data?.darkMode ? 'dark' : 'light');
        onUpdateHeader(!params?.data?.darkMode);
      });
    }
  }, [inApp, setTheme]);

  // 当前页的数据
  const pageItem = useMemo(() => {
    if (curPage === -1) {
      return {};
    }
    return flowData?.pages?.[curPage];
  }, [curPage, flowData]);

  // 当前页的渲染组件
  const PageRender = useMemo(() => {
    return PageObj[pageItem?.pageTemplateCode] || PageObj[pageItem?.pageCode] || PageObj.default;
  }, [pageItem]);

  // 设置进度条数据
  const onSetStepData = useCallback((step) => {
    if (step) {
      const arr = step.split(':');
      const current = Number(arr[1]);
      const total = Number(arr[0]);
      setStepData({
        current,
        total,
        show: true,
        percent: `${(current / total) * 100}%`,
      });
    } else {
      setStepData({
        show: false,
      });
    }
  }, []);

  // pageElements变化改变其他显示数据
  useEffect(() => {
    const pageElements = { ...pageItem?.pageElements, ...innerPageElements };
    const pageTitle = pageElements?.pageTitle || '';

    onSetStepData(pageElements?.step || innerPageElements?.step || '');

    // 设置合规弹窗数据
    if (isInDialog) {
      onSetDialogData({
        dialogTitle: pageTitle,
        isLastPage,
        pageCode: pageItem?.pageCode,
        innerPageElements,
        pageElements,
        onPrePage,
      });
    }
  }, [
    onSetStepData,
    pageItem?.pageElements,
    pageItem?.pageCode,
    innerPageElements,
    isInDialog,
    isLastPage,
    onPrePage,
  ]);

  useEffect(() => {
    try {
      if (pageItem.pageCode) {
        kcsensorsManualTrack('kyc_middle_platform_pageview', [], {
          kyc_standard: flowData.complianceStandardAlias,
          page_code: pageItem.pageCode,
          page_virtual_id: String(pageItem.pageId),
          page_virtual_name: pageItem.pageName,
          page_range: pageItem.range,
          page_type: isInDialog ? 'popup' : 'page',
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [pageItem, isInDialog, flowData.complianceStandardAlias]);

  // 是否使用h5样式
  const isSmStyle = useMemo(() => !isInDialog, [isInDialog]);

  // 是否第一页
  const isFirstPage = useMemo(() => curPage === 0, [curPage]);

  // 是否最后一页
  const isLastPage = useMemo(() => curPage === flowData?.pages?.length - 1, [curPage, flowData]);

  // 关闭 Webview
  const onExitWebview = useCallback(() => {
    JsBridge.open({
      type: 'func',
      params: {
        name: 'exit',
      },
    });
  }, []);

  // 退出流程
  const onExitFlow = useCallback(() => {
    if (inApp) {
      onExitWebview();
      return;
    }
    if (isInDialog) {
      onCancel();
      return;
    }
    if (window.history.length > 1) {
      window.history.go(-1);
      return;
    }
    window.location.replace(addLangToPath('/account/kyc'), storage.getItem('kucoinv2_lang'));
  }, [inApp, isInDialog, onExitWebview, onCancel]);

  // 上一步
  const onPrePage = useCallback(() => {
    setInnerPageElements({});
    if (isFirstPage) {
      onExitFlow();
      return;
    }
    if (
      [config.questionPageCode1, config.questionPageCode2].includes(pageItem?.pageCode) &&
      scoreStep === 2
    ) {
      setScoreStep(1);
      return;
    }
    setCurPage((pre) => Math.max(pre - 1, 0));
    setNextAction(false);
  }, [isFirstPage, pageItem?.pageCode, scoreStep, onExitFlow]);

  // 下一页
  const { run: onNextPage } = useDebounceFn(
    async (pageStepLength = 1) => {
      if (errMsg) {
        message.error(errMsg);
        return;
      }
      if (inApp) {
        const appVersion = await new Promise((resolve) => {
          JsBridge.open(
            {
              type: 'func',
              params: { name: 'getAppVersion' },
            },
            ({ data }) => resolve(data),
          );
        });

        // 提示升级
        const isSumsubFlow = !!flowData.pages.find((i) => i.pageCode === config.sumsubPageCode);
        const curVersion = isSumsubFlow
          ? config.SUPPORT_SUMSUB_VERSION
          : config.SUPPORT_JUMIO_VERSION;
        if (config.compareVersion(appVersion, curVersion) >= 0) {
          setCurPage((pre) => pre + pageStepLength);
          setNextAction(true);
          setInnerPageElements({});
        } else {
          message.error(_t('jpWB1U8eDkgGvEQzVskHgy', { version: curVersion }));
        }
      } else {
        setCurPage((pre) => pre + pageStepLength);
        setNextAction(true);
        setInnerPageElements({});
      }
    },
    { wait: 500, leading: true, trailing: false },
  );

  // 缓存表单数据
  const onCacheFormData = useCallback(
    (val) => {
      setFormData({ ...formData, ...val });
    },
    [formData],
  );

  // 最后提交成功最后回调
  const onSubmitOkCallback = useCallback(
    (okUrl) => {
      if (isInDialog) {
        onOk();
        onCancel();
        return;
      }
      if (inApp) {
        onExitWebview();
        return;
      }
      if (okUrl) {
        window.location.href = okUrl;
        return;
      }

      window.history.go(-1);
    },
    [onOk, onCancel, onExitWebview, isInDialog, inApp],
  );

  // 中台各组件公共数据
  const commonData = useObjectMemo({
    flowData,
    isSmStyle,
    isH5,
    inApp,
    formData,
    onCacheFormData,
    stepData,
    ocrData,
    setOcrData,
    innerPageElements,
    setInnerPageElements: (next) => {
      setInnerPageElements((prev) => {
        if (!isEqual(prev, next)) {
          return next;
        }
        return prev;
      });
    },
    scoreStep,
    setScoreStep,
    hideFormFooterPreBtn,
    onExitFlow,
    crossPageData,
    setCrossPageData,
    isNextAction,
  });

  return (
    <CommonContext.Provider value={commonData}>
      <Wrapper
        data-inspector="Compliance"
        className={classnames({
          isSmStyle,
        })}
        pageCode={pageItem?.pageCode}
      >
        <StyledSpin spinning={loading} />

        {/* h5 header */}
        {isSmStyle ? (
          <MobileSteps
            {...pageItem}
            onPrePage={onPrePage}
            isLastPage={isLastPage}
            isFirstPage={isFirstPage}
          />
        ) : null}

        {isShowErr ? (
          <SystemError onRetry={() => initData()} />
        ) : (
          <Main
            className={classnames({
              isSmStyle,
            })}
            data-pageid={pageItem?.pageId}
          >
            {pageItem && pageItem?.pageId ? (
              <PageRender
                {...pageItem}
                errMsg={errMsg}
                initData={initData}
                onNextPage={onNextPage}
                onPrePage={onPrePage}
                onSubmitOkCallback={onSubmitOkCallback}
              />
            ) : null}
          </Main>
        )}

        {extraContent}
      </Wrapper>
    </CommonContext.Provider>
  );
};
