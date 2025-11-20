/**
 * Owner: eli.xiang@kupotech.com
 */
import { Button, Empty, Modal } from '@kux/design';
import { memo, useEffect, useState } from 'react';
import { useRouter } from 'kc-next/router';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import PasskeyAddDialog from './PasskeyAddDialog';
import PasskeyDeleteDialog from './PasskeyDeleteDialog';
import PasskeyEditDialog from './PasskeyEditDialog';
import PasskeyList from './PasskeyList';
import usePasskeyList from 'src/hooks/usePasskeyList';
import JsBridge from 'gbiz-next/bridge';
import { replace } from 'utils/router';
import { ArrowLeft2Icon } from '@kux/iconpack';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Back } from 'src/components/Account/Security/Back';
import { securityGoBack } from 'src/utils/router';
import { passkeysSupported } from 'src/utils/webauthn-json';
import storage from 'utils/storage';
import EmptyPasskey from './EmptyPasskey';
import * as styles from './styles.module.scss';
import { IS_SERVER_ENV } from 'kc-next/env';

function PasskeyPage() {
  const dispatch = useDispatch();
  const { passkeyList, updatePasskeyList } = usePasskeyList();
  const [addPasskeyDialogVisible, setAddPasskeyDialogVisible] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { isSub = false } = useSelector((state) => state?.user?.user) || {};
  const [isSupportPasskey, setIsSupportPasskey] = useState(false);
  const [notSupportPasskeyModalOpen, setNotSupportPasskeyModalOpen] = useState(false);
  const router = useRouter();
  const initialProps = useInitialProps();
  const IS_IN_APP = IS_SERVER_ENV ? initialProps?.['_platform'] === 'app' : JsBridge.isApp();

  const handleCreate = () => {
    if (isSupportPasskey) {
      setAddPasskeyDialogVisible(true);
    } else {
      setNotSupportPasskeyModalOpen(true);
    }
  };

  const handleBack = () => {
    securityGoBack();
  };

  useEffect(() => {
    if (JsBridge.isApp()) {
      /** 关闭 app loading 蒙层 */
      JsBridge.open({
        type: 'func',
        params: {
          name: 'onPageMount',
          dclTime: window.DCLTIME,
          pageType: window._useSSG ? 'SSG' : 'CSR', //'SSR|SSG|ISR|CSR'
        },
      });
    }
  }, []);

  useEffect(() => {
    if (JsBridge.isApp()) {
      // 判断设备是否支持 passkey
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'isDeviceSupportPasskey' },
        },
        (res) => {
          if (res.code === 0 && res.data) {
            setIsSupportPasskey(res.data);
          }
        },
      );
    } else {
      setIsSupportPasskey(passkeysSupported());
    }
  }, []);

  useEffect(() => {
    const callPasskeyRegister = storage.getItem('callPasskeyRegister');
    if (isSupportPasskey && callPasskeyRegister) {
      // passkey引导弹窗跳转过来，直接打开注册passkey弹窗
      handleCreate();
      storage.removeItem('callPasskeyRegister');
    }
  }, [isSupportPasskey]);

  return (
    <main
      className={classNames(styles.container, { [styles.isApp]: IS_IN_APP })}
      data-inspector="account_security_passkey"
    >
      {IS_IN_APP ? (
        <Back showBot title={_t('d0a7e34d03b94000a3e4')} />
      ) : (
        <div className={styles.header}>
          <div className={styles.nav}>
            <div className={styles.backWrapper} onClick={handleBack}>
              <ArrowLeft2Icon size="small" width={16} height={16} />
              <span>{_t('back')}</span>
            </div>
            <div className={styles.title}>{_t('d0a7e34d03b94000a3e4')}</div>
          </div>
          <div className={styles.title}>
            {passkeyList.length ? (
              <>
                <div>
                  <span>{_t('d0a7e34d03b94000a3e4')}</span>
                  <span className={styles.desc}>
                    {_tHTML('48d779a2c97f4000acdc', { a: '/support/36658009244057' })}
                  </span>
                </div>
                {!isSub ? (
                  <div>
                    <Button type="primary" onClick={handleCreate}>
                      {_t('92b3f6d83af34000a505')}
                    </Button>
                  </div>
                ) : null}
              </>
            ) : (
              <div>{_t('d0a7e34d03b94000a3e4')}</div>
            )}
          </div>
        </div>
      )}
      <section
        className={classNames(styles.content, {
          [styles.isEmpty]: !passkeyList.length,
        })}
      >
        {passkeyList.length ? (
          <PasskeyList
            list={passkeyList}
            onCreate={handleCreate}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
          />
        ) : (
          <EmptyPasskey onCreate={handleCreate} />
        )}
      </section>
      <PasskeyAddDialog
        open={addPasskeyDialogVisible}
        isFirst={!passkeyList.length}
        onSuccess={() => {
          setAddPasskeyDialogVisible(false);
          updatePasskeyList();
          dispatch({ type: 'user/pullUser' });
          const callPasskeyRegister = storage.getItem('callPasskeyRegister');
          if (callPasskeyRegister) {
            // 消费完 callPasskeyRegister 后需要从location.state去掉
            replace(router?.pathname + window.location.search);
            storage.removeItem('callPasskeyRegister');
          }
        }}
        onCancel={() => {
          setAddPasskeyDialogVisible(false);
        }}
      />
      <PasskeyEditDialog
        open={Boolean(editTarget)}
        values={editTarget}
        onSuccess={() => {
          setEditTarget(null);
          updatePasskeyList();
        }}
        onCancel={() => setEditTarget(null)}
      />
      <PasskeyDeleteDialog
        open={Boolean(deleteTarget)}
        values={deleteTarget}
        onSuccess={() => {
          setDeleteTarget(null);
          updatePasskeyList();
          dispatch({ type: 'user/pullUser' });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
      <Modal
        isOpen={notSupportPasskeyModalOpen}
        className={styles.notSupportPasskeyModal}
        okText={_t('i.know')}
        onOk={() => setNotSupportPasskeyModalOpen(false)}
        onClose={() => setNotSupportPasskeyModalOpen(false)}
      >
        <Empty
          name="error"
          size="small"
          title={_t('adaf16134ab54000af0a')}
          description={
            <div className={styles.failReason}>
              <div>
                {_tHTML('12dc1b4556074800adda', { url: addLangToPath('/support/36658009244057') })}
              </div>
            </div>
          }
        />
      </Modal>
    </main>
  );
}

export default memo(PasskeyPage);
