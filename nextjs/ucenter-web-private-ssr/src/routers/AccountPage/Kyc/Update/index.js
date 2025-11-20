/**
 * Owner: tiger@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { Spin } from '@kux/mui';
import UserRoot from 'components/UserRoot';
import { isArray } from 'lodash-es';
import { useEffect, useState } from 'react';
import { getKycUpdateStatus } from 'services/kyc';
import { _t } from 'tools/i18n';
import Cause from './Cause';
import { STATUS_REJECTED, STATUS_SUCCESS, STATUS_VERIFYING } from './config';
import Status from './Status';
import { ReturnIcon, Wrapper } from './style';

export default () => {
  const isInApp = JsBridge.isApp();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('');
  const [failReasonList, setFailReasonList] = useState([]);
  const [loading, setLoading] = useState(false);

  const onViewToCause = () => {
    setStep(0);
  };

  const onGetStatus = async (needLoading = true) => {
    if (needLoading) {
      setLoading(true);
    }

    try {
      const res = await getKycUpdateStatus({ type: 'IDENTITY' });
      const { status, failReasonList } = res?.data || {};
      if ([1].includes(status)) {
        setStatus(STATUS_VERIFYING);
        setStep(1);
      } else if ([2].includes(status)) {
        setStatus(STATUS_SUCCESS);
        setStep(1);
      } else if ([3].includes(status)) {
        setStatus(STATUS_REJECTED);
        setStep(1);
        setFailReasonList(isArray(failReasonList) ? failReasonList : []);
      } else {
        setStep(0);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    onGetStatus();

    window?.onListenEvent &&
      window?.onListenEvent('onShow', (data) => {
        onGetStatus();
        return true;
      });
  }, []);

  return (
    <UserRoot>
      <Wrapper data-inspector="account_kyc_update_page">
        {isInApp ? null : (
          <div
            onClick={() => {
              window.history.go(-1);
            }}
            className="goBack"
            role="button"
            tabIndex="0"
          >
            <ReturnIcon />
            <span>{_t('e0f7db76aa6c4000abdb')}</span>
          </div>
        )}

        <Spin spinning={loading} size="small">
          {step === 0 && <Cause onGetStatus={onGetStatus} />}
          {step === 1 && (
            <Status
              onViewToCause={onViewToCause}
              status={status}
              failReasonList={failReasonList}
              onGetStatus={onGetStatus}
            />
          )}
        </Spin>
      </Wrapper>
    </UserRoot>
  );
};
