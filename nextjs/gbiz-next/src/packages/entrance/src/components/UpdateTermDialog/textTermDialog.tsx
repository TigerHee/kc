/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Snackbar, Button } from '@kux/mui';
import { Modal } from '@kux/design';
import { useTranslation } from 'tools/i18n';
import { kcsensorsManualTrack, trackClick } from 'tools/sensors';
import DialogInfo from '../../../static/status-info.svg';
import DialogInfoDark from '../../../static/status-info-dark.svg';
import useThemeImg from '../../hookTool/useThemeImg';
import { TermContent } from '../TermContent';
import styles from './textTermDialog.module.scss';
import { DialogContent } from './DialogContent';

const { SnackbarProvider } = Snackbar;

interface TextTermDialogContentProps {
  refuseSignTermHandle: () => void;
  signTermHandle: (args?: any) => void;
  userUpdateTermList: any[];
  onClose?: () => void;
}

const TextTermDialogContent: React.FC<TextTermDialogContentProps> = ({
  refuseSignTermHandle,
  signTermHandle,
  userUpdateTermList,
  onClose,
}) => {
  const { t: _t } = useTranslation('entrance');
  const { getThemeImg } = useThemeImg();
  const [isLeave, setIsLeave] = useState(false);
  // 当前协议是否打开过挽留弹窗，一份协议只打开一次
  const hasEnterLeaveDialog = useRef(false);
  // 已经阅读过的最近协议 索引值
  const [hasReadTermIdx, setHasReadTermIdx] = useState(-1);
  const hasReadTermIdxRef = useRef(hasReadTermIdx);
  // 协议是否加载失败
  const termIsErrorRef = useRef(false);

  const termContentRef = useRef<any>(null);

  const termList = useMemo(() => {
    return userUpdateTermList.map(item => ({
      ...item,
      name: item.title,
      desc: _t('5145033235b14000af85', { term: item.title || '' }),
    }));
  }, [_t, userUpdateTermList]);

  // 协议弹窗 点击离开
  const onLeaveInTerm = () => {
    const currTermId = termList[hasReadTermIdxRef.current + 1]?.termId;
    trackClick({
      spm: ['Agreement_Content', 'Leave'],
      agreement_ids: currTermId,
    });
    // 如果已经拒绝过一次，直接调用拒绝
    if (hasEnterLeaveDialog.current) {
      // 关闭挽留弹窗
      setIsLeave(false);
      // 只有协议请求不失败，才执行用户拒绝签署协议
      if (!termIsErrorRef.current) {
        refuseSignTermHandle?.();
      } else {
        // 如果不执行拒绝签署协议方法，才调用 onClose
        onClose?.();
      }
    } else {
      // 挽留弹窗曝光埋点
      kcsensorsManualTrack({
        spm: ['Agreement_Content_Retain', 'Whole_Page'],
        agreement_ids: currTermId,
      });
      // 只打开一次挽留弹窗
      hasEnterLeaveDialog.current = true;
      // 将协议内容组件是否失败的变量保存
      termIsErrorRef.current = termContentRef.current?.isError;
      setIsLeave(true);
    }
  };

  // 协议弹窗 勾选同意
  const onAgreeCheckInTerm = (termId: string) => {
    trackClick({
      spm: ['Agreement_Content', 'Check'],
      agreement_ids: termId,
    });
  };

  // 协议弹窗 点击同意
  const onAgreeInTerm = (termId: string, idx: number) => {
    // 如果是从协议组件返回的回调，直接提交
    if (typeof termId !== 'undefined') {
      hasReadTermIdxRef.current = idx;
      setHasReadTermIdx(idx);
      hasEnterLeaveDialog.current = false;
      signTermHandle?.({ termId });
      trackClick({
        spm: ['Agreement_Content', 'Comfirm'],
        agreement_ids: termId,
      });
    }
  };

  // 挽留弹窗 点击离开
  const onLeaveInRetain = () => {
    const currTermId = termList[hasReadTermIdxRef.current + 1]?.termId;
    trackClick({
      spm: ['Agreement_Content_Retain', 'Leave'],
      agreement_ids: currTermId,
    });
    // 只有协议请求不失败，才执行用户拒绝签署协议
    if (!termIsErrorRef.current) {
      refuseSignTermHandle?.();
    } else {
      onClose?.();
    }
    // 关闭挽留弹窗
    setIsLeave(false);
  };

  // 挽留弹窗点击继续阅读
  const onContinueReadInRetain = () => {
    const currTermId = termList[hasReadTermIdxRef.current + 1]?.termId;
    trackClick({
      spm: ['Agreement_Content_Retain', 'Comfirm'],
      agreement_ids: currTermId,
    });
    // 关闭挽留弹窗
    setIsLeave(false);
  };

  useEffect(() => {
    // 进入正文协议弹窗曝光
    kcsensorsManualTrack({
      spm: ['Agreement_Content', 'Whole_Page'],
    });
  }, []);

  return (
    <SnackbarProvider>
      {!isLeave ? (
        <div className={clsx(styles.textDialogContentWrapper)}>
          <TermContent
            ref={termContentRef}
            title={
              <div className={clsx(styles.textTermTitle)}>
                {_t('865270968a594800af16', {
                  term: termList[hasReadTermIdx + 1]?.title || '',
                })}
              </div>
            }
            agreementList={termList}
            buttonText={_t('3c55461596fa4800a032')}
            onFinish={onClose}
            onAgreeCheck={onAgreeCheckInTerm}
            onSignSingle={onAgreeInTerm}
            // 因为这是最近一个已经阅读过的协议索引，所以如果想要当前要阅读的协议，索引值需要 + 1
            defaultTermIdx={hasReadTermIdxRef.current + 1}
            extra={
              <Button variant="text" className={clsx(styles.textTermExitButton)} onClick={onLeaveInTerm}>
                {_t('69e1b779418e4000a304')}
              </Button>
            }
          />
        </div>
      ) : (
        <div className={clsx(styles.textRetainDialogContent)}>
          <div className={clsx(styles.imgWrap)}>
            <img alt="term info tip" src={getThemeImg({ light: DialogInfo, dark: DialogInfoDark })} />
          </div>
          <DialogContent
            titleText={_t('1394bc56eb714800a020')}
            contentText={_t('9ed21c3489544800a87d', {
              term: termList[hasReadTermIdx + 1]?.title || '',
            })}
            descText={_t('c0ce3dbb8beb4000a6c9')}
            agreeText={_t('3fba3b6e536a4800afcd')}
            refuseText={_t('58a24e882a4e4000a088')}
            onAgreeHandle={onContinueReadInRetain}
            onLeaveHandle={onLeaveInRetain}
          />
        </div>
      )}
    </SnackbarProvider>
  );
};

interface TextTermDialogProps {
  visible: boolean;
  refuseSignTermHandle: () => void;
  signTermHandle: (args?: any) => void;
  userUpdateTermList: any[];
  onClose?: () => void;
}

export const TextTermDialog: React.FC<TextTermDialogProps> = ({ visible, ...props }) => {
  return (
    <Modal
      isOpen={visible}
      mobileTransform
      footer={null}
      maskClosable={false}
      onCancel={props.onClose}
      onClose={props.onClose}
      size="small"
      showCloseX={false}
      header={null}
    >
      <TextTermDialogContent {...props} />
    </Modal>
  );
};

export default TextTermDialog;
