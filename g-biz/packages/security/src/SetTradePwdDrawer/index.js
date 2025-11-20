/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Box, Drawer, ThemeProvider, Snackbar, Notification } from '@kufox/mui';
import { css } from '@emotion/react';
import { CloseOutlined } from '@kufox/icons';
// import { useSelector, useDispatch } from 'react-redux';

import SetTradePwd from '../SetTradePwd';

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;

const useStyles = () => {
  return {
    closeIcon: css`
      display: flex;
      justify-content: flex-end;
      cursor: pointer;
    `,
  };
};
const NormalSetTradePwdDrawer = (props) => {
  const { open, onClose, ...restProps } = props;
  const classes = useStyles();

  return (
    <Drawer show={open} onClose={onClose} {...restProps}>
      <div css={classes.closeIcon} onClick={onClose}>
        <CloseOutlined size={24} />
      </div>
      <Box mt={3.5} p={2}>
        <Box>
          <SetTradePwd {...restProps} />
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
          <NormalSetTradePwdDrawer {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
