/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useState } from 'react';
import { styled, Button, useSnackbar, useTheme, useResponsive } from '@kux/mui';
import clsx from 'clsx';
import { tenantConfig } from 'packages/kyc/src/config/tenant';
import { kcsensorsClick, kcsensorsManualTrack } from 'packages/kyc/src/common/tools';
import pending_light from 'kycCompliance/assets/img/light/pending.png';
import error_light from 'kycCompliance/assets/img/light/error.svg';
import pending_dark from 'kycCompliance/assets/img/dark/pending.png';
import error_dark from 'kycCompliance/assets/img/dark/error.svg';
import useCommonData from 'kycCompliance/hooks/useCommonData';
import { Wrapper, ContentBox, FooterBtnBox, StyledSpin } from 'kycCompliance/components/commonStyle';
import { GetResultData112, postJsonWithPrefix } from 'kycCompliance/service';
import { kcsensorsBlockidMap, sumsubPageCode, onAppsFlyerTrack } from 'kycCompliance/config';

export const IMG_CONFIG = {
  light: {
    success: pending_light,
    error: error_light,
  },
  dark: {
    success: pending_dark,
    error: error_dark,
  },
};

const Result = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-top: 32px;
  }
  &.isSmStyle {
    padding-top: 6vh;
  }
  .KuxButton-root {
    min-width: 231px;
  }
`;
const ResultImg = styled.img`
  width: 136px;
  height: 136px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 136px;
    height: 136px;
  }
  &.isSmStyle {
    width: 136px;
    height: 136px;
    margin-bottom: 12px;
  }
`;
const Title = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin-bottom: 8px;
  color: var(--color-text);
  ${({ theme }) => theme.breakpoints.down('sm')} {
  }
  &.isSmStyle {
    font-size: 24px;
    margin-bottom: 4px;
  }
`;
const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 140%;
  text-align: center;
  color: var(--color-text60);
  border-radius: 12px;
  &.isSmStyle {
    margin-bottom: 40px;
    border-radius: 16px;
    font-size: 14px;
  }
`;

export default ({ initData, onSubmitOkCallback, pageCode }) => {
  const { isSmStyle, flowData, inApp } = useCommonData();
  const { message } = useSnackbar();
  const { currentTheme } = useTheme();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const [data, setData] = useState({});
  const [isSuccess, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 页面浏览埋点
    const blockId = kcsensorsBlockidMap[pageCode];
    if (blockId) {
      kcsensorsClick([blockId, '1'], {
        kyc_standard: flowData.complianceStandardAlias,
      });
    }
    // 泰国加埋点
    kcsensorsManualTrack('expose', ['B1KYCSubmitted'], {
      page_id: 'B1KYCSubmitted',
      kyc_standard: flowData.complianceStandardAlias,
    });
    if (tenantConfig.compliance.af_key_submitted) {
      onAppsFlyerTrack(tenantConfig.compliance.af_key_submitted);
    }
  }, [pageCode]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      let isSuccessResult = true;
      try {
        const { transactionId, flowAfterApi, flowId } = flowData;
        // const flowRes = { success: true };
        const flowRes = await postJsonWithPrefix(flowAfterApi, { transactionId, flowId });
        setSuccess(flowRes?.success);
        isSuccessResult = flowRes?.success;
        const res = await GetResultData112({ isSuccess: flowRes?.success });

        setData(res?.data?.pageElements || {});
      } catch (error) {
        const res = await GetResultData112({ isSuccess: false });
        setData(res?.data?.pageElements || {});
        setSuccess(false);
        isSuccessResult = false;

        if (error?.msg) {
          message.error(error?.msg);
        }
      }
      setLoading(false);

      const isSumsubFlow = !!flowData.pages.find(i => i.pageCode === sumsubPageCode);
      const supplierType = isSumsubFlow ? 'sumsub' : 'jumio';
      const getTerminal = () => {
        if (inApp) {
          if (/android/i.test(window.navigator.userAgent)) {
            return 'android';
          }
          return 'ios';
        }
        return isH5 ? 'web_mobile' : 'web_pc';
      };

      kcsensorsManualTrack('Mkyc_submit_result', [], {
        kyc_submit_result: isSuccessResult ? 'success' : 'fail',
        kyc_channel: `${inApp ? 'app' : 'web'}_${supplierType}`,
        kyc_id_photo_front_catch_type: supplierType,
        kyc_id_photo_back_catch_type: supplierType,
        kyc_liveness_catch_type: supplierType,
        kyc_submit_terminal: getTerminal(),
        kyc_standard: flowData.complianceStandardAlias,
      });
    };

    getData();
  }, []);

  const onClk = () => {
    const blockId = kcsensorsBlockidMap[pageCode];
    if (blockId) {
      kcsensorsClick([`${blockId}_Done`, '1'], {
        kyc_standard: flowData.complianceStandardAlias,
      });
    }

    if (isSuccess) {
      const okUrl = data[`${flowData.complianceStandardAlias}OkUrl`];
      onSubmitOkCallback(okUrl);
    } else {
      initData(true);
    }
  };

  return (
    <Wrapper>
      <StyledSpin spinning={loading} size="small" />

      {!loading && (
        <>
          <ContentBox
            className={clsx({
              isSmStyle,
            })}
          >
            <Result
              className={clsx({
                isSmStyle,
              })}
            >
              <ResultImg
                src={IMG_CONFIG?.[currentTheme]?.[isSuccess ? 'success' : 'error']}
                className={clsx({
                  isSmStyle,
                })}
                alt="result"
              />
              <Title
                className={clsx({
                  isSmStyle,
                })}
              >
                {data?.pageContentTitle}
              </Title>
              <Desc
                className={clsx({
                  isSmStyle,
                })}
              >
                {data?.pageContentTxt}
              </Desc>
              {isSmStyle && (
                <Button onClick={onClk} size="large">
                  {data?.pageButtonTxt}
                </Button>
              )}
            </Result>
          </ContentBox>
          {!isSmStyle && <FooterBtnBox onNext={onClk} nextText={data?.pageButtonTxt} />}
        </>
      )}
    </Wrapper>
  );
};
