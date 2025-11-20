/**
 * Owner: jesse.shao@kupotech.com
 */
import { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'dva';
import { MAINSITE_HOST } from 'utils/siteConfig';
import { Button } from '@kufox/mui';
import { Modal } from 'antd';
import { _t } from 'utils/lang';
import cls from 'clsx';
import JsBridge from 'utils/jsBridge';
import styles from './styles.less';

export default () => {
  const [open, setOpen] = useState(false);
  const isInApp = useSelector(state => state.app.isInApp);
  const supportCookieLogin = useSelector(state => state.app.supportCookieLogin);

  useEffect(() => {
    if (isInApp && !supportCookieLogin) {
      setOpen(true);
    }
  }, [isInApp, supportCookieLogin]);

  const onOk = useCallback(() => {
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/link?url=${MAINSITE_HOST}/download`,
      }
    });
  }, []);

  const onCancel = useCallback(() => {
    JsBridge.open({
      type: 'jump',
      params: {
        url: '/home',
      }
    });
  }, []);

  return (
    <Modal
      visible={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      wrapClassName={styles.voteModal}
      closeIcon={<></>}
      maskClosable={false}
      >
      <>
        <div className={styles.voteText}>{_t('choice.dialog.update')}</div>
        <div className={styles.btns}>
          <Button variant='text' className={cls(styles.btn, styles.cancelBtn)} onClick={onCancel}>{_t('choice.dialog.update.cancel')}</Button>
          <Button variant='text' className={styles.btn} onClick={onOk}>{_t('choice.dialog.update.ok')}</Button>
        </div>
      </>
    </Modal>
  );
}
