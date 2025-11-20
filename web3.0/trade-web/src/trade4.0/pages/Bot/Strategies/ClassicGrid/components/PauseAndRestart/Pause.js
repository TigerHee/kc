/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import { pauseBot } from 'ClassicGrid/services';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Divider } from 'Bot/components/Widgets';
import HintText from 'Bot/components/Common/HintText';
import { useSnackbar } from '@kux/mui';

const Pause = ({ onFresh, taskId, actionSheerRef }) => {
  const { message } = useSnackbar();

  const onPause = React.useCallback(() => {
    actionSheerRef.current.updateBtnProps({
      okButtonProps: {
        loading: true,
      },
    });
    pauseBot(taskId)
      .then(() => {
        message.info(_t('runningdetail'));
        actionSheerRef.current.toggle();
        onFresh();
      })
      .finally(() => {
        actionSheerRef.current.updateBtnProps({
          okButtonProps: {
            loading: false,
          },
        });
      });
  }, [taskId]);

  useBindDialogButton(actionSheerRef, {
    onConfirm: onPause,
  });
  return (
    <>
      <Text as="div" color="text60" fs={14}>
        {_t('3C2STy8U4DpR2ieX9tjuuw')}
      </Text>
      <Divider />
      <HintText>
        <div>{_tHTML('itdiYMddAop5R7aMhWucYW')}</div>
        <br />
        <div>{_tHTML('ansbR7rCX7brrZ3dsLmSU9')}</div>
      </HintText>
    </>
  );
};

const PauseActionSheet = ({ actionSheerRef, taskId, onFresh }) => {
  return (
    <DialogRef
      ref={actionSheerRef}
      title={_t('dfqroD85wBpSDoP7ZnrbC1')}
      cancelText={_t('machinecopydialog7')}
      okText={_t('gridwidget6')}
      onCancel={() => actionSheerRef.current.toggle()}
      onOk={() => actionSheerRef.current.confirm()}
      size="medium"
      maskClosable
    >
      <Pause onFresh={onFresh} taskId={taskId} actionSheerRef={actionSheerRef} />
    </DialogRef>
  );
};

export default PauseActionSheet;
