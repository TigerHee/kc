/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Box, Drawer, Button, styled, isPropValid, useTheme, ThemeProvider } from '@kux/mui';
import { WeChatFilled, TelegramFilled } from '@kufox/icons';
import { ICCloseOutlined } from '@kux/icons';

import { useLang } from '../hookTool';
import darkImg from '../../static/dark-money.svg';
import lightImg from '../../static/light-money.svg';

const CloseBox = styled(Box)`
  position: absolute;
  top: 24px;
  right: 24px;
`;

const CloseIcon = styled(Box, {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    backgroundColor: theme.colors.text20,
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    color: theme.colors.text60,
  };
});

const Item = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    cursor: 'pointer',
    marginBottom: '14px',
    color: theme.colors.text60,
    background: theme.colors.text20,
    borderRadius: '4px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    padding: `0 24px`,
  };
});

const JoinItemWrap = styled(Box, {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    marginTop: '24px',
    fontSize: '14px',
    lineHeight: '22px',
  };
});

const Info = styled(Box, {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    marginTop: '40px',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '24px',
  };
});

const Title = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    fontSize: '34px',
    lineHeight: '48px',
    fontWeight: 500,
  };
});

const ImageWrap = styled(Box, {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    marginTop: '56px',
    display: 'flex',
    justifyContent: 'center',
    minWidth: '200px',
    minHeight: '200px',
  };
});

function Guide(props) {
  const {
    classes = {},
    open,
    onClose,
    BoxProps,
    openWechat,
    WechatWrapper,
    startCallback,
    isOpenContract,
    // themeType,
  } = props;
  const theme = useTheme();
  const { currentTheme } = theme;
  const { t } = useLang();
  const image = currentTheme === 'dark' ? darkImg : lightImg;
  function renderWechatItem(Wrapper) {
    if (Wrapper) {
      return (
        <Wrapper>
          <Item>
            <WeChatFilled size={34} color={theme.colors.primary} />
            {t('join.wechat')}
          </Item>
        </Wrapper>
      );
    }
    return (
      <Item onClick={openWechat}>
        <WeChatFilled size={34} color={theme.colors.primary} />
        {t('join.wechat')}
      </Item>
    );
  }
  return (
    <Drawer show={open} anchor="right" onClose={onClose}>
      <CloseBox theme={theme} onClick={onClose}>
        <CloseIcon>
          <ICCloseOutlined size={24} />
        </CloseIcon>
      </CloseBox>
      <Box width={480} p={2} minHeight="100vh" {...BoxProps}>
        <Box mt={3.5}>
          <Title>{t(isOpenContract ? 'contract.opened' : 'register.success')}</Title>
        </Box>
        <ImageWrap>
          <img src={image} alt="guide" className={classes.image} />
        </ImageWrap>
        <Info>{t('join_club_welfare')}</Info>
        <JoinItemWrap>
          {renderWechatItem(WechatWrapper)}
          <Item
            theme={theme}
            onClick={() => window.open('https://t.me/KuCoin_Futures_TG', '_target')}
          >
            <TelegramFilled size={24} color={theme.colors.primary} />
            {t('join.telegram')}
          </Item>
        </JoinItemWrap>
        <Box paddingBottom="48px">
          <Button size="large" fullWidth marginTop="34px" onClick={startCallback}>
            {t('start.trade')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

export default (props) => (
  <ThemeProvider theme={props.theme || 'light'}>
    <Guide {...props} />
  </ThemeProvider>
);
