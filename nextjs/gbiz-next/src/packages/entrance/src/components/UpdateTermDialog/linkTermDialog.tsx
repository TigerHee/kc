/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@kux/design';
import { Dialog } from '@kux/mui'
import { Trans, useTranslation } from 'tools/i18n';
import { getTermUrl } from 'tools/term';
import DialogInfo from '../../../static/status-info.svg';
import DialogInfoDark from '../../../static/status-info-dark.svg';
import { kcsensorsManualTrack, trackClick } from 'tools/sensors';
import styles from './linkTermDialog.module.scss';
import { DialogContent } from './DialogContent';

const termI18nVariables = (list: any[], handleClick: (termId: string, idx: number) => void) => {
  const i18nValues: Record<string, string> = {};
  const i18nComponents: Record<string, React.ReactNode> = {};
  const termList = (list || []).slice(0, 4);
  termList.forEach((item, idx) => {
    i18nValues[`term${idx + 1}`] = item.title;
    i18nComponents[`a${idx + 1}`] = (
      <a
        href={getTermUrl(item.termId)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          handleClick(item.termId, idx);
        }}
      />
    );
  });
  return {
    len: termList.length,
    i18nValues,
    i18nComponents,
  };
};

const LINK_CONTENT_I18N_KEY = (termList: any[] = [], handleClick: (termId: string, idx: number) => void) => {
  const { len, i18nValues, i18nComponents } = termI18nVariables(termList, handleClick);
  return [
    <Trans
      key="21e139b9b81b4800a522"
      i18nKey="21e139b9b81b4800a522"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    <Trans
      key="6b8d52f068544000adfd"
      i18nKey="6b8d52f068544000adfd"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    <Trans
      key="9bbed59d49514000a21d"
      i18nKey="9bbed59d49514000a21d"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    <Trans
      key="bfd00938e8374800a9bd"
      i18nKey="bfd00938e8374800a9bd"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
  ][len - 1];
};

const LINK_LEAVE_CONTENT_I18N_KEY = (termList: any[] = [], handleClick: (termId: string, idx: number) => void) => {
  const { len, i18nValues, i18nComponents } = termI18nVariables(termList, handleClick);
  return [
    <Trans
      key="2bb9135787584800ab72"
      i18nKey="2bb9135787584800ab72"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    <Trans
      key="db34af5391cc4000a8ec"
      i18nKey="db34af5391cc4000a8ec"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    <Trans
      key="03259ee259aa4800a232"
      i18nKey="03259ee259aa4800a232"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
    <Trans
      key="820bee8259d74000a9d2"
      i18nKey="820bee8259d74000a9d2"
      ns="entrance"
      values={i18nValues}
      components={i18nComponents}
    />,
  ][len - 1];
};

interface LinkTermDialogProps {
  visible: boolean;
  userUpdateTermList: any[];
  refuseSignTermHandle: () => void;
  signTermHandle: (args?: any) => void;
  onClose?: () => void;
}

export const LinkTermDialog: React.FC<LinkTermDialogProps> = ({
  visible,
  userUpdateTermList,
  refuseSignTermHandle,
  signTermHandle,
  onClose,
}) => {
  const theme = useTheme();
  const { t: _t } = useTranslation('entrance');
  const hasInitRef = useRef(false);

  const [isLeave, setIsLeave] = useState(false);
  const hasEnterLeaveDialog = useRef(false);

  const agreeHandle = () => {
    signTermHandle?.(
      userUpdateTermList.map(item => ({
        termId: item.termId,
      }))
    );
    onClose?.();
  };

  const onLeaveInTerm = () => {
    trackClick({
      spm: ['Agreement_Link', 'Leave'],
    });
    if (hasEnterLeaveDialog.current) {
      setIsLeave(false);
      refuseSignTermHandle?.();
    } else {
      kcsensorsManualTrack({
        spm: ['Agreement_Link_Retain', 'Whole_Page'],
      });
      hasEnterLeaveDialog.current = true;
      setIsLeave(true);
    }
  };

  const onAgreeInTerm = () => {
    trackClick({
      spm: ['Agreement_Link', 'Comfirm'],
    });
    agreeHandle();
  };

  const onLeaveInRetain = () => {
    trackClick({
      spm: ['Agreement_Link_Retain', 'Leave'],
    });
    setIsLeave(false);
    refuseSignTermHandle?.();
  };

  const onAgreeInRetain = () => {
    trackClick({
      spm: ['Agreement_Link_Retain', 'Comfirm'],
    });
    agreeHandle();
  };

  const linkClickHandle = (termId: string) => {
    trackClick({
      spm: ['Agreement_Link', 'Agreement'],
      agreement_ids: termId,
    });
  };

  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['Agreement_Link', 'Whole_Page'],
    });
  }, []);

  useEffect(() => {
    if (userUpdateTermList && hasInitRef.current) {
      hasInitRef.current = false;
      userUpdateTermList.slice(0, 4).forEach(item => {
        kcsensorsManualTrack({
          spm: ['Agreement_Link', 'Agreement'],
          agreement_ids: item.termId,
        });
      });
    }
  }, [userUpdateTermList]);

  return (
    <Dialog
      open={visible}
      wrapClassName={styles.dialog}
      title={null}
      header={null}
      footer={null}
      onOk={null}
      onCancel={null}
      cancelText={null}
      okText={null}
      style={{ maxWidth: 400, width: '100%' }}
    >
      <div className={clsx(styles.dialogContentWrapper)}>
        <div className={clsx(styles.imgWrap)}>
          <img alt="term info tip" src={theme === 'dark' ? DialogInfoDark : DialogInfo} />
        </div>
        {!isLeave ? (
          <DialogContent
            contentText={LINK_CONTENT_I18N_KEY(userUpdateTermList, linkClickHandle)}
            descText={_t('929ed7212de84800a14a')}
            agreeText={_t('3c55461596fa4800a032')}
            refuseText={_t('69e1b779418e4000a304')}
            onAgreeHandle={onAgreeInTerm}
            onLeaveHandle={onLeaveInTerm}
          />
        ) : (
          <DialogContent
            titleText={_t('1394bc56eb714800a020')}
            contentText={LINK_LEAVE_CONTENT_I18N_KEY(userUpdateTermList, linkClickHandle)}
            descText={_t('8e40673aff114800a007')}
            agreeText={_t('02ab3b37d0024800ab26')}
            refuseText={_t('58a24e882a4e4000a088')}
            onAgreeHandle={onAgreeInRetain}
            onLeaveHandle={onLeaveInRetain}
          />
        )}
      </div>
    </Dialog>
  );
};

export default LinkTermDialog;
