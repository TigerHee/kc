/**
 * Owner: odan.ou@kupotech.com
 */

import React, { useCallback, useState } from 'react';
import { Dialog } from '@kufox/mui';
import { useSelector } from 'src/hooks/useSelector';
import { CloseOutlined } from '@kufox/icons';
import DetailDialog from '../../DetailDialog';
import styles from './style.less';
import { _t } from 'tools/i18n';

const BaseDialog = (props) => {
  const { children, onClose, title, className, onDetialClick, time, scope } = props;
  const userId = useSelector(({ user }) => user.user?.uid);
  const [showDetail, setShowDetail] = useState(false);
  const onDetailClose = useCallback(() => {
    setShowDetail(false);
  }, []);
  const titleContent = (
    <div className="d_header">
      <div>
        <div className="d_title">{title}</div>
        <div className="d_uid">{_t('assets.por.uid', { uid: userId })}</div>
      </div>
    </div>
  );
  const onDetial = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setShowDetail(true);
    onDetialClick?.(); // 回调
  };
  const closeNode = (
    <div className="d_close">
      <div>
        <CloseOutlined size={20} />
      </div>
      <div onClick={onDetial} className="d_detail underline">
        {_t('assets.por.verify.intro')}
      </div>
    </div>
  );
  return (
    <>
      <Dialog
        open
        title={titleContent}
        className={`${styles.pro_dialog} ${className}`}
        onCancel={onClose}
        closeNode={closeNode}
        maskClosable
        footer={null}
      >
        {children}
      </Dialog>
      <DetailDialog visible={showDetail} onClose={onDetailClose} auditTime={time} scope={scope} />
    </>
  );
};
export default BaseDialog;
