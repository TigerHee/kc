/**
 * Owner: tiger@kupotech.com
 * sumsub页面
 */
import { useEffect } from 'react';
import { useSnackbar } from '@kux/mui';
import useLang from 'packages/kyc/src/hookTool/useLang';
import { postJsonWithPrefix } from 'kycCompliance/service';
import useFetch from 'kycCompliance/hooks/useFetch';
import useCommonData from 'kycCompliance/hooks/useCommonData';
import { getIssueCountryCode, getIdType } from 'kycCompliance/config';
import SumsubApp from './SumsubApp';
import SumsubWeb from './SumsubWeb';

const cardMap = {
  1: 'ID_CARD',
  2: 'PASSPORT',
  3: 'DRIVERS',
  6: 'RESIDENCE_PERMIT',
};

export default ({ onNextPage, onPrePage, pageId, pageAfterApi, pageCode, ...props }) => {
  const { inApp, flowData, formData } = useCommonData();
  const { message } = useSnackbar();
  const { _t } = useLang();

  const { data, loading, isFetchErr } = useFetch(
    param => {
      return postJsonWithPrefix(`/compliance/page/${pageCode}/init`, param, {
        timeout: 20000,
      });
    },
    {
      ready: flowData?.transactionId && pageCode,
      params: {
        region: getIssueCountryCode(formData),
        identityType: getIdType(formData),
        transactionId: flowData?.transactionId,
      },
    }
  );

  useEffect(() => {
    if (isFetchErr) {
      message.error(_t('116ffd0de2d04000a685'));
      onPrePage();
    }
  }, [isFetchErr]);

  const onNext = async () => {
    try {
      const { flowId, transactionId, complianceStandardCode } = flowData;
      await postJsonWithPrefix(pageAfterApi, {
        flowId,
        transactionId,
        complianceStandardCode,
        pageId,
      });

      onNextPage();
    } catch (error) {
      if (error?.msg) {
        message.error(error?.msg);
      }
    }
  };

  const commonData = {
    ...data,
    onPrePage,
    loading,
    onNext,
    idDocType: cardMap[getIdType(formData)],
  };

  return inApp ? <SumsubApp {...props} {...commonData} /> : <SumsubWeb {...props} {...commonData} />;
};
