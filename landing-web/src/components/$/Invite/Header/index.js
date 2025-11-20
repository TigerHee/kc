/**
 * Owner: terry@kupotech.com
 */
import { useCallback, useMemo, useState } from 'react';
import { Select } from '@kufox/mui';
import { Global } from '@kufox/mui/emotion';
import useMediaQuery from '@kufox/mui/hooks/useMediaQuery';
import useTheme from '@kufox/mui/hooks/useTheme';
import { APP_HOST } from 'config';
import { useSelector, useDispatch } from 'dva';
import { useScroll } from 'ahooks';
import { useLogin } from 'src/hooks';
import RestrictNotice from 'src/components/common/RestrictNotice';
import JsBridge from 'utils/jsBridge';
import { sensors } from 'utils/sensors';
import { _t } from 'utils/lang';
import {
  LabelWrapper,
  LangSelectWrapper,
  Left,
  Right,
  StyledButton,
  StyledLoginBtn,
  StyledHeader,
  StyledShareIcon,
  globalStyle,
  StyledArrowLeftIcon,
  KucoinLogo,
  StyledHeaderWrapper,
  RestrictNoticeWrapper,
} from './styled';
import SiteRedirect from 'src/components/common/SiteRedirect';

const Header = ({ handleClickShare, subject, clickSignUp, shareImg, bannerHeight }) => {
  const dispatch = useDispatch();
  const { currentLang, isInApp, langs } = useSelector((state) => state.app);
  const { isLogin, handleLogin, handleLogout } = useLogin();

  const [langExpand, setLangExpand] = useState(false);
  const options = useMemo(() => {
    const supportLangs = [...langs].filter((i) => !!i);
    return supportLangs.map((item) => ({
      label: (renderInput, selected) => {
        return <LabelWrapper selected={selected}>{item.label}</LabelWrapper>;
      },
      value: item.key,
    }));
  }, [langs]);
  const handleLangSelect = useCallback(
    (val) => {
      if (!dispatch) return;
      dispatch({
        type: 'app/selectLang',
        payload: {
          lang: val,
        },
      });
    },
    [dispatch],
  );
  const theme = useTheme();
  const isDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const _isMobile = useMediaQuery(() => {
    return '@media (max-width:768px)';
  });

  const { top: _isSticky } = useScroll(document) || {};
  const isSticky = _isSticky > 0;

  const handleJump = useCallback(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'exit',
        },
      });
    } else {
      window.location.href = APP_HOST;
    }
  }, [isInApp]);

  return (
    <StyledHeaderWrapper isSticky={isSticky}>
      <RestrictNoticeWrapper id="template-5-invite-page">
        <RestrictNotice />
      </RestrictNoticeWrapper>
      <StyledHeader isSticky={isSticky} isInApp={isInApp} isMobile={_isMobile} bannerHeight={bannerHeight}>
        <Global styles={globalStyle} />
        <Left>
          {isDownMd ? (
            <StyledArrowLeftIcon onClick={handleJump} isSticky={isSticky} />
          ) : (
            <KucoinLogo onClick={handleJump} isSticky={isSticky} />
          )}
        </Left>
        <Right>
          <StyledLoginBtn
            size={isDownMd ? 'mini' : 'small'}
            isSticky={isSticky}
            variant="outlined"
            onClick={() => {
              if (!isLogin) {
                sensors.trackClick(['LogIn', '1'], {
                  language: currentLang,
                  subject,
                });
                handleLogin();
              } else {
                handleLogout();
              }
            }}
          >
            {!isLogin ? _t('support.SDKModal.title') : _t('user.panel.logout')}
          </StyledLoginBtn>
          {!isDownMd && !isLogin ? (
            <StyledButton
              ml={4}
              isSticky={isSticky}
              size={isDownMd ? 'mini' : 'small'}
              onClick={() => {
                sensors.trackClick(['SignUp', '1'], {
                  language: currentLang,
                  subject,
                });
                clickSignUp();
              }}
            >
              {_t('register')}
            </StyledButton>
          ) : null}
          <LangSelectWrapper expand={langExpand} isSticky={isSticky}>
            <Select
              matchWidth
              size="small"
              value={currentLang}
              options={options}
              onChange={handleLangSelect}
              onFocus={() => setLangExpand(true)}
              onBlur={() => setLangExpand(false)}
              classNames={{
                dropdownContainer: 'dropdownContainer',
                select: 'select',
                optionItem: 'optionItem',
              }}
            />
          </LangSelectWrapper>
          {shareImg && (
            <StyledShareIcon
              isSticky={isSticky}
              onClick={() => {
                if (!handleClickShare) return;
                handleClickShare();
                sensors.trackClick(['Share', '1'], {
                  language: currentLang,
                  subject,
                });
              }}
            />
          )}
        </Right>
      </StyledHeader>
      <SiteRedirect />
    </StyledHeaderWrapper>
  );
};
export default Header;
