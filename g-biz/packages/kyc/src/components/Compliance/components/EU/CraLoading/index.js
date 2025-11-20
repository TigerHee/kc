/**
 * Owner: tiger@kupotech.com
 * CRA 计算页
 */
import { useSnackbar } from '@kux/mui';
import { useEffect } from 'react';
import { postJsonWithPrefix, getCraResult } from '@kycCompliance/service';
import { Wrapper, StyledSpin } from '@kycCompliance/components/commonStyle';
import useCommonData from '@kycCompliance/hooks/useCommonData';

export default ({ pageAfterApi, pageId, onNextPage, onPrePage }) => {
  const { message } = useSnackbar();
  const { flowData, isNextAction } = useCommonData();

  useEffect(() => {
    if (isNextAction) {
      getCraResult({
        transactionId: flowData.transactionId,
      })
        .then(async (res) => {
          if (res.data) {
            const { flowId, transactionId, complianceStandardCode } = flowData;
            const { craLevel, craScore, skipNextPage } = res.data || {};
            await postJsonWithPrefix(pageAfterApi, {
              flowId,
              transactionId,
              complianceStandardCode,
              pageId,
              metaMap: { craLevel, craScore },
            });
            onNextPage(skipNextPage ? 2 : 1);
          }
        })
        .catch((error) => {
          if (error?.msg) {
            message.error(error?.msg);
          }
          onPrePage();
        });
    } else {
      onPrePage();
    }
  }, [flowData]);

  return (
    <Wrapper>
      <StyledSpin />
    </Wrapper>
  );
};
