/**
 * Owner: tiger@kupotech.com
 * Jumio页面
 */
import { useSnackbar } from '@kux/mui';
import JumioApp from './JumioApp';
import JumioWeb from './JumioWeb';
import { GetJumioData, postJsonWithPrefix } from '../../service';
import useFetch from '../../hooks/useFetch';
import useCommonData from '../../hooks/useCommonData';
import { getIssueCountryCode, getIdType } from '../../config';

export default ({ onNextPage, pageId, pageAfterApi, ...props }) => {
  const { inApp, formData, flowData } = useCommonData();
  const { message } = useSnackbar();

  const { data, loading } = useFetch(GetJumioData, {
    ready: flowData?.transactionId,
    params: {
      region: getIssueCountryCode(formData),
      identityType: getIdType(formData),
      transactionId: flowData?.transactionId,
    },
  });

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

  const commonData = { ...data, loading, onNext };

  return inApp ? <JumioApp {...props} {...commonData} /> : <JumioWeb {...props} {...commonData} />;
};
