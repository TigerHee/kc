/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useContext, useEffect } from 'react';
import {
  ThemeProvider,
  // Box,
  Button,
  useTheme,
  Notification,
  Snackbar,
  CssBaseline,
  EmotionCacheProvider,
} from '@kux/mui';
import styled from '@emotion/styled';

const { NotificationProvider } = Notification;

const { SnackbarProvider } = Snackbar;

const StyledBox = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  background: ${(props) => props.colors.overlay};
  color: ${(props) => props.colors.text};
`;

const StyledButton = styled(Button)`
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 10;
`;

const Wrapper = (props) => {
  const { currentTheme, setTheme, colors } = useTheme();

  useEffect(() => {
    const theme = localStorage.getItem('__local_theme__') || 'light';
    setTheme(theme);
  }, []);

  useEffect(() => {
    localStorage.setItem('__local_theme__', currentTheme);
  }, [currentTheme]);

  return (
    <StyledBox colors={colors}>
      <StyledButton
        onClick={() => {
          if (currentTheme === 'light') {
            setTheme('dark');
          } else {
            setTheme('light');
          }
        }}
      >
        {currentTheme}
      </StyledButton>
      {props.children}
    </StyledBox>
  );
};

const breakpoints = {
  md: 1024,
  xll: 1442,
};
export default (props) => {
  // useEffect(() => {
  //   document.querySelector('html').dir = 'rtl';
  // }, []);
  return (
    <div>
      <EmotionCacheProvider isRTL={false}>
        <ThemeProvider breakpoints={breakpoints}>
          <CssBaseline />
          <NotificationProvider>
            <SnackbarProvider>
              <Wrapper>{props.children}</Wrapper>
            </SnackbarProvider>
          </NotificationProvider>
        </ThemeProvider>
      </EmotionCacheProvider>
    </div>
  );
};
