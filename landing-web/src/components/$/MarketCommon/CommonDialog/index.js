/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector, useDispatch } from 'dva';
import Dialog from '@kufox/mui/Dialog';
import { _t } from 'utils/lang';
import { useIsMobile } from '../config';
import styles from './style.less';

const CommonDialog = ({ namespace = 'newCoinCarnival' }) => {
  const dispatch = useDispatch();
  const { dialogConfig } = useSelector(state => state[namespace]);
  const { show, content } = dialogConfig || {};
  const isMobile = useIsMobile();

  const handleShow = value => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        dialogConfig: {
          show: value,
          content: '',
        },
      },
    });
  };

  return (
    <Dialog
      className={styles.container}
      size={isMobile ? 'mini' : 'basic'}
      title={null}
      showCloseX={false}
      cancelText={null}
      okText={_t('newCoin.toast.ok')}
      open={show}
      onOk={() => handleShow(false)}
      onCancel={() => handleShow(false)}
    >
      {content}
    </Dialog>
  );
};

export default CommonDialog;
