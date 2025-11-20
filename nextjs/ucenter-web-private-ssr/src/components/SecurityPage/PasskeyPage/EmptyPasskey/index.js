import { Button, useTheme } from '@kux/design';
import { PlusIcon } from '@kux/iconpack';
import { useSelector } from 'react-redux';
import passkeyVerifyingDarkSrc from 'static/account/security/passkey/passkey-verifying.dark.svg';
import passkeyVerifyingSrc from 'static/account/security/passkey/passkey-verifying.svg';
import PasskeyTip1IconDark from 'static/ucenter/passkey/tip-1-dark.svg';
import PasskeyTip1Icon from 'static/ucenter/passkey/tip-1.svg';
import PasskeyTip2IconDark from 'static/ucenter/passkey/tip-2-dark.svg';
import PasskeyTip2Icon from 'static/ucenter/passkey/tip-2.svg';
import PasskeyTip3IconDark from 'static/ucenter/passkey/tip-3-dark.svg';
import PasskeyTip3Icon from 'static/ucenter/passkey/tip-3.svg';
import { _t, _tHTML } from 'tools/i18n';
import * as styles from './styles.module.scss';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const PasskeyTips = () => [
  {
    title: _t('defcca9ca94b4000ada3'),
    desc: _t('30b6b19f8c774000a1df'),
    icon: PasskeyTip1Icon,
    darkIcon: PasskeyTip1IconDark,
  },
  {
    title: _t('4d75d3c793ec4000a000'),
    desc: _t('ff460e93b6cf4000aebb'),
    icon: PasskeyTip2Icon,
    darkIcon: PasskeyTip2IconDark,
  },
  {
    title: _t('f774606ffc8c4000acef'),
    desc: _t('ac9d7e59e2eb4000a59e'),
    icon: PasskeyTip3Icon,
    darkIcon: PasskeyTip3IconDark,
  },
];

export default function EmptyPasskey({ onCreate }) {
  const theme = useTheme();
  const rv = useResponsiveSSR();
  const { isSub = false } = useSelector((state) => state?.user?.user) || {};

  const isDark = theme === 'dark';
  const isH5 = !rv?.sm;

  return (
    <div className={styles.emptyArea}>
      <div>
        <img
          className={styles.passkeyVerifyingIcon}
          src={isDark ? passkeyVerifyingDarkSrc : passkeyVerifyingSrc}
          alt="passkey-verifying"
        />
        <div className={styles.tip}>{_t('3b170fa5d11c4000a920')}</div>
        {!isH5 ? (
          <div className={styles.subTip}>
            {_tHTML('48d779a2c97f4000acdc', { a: '/support/36658009244057' })}
          </div>
        ) : null}
      </div>
      <div>
        <div className={styles.advantageList}>
          {PasskeyTips().map((item) => {
            return (
              <div className={styles.advantageItem} key={item.title}>
                <img src={isDark ? item.darkIcon : item.icon} alt="passkey tip" />
                <div>
                  <div>{item.title}</div>
                  <div>{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
        {isH5 ? (
          <div className={styles.learnMore}>
            {_tHTML('48d779a2c97f4000acdc', { a: '/support/36658009244057' })}
          </div>
        ) : null}
      </div>
      {!isSub ? (
        <div className={styles.createButtonWrapper}>
          <Button type="primary" size="large" onClick={onCreate}>
            <PlusIcon size="20" width="20" height="20" />
            <span>{_t('92b3f6d83af34000a505')}</span>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
