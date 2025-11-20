/**
 * Owner: odan.ou@kupotech.com
 */

import React, { useState, useCallback, useMemo } from 'react';
import { _t } from 'tools/i18n';
import classnames from 'classnames';
import { useSelector } from 'src/hooks/useSelector';
import { Button } from '@kufox/mui';
import { trackClickSpm, trackExposeHandleSpm } from 'utils/gaTrack';
import { getSystemHashId } from 'services/trade2.0/por';
import { useFetchHandle } from 'hooks';
import BaseDialog from './baseDialog';
import Steps from './steps';
import TimeSelect from './timeSelect';
import styles from './style.less';

// 内部验证埋点
const onClickTrack = (index) => {
  return trackClickSpm(['internalVerifyWindow', index]);
};

const SystemDialog = (props) => {
  const { list } = props;
  const userId = useSelector(({ user }) => user.user?.uid);
  const { fetchHandle, loading } = useFetchHandle();
  const [time, setTime] = useState(list?.[0]?.auditDate);
  const [hashId, setHashId] = useState('');
  const [tip, setTip] = useState('');
  const [currentStep, setcurrentStep] = useState(time ? 1 : 0);
  const onTimeChange = useCallback((val) => {
    onClickTrack(1); // 埋点
    setTime(val);
    setcurrentStep(1);
    setHashId('');
    setTip('');
  }, []);

  const onGetHashId = useCallback(() => {
    onClickTrack(2);
    fetchHandle(
      getSystemHashId({
        uid: userId,
        auditDate: time,
      }),
      {
        onSilenceOk({ data }) {
          if (!data) {
            setTip(_t('assets.por.no.record'));
            trackExposeHandleSpm(['internalVerifyWindow', 0]);
          } else {
            setHashId(data);
            setcurrentStep(2);
          }
        },
      },
    );
  }, [userId, time]);

  const stepsList = useMemo(() => {
    const getClassName = (index, className) =>
      classnames({ current_step: currentStep === index }, className);
    return [
      {
        label: _t('assets.por.step.time'),
        value: <TimeSelect list={list} value={time} onChange={onTimeChange} />,
      },
      {
        label: _t('assets.por.step.identification'),
        value: (
          <div>
            {_t('assets.por.audit.id')}{' '}
            {hashId ? (
              <span>{hashId}</span>
            ) : (
              <Button
                type="default"
                size="mini"
                variant="text"
                onClick={hashId ? undefined : onGetHashId}
                className={getClassName(1, 'pointer')}
                loading={loading}
              >
                {_t('assets.por.audit.id.get')}
              </Button>
            )}
          </div>
        ),
      },
      {
        label: _t('assets.por.step.verfiy'),
        value: (
          <div>
            {hashId ? (
              <span className={getClassName(2)}>
                <a
                  className="underline"
                  href={`/proof-of-reserves/detail/${hashId}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onClickTrack(3)}
                >
                  {_t('assets.por.detail.view')}
                </a>
              </span>
            ) : (
              '--'
            )}
          </div>
        ),
      },
    ];
  }, [list, time, onTimeChange, hashId, currentStep, loading]);

  const onDetialClick = useCallback(() => {
    onClickTrack(4);
  }, []);

  return (
    <BaseDialog
      {...props}
      title={_t('assets.por.audit.inside')}
      onDetialClick={onDetialClick}
      className={styles.self_dialog}
      time={time}
    >
      <div>
        <Steps list={stepsList} currentStep={currentStep} tip={tip} />
      </div>
    </BaseDialog>
  );
};

export default SystemDialog;
