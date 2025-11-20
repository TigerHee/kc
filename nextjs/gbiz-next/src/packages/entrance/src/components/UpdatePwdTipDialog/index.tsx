/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Checkbox, Button, ThemeProvider, Dialog } from '@kux/mui';
import { isNumber } from 'lodash-es';
import { getCsrf, setCsrf } from 'tools/csrf';
import { getTenantConfig } from '../../config/tenant';
import { getUserInfoUsingGet, queryChangePasswordUsingGet, expandPasswordDurationUsingPost } from '../../api/ucenter';
import { kcsensorsManualTrack, trackClick } from 'tools/sensors'
import addLangToPath from 'tools/addLangToPath';
import styles from './index.module.scss';
import { useLang } from '../../hookTool';

export interface IUpdatePwdTipDialogProps {
  onCallback: () => void;
  isInit: boolean;
  theme?: any;
  [key: string]: any;
}

const UpdatePwdTipDialog: React.FC<IUpdatePwdTipDialogProps> = ({
  onCallback,
  isInit,
  theme,
  ...otherProps
}) => {
  const tenantConfig = getTenantConfig();
  const { t: _t } = useLang();
  const [tipData, setTipData] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isInit) {
      const intData = async () => {
        try {
          const res = await queryChangePasswordUsingGet();
          const data = res?.data || {};
          setTipData(data);
          if (data.overDue) {
            setOpen(true);
          } else {
            onCallback();
          }
        } catch (error) {
          onCallback();
        }
      };

      if (tenantConfig.signin.isSupportUpdatePwdTipDialog) {
        intData();
      } else {
        onCallback();
      }
    }
  }, [isInit]);

  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['ChangePassword', '1'],
    });
  }, []);

  const onClose = () => {
    setOpen(false);
  };

  const onPageToUpdate = () => {
    trackClick(['ChangePassword', 'Comfirm']);
    window.location.href = addLangToPath(
      '/account/security/updatepwd'
    );
    onClose();
  };

  const onIgnore = async () => {
    if (hasChecked) {
      try {
        if (!getCsrf()) {
          const res = await getUserInfoUsingGet();
          if ((res?.data as any)?.csrf) {
            setCsrf((res?.data as any)?.csrf);
          }
        }
        await expandPasswordDurationUsingPost();
      } catch (error) {
        // ignore
      }
    }
    trackClick(['ChangePassword', 'Cancel']);
    onCallback();
    onClose();
  };

  const onHandleClick = (update: boolean) => {
    const fn = update ? onPageToUpdate : onIgnore;
    fn();
  };

  return (
    <ThemeProvider theme={theme || 'light'}>
      <Dialog
        title={_t('01f1b386d6664800a783')}
        footer={null}
        onCancel={() => {
          onHandleClick(false);
        }}
        open={open}
        {...otherProps}
      >
        <div className={clsx(styles.content)}>
          <div className={clsx(styles.desc)}>{_t('9613f98e9fc44000ac94')}</div>
          {isNumber(tipData.exemptionDay) && tipData.exemptionDay > 0 && (
            <Checkbox
              checked={hasChecked}
              onChange={(e) => {
                trackClick(['ChangePassword', 'NoRemind_Checkbox']);
                setHasChecked(e.target.checked);
              }}
              checkOptions={{
                type: 2,
                checkedType: 1,
              }}
            >
              <span className={clsx(styles.ignoreTime)}>
                {_t('71a0cef16aa94000a005', { num: tipData.exemptionDay })}
              </span>
            </Checkbox>
          )}
          <div className={clsx(styles.btnBox)}>
            <Button
              onClick={() => {
                onHandleClick(true);
              }}
              variant="contained"
              fullWidth
            >
              {_t('9f5a9cfae6374000a63a')}
            </Button>
            <Button
              onClick={() => {
                onHandleClick(false);
              }}
              variant="text"
            >
              {_t('1b90309ee9ae4000ae08')}
            </Button>
          </div>
        </div>
      </Dialog>
    </ThemeProvider>
  );
};

export default UpdatePwdTipDialog;