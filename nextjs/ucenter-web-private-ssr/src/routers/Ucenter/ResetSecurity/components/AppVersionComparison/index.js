import JsBridge from 'gbiz-next/bridge';
import { Empty, Loading, Modal } from '@kux/design';
import { useEffect, useRef, useState } from 'react';
import { _t } from 'tools/i18n';
import compareVersion from 'utils/compareVersion';
import toContactSupport from '../../utils/toContactSupport';
import * as styles from './styles.module.scss';

const IS_IN_APP = JsBridge.isApp();

/** 判断当前版本是否兼容，不兼容则弹窗提示用户升级 app */
export default function AppVersionComparison({ minAppVersion, children }) {
  const [isLoaded, setIsLoaded] = useState(!IS_IN_APP);
  const [isCompatible, setIsCompatible] = useState(!IS_IN_APP);

  /**
   * model 组件有 bug，onOk 和 onCancel 会同时触发 onClose
   * 这里用一个 ref 来记录是否已经响应过回调，避免重复响应
   */
  const consumedRef = useRef(null);
  const handleClose = () => {
    if (consumedRef.current) {
      consumedRef.current = false;
      return;
    }
    // app 通过桥退出 webview
    JsBridge.open({
      type: 'func',
      params: { name: 'exit' },
    });
  };

  useEffect(() => {
    if (IS_IN_APP) {
      JsBridge.open(
        {
          type: 'func',
          params: {
            name: 'getAppVersion',
          },
        },
        ({ data: version }) => {
          setIsCompatible(compareVersion(version, minAppVersion) >= 0);
          setIsLoaded(true);
        },
      );
    } else {
      setIsCompatible(true);
      setIsLoaded(true);
    }
  }, [minAppVersion]);

  return isLoaded ? (
    <>
      {children}
      <Modal
        isOpen={!isCompatible}
        title={null}
        className={styles.modal}
        footerDirection="vertical"
        mobileTransform
        okText={_t('i.know')}
        onOk={() => {
          handleClose();
          consumedRef.current = true;
        }}
        cancelText={_t('4925cb44868a4000aa9c')}
        onCancel={() => {
          toContactSupport();
          consumedRef.current = true;
        }}
        onClose={handleClose}
      >
        <Empty name="error" size="small" title={_t('6b455bf7edfe4800a172')} />
      </Modal>
    </>
  ) : (
    <Loading size="large" fullScreen />
  );
}
