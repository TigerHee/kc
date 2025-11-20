/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme, Drawer, Box, ThemeProvider, Notification, Snackbar } from '@kufox/mui';
import { css } from '@emotion/react';
import { CloseOutlined } from '@kufox/icons';
import { find, includes, isArray, isEmpty } from 'lodash';
import { VER_SMS, VER_EMAIL, VERIFY_QUIT } from '../common/constants';
import { namespace } from './model';
import ModeButton from './ModeButton';
import VerifyForm from './VerifyForm';
import { useLang } from '../hookTool';

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;

const useStyles = (theme) => {
  return {
    title: css`
      font-size: 36px;
      line-height: 48px;
      padding: 40px 0;
      text-align: center;
      font-weight: 500;
      color: ${theme.colors.text};
    `,
    closeIcon: css`
      display: flex;
      justify-content: flex-end;
      cursor: pointer;
    `,
    drawer: css`
      max-width: 460px;
      width: 100%;
    `,
  };
};

const SecurityVerify = (props) => {
  const { anchor = 'right', boxProps = {}, ...restProps } = props;
  const { needVerifyActions } = useSelector((state) => state[namespace]);
  const dispatch = useDispatch();

  const { t } = useLang();

  const emailActions = find(needVerifyActions, (o) => {
    return includes(o, VER_EMAIL);
  });

  const smsActions = find(needVerifyActions, (o) => {
    return includes(o, VER_SMS);
  });

  const actionsMap = {
    [VER_EMAIL]: emailActions || needVerifyActions[0] || [],
    [VER_SMS]: smsActions || needVerifyActions[0] || [],
  };

  const multipleMode = needVerifyActions.length > 1;

  const [mode, setMode] = useState(VER_EMAIL);

  useEffect(() => {
    if (isArray(smsActions)) {
      setMode(VER_SMS);
    }
  }, [smsActions]);

  const theme = useTheme();
  const classes = useStyles(theme);

  const open = !isEmpty(needVerifyActions);

  const handleModeChange = (value) => {
    setMode(value);
  };

  const handleClose = () => {
    dispatch({
      type: VERIFY_QUIT,
    });
  };

  return (
    <Drawer anchor={anchor} show={open} onClose={handleClose} css={classes.drawer} {...restProps}>
      <div css={classes.closeIcon} onClick={handleClose}>
        <CloseOutlined size={24} />
      </div>
      <Box width="100%" p={8} pt={19.75} {...boxProps}>
        <div>
          <div css={classes.title}>{t('verify')}</div>
          <div>
            <ModeButton show={multipleMode} mode={mode} onChange={handleModeChange} />
          </div>
        </div>
        <Box mt={4.75}>
          <VerifyForm actions={actionsMap[mode]} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <SecurityVerify {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
