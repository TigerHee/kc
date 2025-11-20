/**
 * Owner: eli.xiang@kupotech.com
 */
import { Alert, Button, useTheme } from '@kux/design';
import { DeleteIcon, EditIcon, PlusIcon } from '@kux/iconpack';
import AndroidIconDark from 'static/ucenter/passkey/androidIcon-dark.svg';
import AndroidIcon from 'static/ucenter/passkey/androidIcon.svg';
import AppleIconDark from 'static/ucenter/passkey/appleIcon-dark.svg';
import AppleIcon from 'static/ucenter/passkey/appleIcon.svg';
import WindowsIconDark from 'static/ucenter/passkey/windowsIcon-dark.svg';
import WindowsIcon from 'static/ucenter/passkey/windowsIcon.svg';
import { _t } from 'tools/i18n';
import * as styles from './styles.module.scss';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const SystemIconMap = {
  windows: WindowsIcon,
  ios: AppleIcon,
  macos: AppleIcon,
  android: AndroidIcon,
  windowsDark: WindowsIconDark,
  iosDark: AppleIconDark,
  macosDark: AppleIconDark,
  androidDark: AndroidIconDark,
};

function getSystemIcon(system, currentTheme) {
  let lowerSystem = system?.toLowerCase();
  if (currentTheme === 'dark') {
    lowerSystem += 'Dark';
  }
  return Object.keys(SystemIconMap).includes(lowerSystem)
    ? SystemIconMap[lowerSystem]
    : WindowsIcon;
}

export default function PasskeyList({ list, onCreate, onEdit, onDelete }) {
  const currentTheme = useTheme();
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;
  const iconBtnSize = isH5 ? 18 : 24;

  return (
    <div className={styles.container}>
      <Alert
        className={styles.alert}
        type="info"
        duration={0}
        message={_t('c5b65a27ed444000a61d', { num: list.length })}
      />
      <div className={styles.list}>
        {list.map((item) => {
          const {
            system,
            credentialNickname,
            createdAt,
            lastUsedAt,
            deviceInfo,
            location,
            lastUsedIp,
          } = item;
          return (
            <div className={styles.item} key={item.id}>
              <div className={styles.itemHeader}>
                <img src={getSystemIcon(system, currentTheme)} alt="system icon" />
                <span>{credentialNickname}</span>
                <span>
                  <EditIcon width={iconBtnSize} height={iconBtnSize} onClick={() => onEdit(item)} />
                  <DeleteIcon
                    width={iconBtnSize}
                    height={iconBtnSize}
                    onClick={() => onDelete(item)}
                  />
                </span>
              </div>
              <div className={styles.itemContent}>
                {createdAt ? (
                  <div>
                    <span>{_t('29a9a23e442e4000acea')}&nbsp;</span>
                    <span>{new Date(createdAt).toLocaleString()}</span>
                  </div>
                ) : null}
                <div>
                  <span>{_t('64f676e4b1024000a3dd')}&nbsp;</span>
                  <span>
                    {lastUsedAt
                      ? new Date(lastUsedAt).toLocaleString()
                      : _t('3992d88139914000aa2b')}
                  </span>
                </div>
                {deviceInfo?.lastDevice ? (
                  <div>
                    <span>{_t('365318f9fc5b4000aba4')}&nbsp;</span>
                    <span>{deviceInfo.lastDevice}</span>
                  </div>
                ) : null}
                {!!(location || lastUsedIp) ? (
                  <div>
                    <span>
                      {_t('db274056f8e14000ad80')} {location || lastUsedIp}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.noMore}>
        <span>{_t('865e5425eeb64000adb0')}</span>
      </div>
      {isH5 ? (
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
