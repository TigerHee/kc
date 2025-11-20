/**
 * Owner: jesse.shao@kupotech.com
 */
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { message } from 'antd';
import { Dialog, Drawer } from '@kufox/mui';
import { useSelector } from 'dva';
import { useIsMobile } from 'components/Responsive';
import JsBridge from 'utils/jsBridge';
import CopyToClipboard from 'react-copy-to-clipboard';
import styles from './styles.less';
import Qrcode from 'qrcode.react';
import cls from 'clsx';
import { ArrowLeftOutlined  } from '@kufox/icons';
import { _t, _tHTML } from 'utils/lang';
import { updateQueryStringParameter } from 'helper';
import IconScan from 'assets/showcase/InviteModal/icon_scan.svg';

export const InviteCard = ({
  rcode,
  onClickBtn,
  isMobile,
  isInApp,
  supportCookieLogin,
  shareUrl,
  currentLang,
}) => {
  const [scanCodeSize, setScanCodeSize] = useState(180);
  const scanCodeImg = useRef(null);

  const tmpShareUrl = shareUrl
    ? shareUrl
    : updateQueryStringParameter(window.location.href, 'rcode', rcode);

  useEffect(() => {
    if (scanCodeImg.current) {
      setScanCodeSize(scanCodeImg.current.getBoundingClientRect().width);
    }
  }, [scanCodeImg]);

  return (
    <div className={styles.inviteCard}>
      <div className={styles.title}>{_t('choice.invite.modal.title')}</div>
      <div className={styles.des}>{_tHTML('choice.invite.modal.des')}</div>
      <div className={styles.label}>{_t('choice.invite.modal.invite.link')}:</div>
      <div className={styles.link}>
        {tmpShareUrl}
        <CopyToClipboard
          text={tmpShareUrl}
          onCopy={() => message.success(`${_t('choice.invite.modal.invite.cpoy.success')}`)}
        >
          <span className={styles.copy}>{_t('choice.invite.modal.invite.cpoy')}</span>
        </CopyToClipboard>
      </div>
      <div className={styles.label}>{_t('choice.invite.modal.invite.scancode')}</div>
      <div className={styles.scanCode}>
        <div className={styles.scanImgHidden} ref={scanCodeImg} />
        <Qrcode value={tmpShareUrl} size={scanCodeSize} level="M" />
      </div>
      <div className={styles.label}>
        <img src={IconScan} alt="scan" className={styles.iconScan} />
        {_t('choice.invite.scan.btn')}
      </div>
      {(isMobile && !isInApp) || !supportCookieLogin ? null : (
        <div className={styles.btnWrapper}>
          <div className={styles.btn} onClick={onClickBtn}>
            {isMobile ? _t('choice.invite.scan.btn.direct') : _t('choice.invite.scan.btn.close')}
          </div>
        </div>
      )}
    </div>
  );
};

const Invite = ({ visible = false, onCancel, shareUrl, rcode }) => {
  const isMobile = useIsMobile();
  const isInApp = useSelector((state) => state.app.isInApp);
  const supportCookieLogin = useSelector((state) => state.showcase.supportCookieLogin);
  const currentLang = useSelector((state) => state.app.currentLang);

  const onClickBtn = useCallback(() => {
    if (isMobile) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'share',
          category: 'link',
          linkUrl: shareUrl,
          content: _t('choice.invite.scan.activity.link'),
        },
      });
      return;
    }
    onCancel();
  }, [isMobile, onCancel, shareUrl]);

  const inviteCardProps = useMemo(
    () => ({
      isMobile,
      onClickBtn,
      shareUrl,
      isInApp,
      supportCookieLogin,
      rcode,
      currentLang,
    }),
    [currentLang, isInApp, isMobile, onClickBtn, rcode, shareUrl, supportCookieLogin],
  );

  if (isMobile) {
    return (
      <Drawer anchor="right" open={visible} onClose={onCancel}>
        <div className={cls(styles.invitePage, { [styles.noInApp]: !isInApp })}>
          <div className={styles.backIcon}>
            <ArrowLeftOutlined onClick={onCancel} />
          </div>
          <InviteCard {...inviteCardProps} />
        </div>
      </Drawer>
    );
  }
  return (
    <Dialog open={visible} onCancel={onCancel} cancelText={null} okText={null}>
      <InviteCard {...inviteCardProps} />
    </Dialog>
  );
};

export default Invite;
