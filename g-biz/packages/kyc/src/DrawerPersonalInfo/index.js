/**
 * Owner: iron@kupotech.com
 */
import React, { useState } from 'react';
import { Box, Drawer, Alert, ThemeProvider } from '@kufox/mui';

import { CloseOutlined } from '@kufox/icons';
import { css } from '@emotion/react';
import { useTranslation } from '@tools/i18n';
import CheckFailed from '../components/CheckFailed';
import PersonalInfoForm from '../components/PersonalInfoForm';

const useStyle = () => {
  return {
    drawer: css`
      width: 100%;
      max-width: 432px;
    `,
    arrow: css`
      display: flex;
      justify-content: flex-end;
    `,
    title: css`
      font-weight: bold;
      font-size: 36px;
      line-height: 48px;
      margin-bottom: 24px;
    `,
    alert: css`
      margin-bottom: 24px;
    `,
  };
};

function DrawerPersonalInfo({
  open,
  onClose,
  onSuccessCallback,
  onError,
  toKyc2Verify,
  currentLang = 'zh_CN',
  BoxProps = {},
  ...restProps
}) {
  const styles = useStyle();
  const [check, setCheck] = useState(false);
  const { t: _t } = useTranslation('kyc');

  const formProps = {
    onSuccessCallback,
    identity2VerifyFailedCallback: () => setCheck(true),
    onError,
    currentLang,
  };

  return (
    <Drawer show={open} onClose={onClose} anchor="right" {...restProps} css={styles.drawer}>
      <div css={styles.arrow}>
        <CloseOutlined size={28} style={{ cursor: 'pointer' }} onClick={onClose} />
      </div>
      <Box {...BoxProps}>
        {!check ? (
          <div>
            <div css={styles.title}>{_t('kyc.account.sec.personal.info')}</div>
            <div css={styles.alert}>
              <Alert type="warning" description={_t('kyc.account.sec.des')} />
            </div>
            <div>
              <PersonalInfoForm {...formProps} />
            </div>
          </div>
        ) : (
          <CheckFailed onCallback={toKyc2Verify} />
        )}
      </Box>
    </Drawer>
  );
}

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'theme'}>
      <DrawerPersonalInfo {...props} />
    </ThemeProvider>
  );
};
