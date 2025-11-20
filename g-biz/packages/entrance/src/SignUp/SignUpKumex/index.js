/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import { ICCloseOutlined } from '@kux/icons';
import { Box, Drawer, Divider, useTheme, styled, isPropValid } from '@kux/mui';

import { useSelector, useDispatch } from 'react-redux';
import { noop, isEmpty, find } from 'lodash';
import { Captcha } from '@packages/captcha';
import { kcsensorsManualTrack } from '@utils/sensors';
import EmailSign from '../EmailSign';
import PhoneSign from '../PhoneSign';

import {
  SIGN_EMAIL_TAB_KEY,
  EMAIL_BIZTYPE,
  PHONE_BIZTYPE,
  SIGN_PHONE_TAB_KEY,
  NAMESPACE,
} from '../constants';

import { useLang } from '../../hookTool';

const Title = styled('h3', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '36px',
    color: theme.colors.text,
  };
});

const TabBox = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    fontSize: '14px',
    lineHeight: '22px',
    color: theme.colors.primary,
    cursor: 'pointer',
  };
});

const Tips = styled(Box, {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    display: 'flex',
    height: 22,
    fontSize: '14px',
    lineHeight: '22px',
  };
});

const TopBox = styled(Box, {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    marginBottom: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };
});

const Fab = styled(Box, {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    cursor: 'pointer',
  };
});

const SignUpKumex = (props) => {
  const {
    open,
    BoxProps,
    agreeJSX = null,
    onChange = noop,
    handleLogin = noop,
    logo,
    NumberComponent,
    Footer = null,
    ZendeskIcon = null,
    defaultCountryCode = 'CN',
    trackingConfig = {},
    ...restProps
  } = props;

  const { t } = useLang();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: `${NAMESPACE}/getCountryCodes` });
  }, []);

  // 侧边栏注册-曝光埋点
  useEffect(() => {
    if (open) {
      kcsensorsManualTrack({
        spm: ['popUp', '1'],
        data: {
          pagecate: 'sideRegister',
          ...((trackingConfig && trackingConfig.data) || {}),
        },
      });
    }
  }, [open]);

  const { bizType, countryCodes, isCaptchaOpen, sendVerifyCodePayload } = useSelector(
    (state) => state[NAMESPACE],
  );

  const handleTypeChange = (tabKey) => {
    const convertMaps = {
      [PHONE_BIZTYPE]: EMAIL_BIZTYPE,
      [EMAIL_BIZTYPE]: PHONE_BIZTYPE,
    };
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        bizType: convertMaps[tabKey],
      },
    });
  };

  useEffect(() => {
    if (!isEmpty(countryCodes)) {
      const countryCode = find(countryCodes, (o) => {
        return o.code === defaultCountryCode;
      });

      if (!countryCode) {
        dispatch({
          type: `${NAMESPACE}/update`,
          payload: {
            bizType: EMAIL_BIZTYPE,
          },
        });
      } else {
        dispatch({
          type: `${NAMESPACE}/update`,
          payload: {
            bizType: PHONE_BIZTYPE,
          },
        });
      }
    }
  }, [countryCodes, defaultCountryCode]);

  const theme = useTheme();

  const onCloseCaptcha = () => {
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: { isCaptchaOpen: false },
    });
  };

  const onValidateSuccess = () => {
    onCloseCaptcha();
    dispatch({
      type: `${NAMESPACE}/sendVerifyCode`,
      payload: sendVerifyCodePayload,
    });
    kcsensorsManualTrack({ spm: ['robotSuccess', '1'] }, 'page_click');
  };

  const onValidateError = () => {
    kcsensorsManualTrack({ spm: ['robotfail', '1'] }, 'page_click');
  };

  return (
    <Drawer open={open} {...restProps}>
      <>
        <Box height="48px">{logo}</Box>
        <Fab onClick={restProps.onClose}>
          <ICCloseOutlined size={24} />
        </Fab>

        <Box maxWidth={480} mt={3.5} p={2} {...BoxProps}>
          <TopBox>
            <Title as="div">{t('signup_tip')}</Title>
            <TabBox theme={theme} onClick={() => handleTypeChange(bizType)}>
              {bizType === PHONE_BIZTYPE ? t(SIGN_EMAIL_TAB_KEY) : t(SIGN_PHONE_TAB_KEY)}
            </TabBox>
          </TopBox>

          <Tips mb={3}>
            {t('signup_num_pre')}
            {NumberComponent}
            {t('signup_num_sur')}
          </Tips>

          <Box>
            <Box
              style={{
                display: bizType !== PHONE_BIZTYPE ? 'none' : 'block',
              }}
            >
              <PhoneSign
                defaultCountryCode={defaultCountryCode}
                agreeJSX={agreeJSX}
                onChange={onChange}
                isKumex
                trackingConfig={trackingConfig}
                fromDrawer
              />
            </Box>
            <Box
              style={{
                display: bizType !== EMAIL_BIZTYPE ? 'none' : 'block',
              }}
            >
              <EmailSign
                agreeJSX={agreeJSX}
                onChange={onChange}
                isKumex
                trackingConfig={trackingConfig}
                fromDrawer
              />
            </Box>
          </Box>
          <Box mt={3} mb={3}>
            {t('signup_change_login')}
            <TabBox as="span" onClick={handleLogin}>
              {t('login')}
            </TabBox>
            <Box>{ZendeskIcon}</Box>
          </Box>
          <Divider />

          <Box>{Footer}</Box>

          <Captcha
            bizType={bizType}
            open={isCaptchaOpen}
            onClose={onCloseCaptcha}
            onValidateSuccess={onValidateSuccess}
            onValidateError={onValidateError}
          />
        </Box>
      </>
    </Drawer>
  );
};

export default SignUpKumex;
