/**
 * Owner: sean.shi@kupotech.com
 * @description: SwitchMultiTypeModal component,目前仅支持三种验证方式的切换，Email，SMS，Google 2FA，不包含交易密码的场景
 */

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ICArrowRightOutlined, ICPlusOutlined } from '@kux/icons';
import { Dialog, MDialog, ThemeProvider } from '@kux/mui';
import useIsMobile from '../../hooks/useIsMobile';
import { EmailThinIcon, GaThinIcon, PhoneThinIcon } from '@kux/iconpack';
import { trackClick } from 'tools/sensors';
import styles from './index.module.scss';
import { useLang } from '../../hookTool';

const config = {
  google_2fa: {
    name: (_t: any) => _t('mBDd5m2KVc4w4zJVn66tU2'),
    shortName: (_t: any) => _t('mBDd5m2KVc4w4zJVn66tU2'),
    icon: <GaThinIcon />,
  },
  my_sms: {
    name: (_t: any) => _t('38b2a7b980124000a04a'),
    shortName: (_t: any) => _t('38b2a7b980124000a04a'),
    icon: <PhoneThinIcon />,
  },
  my_email: {
    name: (_t: any) => _t('5e072c122d574000a8ba'),
    shortName: (_t: any) => _t('5e072c122d574000a8ba'),
    icon: <EmailThinIcon />,
  },
};

export interface ISwitchMultiTypeModalProps {
  open: boolean;
  withDrawer?: boolean;
  tabKey?: string;
  onCancel: () => void;
  validations?: string[][];
  currentType?: number;
  onOk: (nth: number) => void;
  theme?: any;
}

export const SwitchMultiTypeModal: React.FC<ISwitchMultiTypeModalProps> = ({
  open,
  withDrawer,
  tabKey,
  onCancel,
  validations = [],
  currentType = 0,
  onOk,
}) => {
  const { t } = useLang();
  const isH5 = useIsMobile();

  const sensorsRef = useRef<any>(null);

  useEffect(() => {
    if (sensorsRef.current) {
      trackClick(['switch_login_verify', '1'], {
        type: tabKey,
        source: validations?.join('-'),
        mode: 'v2',
      });
    }
  }, [tabKey, validations]);

  const handleOk = (nth: number) => {
    sensorsRef.current = 1;
    trackClick([withDrawer ? 'sideswitch' : 'switch', '1']);
    onOk(nth);
    onCancel();
  };

  const renderTypeList = (typeList: string[], key: number) => {
    if (key === currentType) {
      return null;
    }
    return (
      <div
        key={key}
        className={clsx(styles.item)}
        style={{ marginBottom: key + 1 !== validations.length ? (isH5 ? '16px' : '24px') : '0px' }}
        onClick={() => handleOk(key)}
      >
        {typeList.map((type, index) => {
          const info = config[type as keyof typeof config];
          return (
            <div
              key={type}
              className={clsx(styles.validateItemWithIcon)}
              style={{
                marginRight: index + 1 !== typeList.length ? '16px' : '0px',
              }}
            >
              <div className={clsx(styles.validateItem)}>
                <div className={clsx(styles.typeIcon)}>{info?.icon}</div>
                <div className={clsx(styles.typeName)}>{isH5 ? info?.shortName(t) : info?.name(t)}</div>
              </div>
              {index + 1 !== typeList.length && <ICPlusOutlined className={clsx(styles.plusIcon)} />}
            </div>
          );
        })}

        <div className={clsx(styles.iconWrapper)}>
            <ICArrowRightOutlined className={clsx(styles.arrowIcon)} />
          </div>
      </div>
    );
  };

  if (isH5) {
    return (
      <MDialog
        back={false}
        title={t('pAqyaWwQUk1rafMSbFBKZk')}
        show={open}
        onClose={onCancel}
        onOk={onCancel}
        onCancel={onCancel}
        maskClosable
        centeredFooterButt
        footer={null}
        height="auto"
      >
        <section className={styles.content}>
          {validations?.map((item, index) => {
            return renderTypeList(item, index);
          })}
        </section>
      </MDialog>
    );
  }

  if (validations.length === 0) {
    return null;
  }

  return (
    <Dialog
      title={t('pAqyaWwQUk1rafMSbFBKZk')}
      size="medium"
      cancelText={null}
      footer={null}
      open={open}
      onCancel={onCancel}
      style={{ maxWidth: '520px' }}
      onOk={handleOk}
      className={styles.customDialog}
    >
      <section className={styles.content}>
        {validations?.map((item, index) => {
          return renderTypeList(item, index);
        })}
      </section>
    </Dialog>
  );
};

export default (props: ISwitchMultiTypeModalProps) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SwitchMultiTypeModal {...props} />
    </ThemeProvider>
  );
};
