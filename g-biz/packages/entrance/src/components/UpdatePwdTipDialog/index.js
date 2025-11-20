/**
 * Owner: tiger@kupotech.com
 */
import { Checkbox, Button, ThemeProvider } from '@kux/mui';
import { useEffect, useState } from 'react';
import { isNumber } from 'lodash';
import storage from '@utils/storage';
import { useTranslation } from '@tools/i18n';
import { getCsrf, setCsrf } from '@tools/csrf';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import {
  queryChangePassword,
  expandPasswordDuration,
  getUserInfo,
} from '@packages/entrance/src/Login/service';
import { kcsensorsManualTrack, kcsensorsClick, addLangToPath } from '../../common/tools';
import { DialogWrapper, Content } from './style';

export default ({ onCallback, isInit, theme, ...otherProps }) => {
  const { t: _t } = useTranslation('entrance');
  const [tipData, setTipData] = useState({});
  const [open, setOpen] = useState(false);
  // 是否勾选
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isInit) {
      const intData = async () => {
        try {
          const res = await queryChangePassword();
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
    kcsensorsClick(['ChangePassword', 'Comfirm']);
    window.location.href = addLangToPath(
      '/account/security/updatepwd',
      storage.getItem('kucoinv2_lang'),
    );
    onClose();
  };

  const onIgnore = async () => {
    if (hasChecked) {
      try {
        if (!getCsrf()) {
          const res = await getUserInfo();
          if (res?.data?.csrf) {
            setCsrf(res?.data?.csrf);
          }
        }
        await expandPasswordDuration();
      } catch (error) {
        console.error('error === ', error);
      }
    }
    kcsensorsClick(['ChangePassword', 'Cancel']);
    onCallback();
    onClose();
  };

  const onHandleClick = (update) => {
    const fn = update ? onPageToUpdate : onIgnore;
    fn();
  };

  return (
    <ThemeProvider theme={theme || 'light'}>
      <DialogWrapper
        title={_t('01f1b386d6664800a783')}
        footer={null}
        onCancel={() => {
          onHandleClick(false);
        }}
        open={open}
        {...otherProps}
      >
        <Content>
          <div className="desc">{_t('9613f98e9fc44000ac94')}</div>

          {isNumber(tipData.exemptionDay) && tipData.exemptionDay > 0 && (
            <Checkbox
              checked={hasChecked}
              onChange={(e) => {
                kcsensorsClick(['ChangePassword', 'NoRemind_Checkbox']);
                setHasChecked(e.target.checked);
              }}
              checkOptions={{
                type: 2,
                checkedType: 1,
              }}
            >
              <span className="ignoreTime">
                {_t('71a0cef16aa94000a005', { num: tipData.exemptionDay })}
              </span>
            </Checkbox>
          )}

          <div className="btnBox">
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
        </Content>
      </DialogWrapper>
    </ThemeProvider>
  );
};
