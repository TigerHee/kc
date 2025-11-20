/**
 * Owner: odan.ou@kupotech.com
 */

import React, { useMemo, useState, useCallback } from 'react';
import { Button } from '@kufox/mui';
import { trackClickSpm, trackExposeHandleSpm } from 'utils/gaTrack';
import { CopyOutlined } from '@kufox/icons';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { useSnackbar } from '@kufox/mui';
import classnames from 'classnames';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getThirdHashId } from 'services/trade2.0/por';
import { useFetchHandle } from 'hooks';
import BaseDialog from './baseDialog';
import Steps from './steps';
import TimeSelect from './timeSelect';

// 三方验证埋点
const onClickTrack = (index) => {
  return trackClickSpm(['internalVerifyWindow', index]);
};

const ThirdDialog = (props) => {
  const { list } = props;
  const userId = useSelector(({ user }) => user.user?.uid);
  const { message } = useSnackbar();
  const { fetchHandle, loading } = useFetchHandle();
  const [time, setTime] = useState(list?.[0]?.auditDate);
  // 验证跳转链接
  const jumpUrl = useMemo(() => {
    return list?.find((item) => item.auditDate === time)?.verifyAuditResultUrl;
  }, [list, time]);
  const [hashId, setHashId] = useState('');
  const [tip, setTip] = useState('');
  const [currentStep, setcurrentStep] = useState(time ? 1 : 0);
  const onTimeChange = useCallback((val) => {
    onClickTrack(1);
    setTime(val);
    setcurrentStep(1);
    setHashId('');
    setTip('');
  }, []);

  const onGetHashId = useCallback(() => {
    onClickTrack(2);
    fetchHandle(
      getThirdHashId({
        uid: userId,
        auditDate: time,
      }),
      {
        onSilenceOk({ data }) {
          if (!data) {
            trackExposeHandleSpm(['externalVerifyWindow', 0]);
            setTip(_t('assets.por.no.record'));
          } else {
            setHashId(data);
            setcurrentStep(2);
          }
        },
      },
    );
  }, [userId, time]);

  const onDetialClick = useCallback(() => {
    onClickTrack(5);
  }, []);

  const showHashId = String(hashId).slice(0, 8) + '...';

  const stepsList = useMemo(() => {
    const getClassName = (index, className) =>
      classnames({ current_step: currentStep === index }, className);
    return [
      {
        label: _t('assets.por.step.time'),
        value: <TimeSelect list={list} value={time} onChange={onTimeChange} />,
      },
      {
        label: _t('assets.por.step.create'),
        value: (
          <Button
            type="default"
            size="mini"
            variant="text"
            onClick={hashId ? undefined : onGetHashId}
            className={getClassName(1)}
            loading={loading}
          >
            {_t('assets.por.step.create.hash')}
          </Button>
        ),
      },
      {
        label: _t('assets.por.step.copy'),
        value: (
          <div>
            <span>{_t('assets.por.step.copy.hash')}</span>
            <span className={getClassName(2)}>
              {!!hashId ? (
                <CopyToClipboard
                  text={hashId}
                  onCopy={() => {
                    setcurrentStep(3);
                    onClickTrack(3);
                    message.success(_t('copy.succeed'));
                  }}
                >
                  <span>
                    {showHashId}{' '}
                    <CopyOutlined
                      size={20}
                      style={{ cursor: 'pointer', verticalAlign: 'text-top' }}
                    />
                  </span>
                </CopyToClipboard>
              ) : (
                '--'
              )}
            </span>
          </div>
        ),
      },
      {
        label: _t('assets.por.step.verfiy'),
        value: (
          <div className={getClassName(3, 'underline verify')}>
            {!!jumpUrl && (
              <a href={jumpUrl} target="_blank" rel="noreferrer" onClick={() => onClickTrack(4)}>
                {_t('assets.por.step.verfiy.link')}
              </a>
            )}
          </div>
        ),
      },
    ];
  }, [list, time, jumpUrl, onTimeChange, hashId, currentStep, loading]);
  return (
    <BaseDialog
      {...props}
      title={_t('assets.por.audit.third')}
      onDetialClick={onDetialClick}
      time={time}
    >
      <div>
        <Steps list={stepsList} currentStep={currentStep} tip={tip} />
      </div>
    </BaseDialog>
  );
};

export default ThirdDialog;
