/**
 * Owner: tiger@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Button, useResponsive } from '@kux/mui';
import classnames from 'classnames';
import { useEffect } from 'react';
import { _t } from 'tools/i18n';
import { replace } from 'utils/router';
import { STATUS_REJECTED, STATUS_SUCCESS, STATUS_VERIFYING } from '../config';
import failIcon from './img/fail.svg';
import pendingIcon from './img/pending.svg';
import successIcon from './img/success.svg';
import { Wrapper } from './style';

export default ({ onViewToCause, status, failReasonList, onGetStatus }) => {
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  useEffect(() => {
    let timer = null;
    if (status === STATUS_VERIFYING) {
      timer = setInterval(() => {
        onGetStatus(false);
      }, 1000 * 30);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [onGetStatus, status]);

  const onFinish = () => {
    if (JsBridge.isApp()) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'exit',
        },
      });
      return;
    }
    if (window.history.length > 1) {
      window.history.go(-1);
      return;
    }

    replace('/account/kyc');
  };

  const statusConfig = {
    [STATUS_VERIFYING]: {
      icon: pendingIcon,
      title: _t('9b404ab3c97b4000a6b4'),
      desc: _t('5a59086bc85b4000a6d3'),
    },
    [STATUS_SUCCESS]: {
      icon: successIcon,
      title: _t('9fda6660320a4000af79'),
      desc: _t('952a3f1d15b94000a6a6'),
      btnText: _t('4ae3f94628e64000a566'),
      clickFn: onFinish,
    },
    [STATUS_REJECTED]: {
      icon: failIcon,
      title: _t('a4dfe3227c7b4000acd0'),
      desc: (
        <>
          {failReasonList.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </>
      ),
      descError: true,
      btnText: _t('763e6358279f4000a5eb'),
      clickFn: onViewToCause,
    },
  };
  const statusRenderData = statusConfig[status] || {};

  return (
    <Wrapper>
      <img className="icon" src={statusRenderData.icon} alt={status} />
      <div className="title">{statusRenderData.title}</div>
      <div
        className={classnames({
          desc: true,
          descError: statusRenderData.descError,
        })}
      >
        {statusRenderData.desc}
      </div>
      {statusRenderData.clickFn && (
        <Button onClick={statusRenderData.clickFn} size={isH5 ? 'basic' : 'large'} fullWidth>
          {statusRenderData.btnText}
        </Button>
      )}
    </Wrapper>
  );
};
