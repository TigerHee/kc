/**
 * Owner: gavin.liu1@kupotech.com
 */
import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import { styled } from '@kufox/mui/emotion';
import NewShare from 'components/$/MarketCommon/NewShare';
import { _t } from 'utils/lang';
import { Event } from 'helper';
import {
  SHARE,
  SPLITER_WIDTH,
  CONTENT_WIDTH,
} from '../config';
import useInviteLink from '../hooks/useInviteLink';
import { IMAGES_MAP } from '../Home/useEagerLoadResources'
import { KUCOIN_HOST } from 'utils/siteConfig';
import JsBridge from 'utils/jsBridge';
import { Menu, Dropdown } from 'antd'
import useReferFriends from '../hooks/useReferFriends'
import styles from './style.less'
import { media } from '../common/media'
import { referFriendExpose } from '../config'
import { Helmet } from 'react-helmet'
import { useReferInfo } from '../Home/useReferInfo'

const {
  langCheckedSvg,
  backIconUrl,
  shareIconUrl,
  langArrowUrl,
} = IMAGES_MAP

const shareTexts = [
  {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 5,
    wordSpace: 2,
    text: 'Start trading BTC, ETH and KCS now!',
    x: 60,
    y: 615,
    firstWidth: 200,
    needCompute: true,
    newLine: true,
    independent: true,
  },
  {
    color: '#b8c6d8',
    fontSize: 14,
    fontWeight: '400',
    wordSpace: 2,
    text: `Download ${window._BRAND_NAME_} APP`,
    x: 60,
    y: 645,
    needCompute: true,
    newLine: true,
    independent: true,
  },
];

const Wrapper = styled.div`
  width: 100%;
  height: 0;
`;

const TOP_OFFSET = {
  h5: 30,
  app: 44
}
const H5_BUFFER_OFFSET = 5
const THEME_COLOR = '#11151F'
const Header = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  z-index: 999;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-shrink: 0;
  padding: 0 18px;

  @media (min-width: ${SPLITER_WIDTH}px) {
    width: ${CONTENT_WIDTH}px;
  }

  ${props => {
    if (props.isInApp) {
      return `
        top: ${TOP_OFFSET.app}px;
      `
    }
    return `
      top: ${TOP_OFFSET.h5 + H5_BUFFER_OFFSET}px;
    `
  }}

  ${props =>
    props.isSticky &&
    `
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    
    &::before {
      content: '';
      background: ${THEME_COLOR};
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.9;
      z-index: -1;
    }
  `}
  ${props => {
    if (props.isSticky && props.isInApp) {
      return `
        padding-top: calc(24pt + 32px);
        padding-bottom: 10px;
        height: auto;
      `
    }
  }}
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const BackIcon = styled.img`
  max-width: 100%;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;

  ${media.rtl} {
    transform: rotate(180deg);
  }
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
`

const ShareBox = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const ShareButton = styled.img`
  max-width: 100%;
  user-select: none;
`

const LangSelectBox = styled.div`
  margin-left: 16px;
  margin-right: 18px;

  ${props => {
    if (props.isExpired) {
      return `margin-right: 16px;`
    }
  }}
`

const LoginButton = styled.button`
  border: none;
  height: 24px;
  overflow: hidden;
  padding: 4px 12px;
  background: #01BC8D;
  border-radius: 24px;
  user-select: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    filter: brightness(1.1);
  }
  &:hover {
    filter: brightness(1.1);
  }
`

const LoginButtonText = styled.span`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 130%;
  text-align: center;
  color: #fff;
`

const BetterLangSelectBox = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: right;
  color: #F3F3F3;
`

const BetterLangSelectInner = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: nowrap;
  cursor: pointer;
`

const BetterLangSelectIcon = styled.img`
  max-width: 100%;
  margin-left: 3px;
  user-select: none;
  transition: all 0.2s ease-in-out;

  ${props => {
    if (props.rotate) {
      return `
        transform: rotate(180deg);
      `
    }
  }}
`

const LangLineIcon = styled.img`
  max-width: 100%;
  padding-left: 5px;
`

const LangLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-shrink: 0;
  max-width: 300px;
`

const LangLineLabel = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${props => {
    if (props.isActive) {
      return `
        font-weight: 550;
      `
    }
  }}
`

function Banner({
  shareRef,
  copyLink
}) {
  const headRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const { isLogin } = useSelector(state => state.user);
  const { isInApp, currentLang } = useSelector(state => state.app);
  const { handleLogin } = useReferFriends()
  const { isExpired } = useReferInfo();

  // share
  const { inviteLink } = useInviteLink();
  const shareImg = SHARE[currentLang] || SHARE['en_US'];

  useEffect(() => {
    const handleScroll = event => {
      if (headRef.current) {
        const scrollTop =
          (event.srcElement ? event.srcElement.documentElement.scrollTop : false) ||
          window.pageYOffset ||
          (event.srcElement ? event.srcElement.body.scrollTop : 0);

        const offset = isInApp ? TOP_OFFSET.app : H5_BUFFER_OFFSET;
        if (scrollTop > offset) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    Event.addHandler(window, 'scroll', handleScroll);
    return () => {
      Event.removeHandler(window, 'scroll', handleScroll);
    };
  }, [isInApp]);

  const onBack = useCallback(() => {
    // app 中跳转回App 首页
    if (isInApp) {
      JsBridge.open({ type: 'jump', params: { url: '/home?page=0' } });
    } else {
      const newPage = window.open(KUCOIN_HOST, '_self');
      newPage.opener = null;
    }
  }, [isInApp]);

  const onShare = () => {
    if (isLogin) {
      copyLink()
      shareRef.current?.goShare?.();
      return
    }
    // go to login
    handleLogin()
  }

  const onLoginBtnClick = () => {
    handleLogin()
  }

  const pageTitle = useMemo(() => {
    const originLabel = _t('29HVhebCB83fBhCSbqMVQx', { num: '10,000' })
    // replace <span> </span>
    const label = originLabel.replace(/<[^>]+>/g, '')
    return label
  }, [])

  return (
    <Wrapper
      style={{
        marginTop: isInApp ? undefined : (-1 * (TOP_OFFSET.h5 - H5_BUFFER_OFFSET))
      }}
    >
      <Helmet>
        <title>{pageTitle}</title>
        {/* 尝试解决 android 下的主题色问题 from Bone */}
        <meta name="theme-color" content={THEME_COLOR} />
      </Helmet>
      <Header ref={headRef} isSticky={isSticky} isInApp={isInApp}>
        <HeaderLeft>
          <BackIcon onClick={onBack} src={backIconUrl} alt="back" />
        </HeaderLeft>
        <HeaderRight>
          {isLogin ? (
            // do we need to show avatar ?
            <div />
          ) : (
            <LoginButton onClick={onLoginBtnClick}>
              <LoginButtonText>{_t('apiKing.logIn')}</LoginButtonText>
            </LoginButton>
          )}
          <LangSelectBox isExpired={isExpired}>
            <BetterLangSelect />
          </LangSelectBox>
          {isExpired ? null : (
            <ShareBox>
              <ShareButton onClick={onShare} src={shareIconUrl} alt='share' />
            </ShareBox>
          )}
        </HeaderRight>
      </Header>
      <NewShare
        ref={shareRef}
        shareLink={inviteLink}
        shareImg={shareImg}
        shareTexts={shareTexts}
        onShareCallback={() => {
          referFriendExpose(['referralPicPopUp', '1'])
        }}
        // include kucoin app icon
        customFooterElement
        darkMode
      />
    </Wrapper>
  );
}

function BetterLangSelect() {
  const { langs, currentLang } = useSelector(state => state.app)
  const currentLangLabel = useMemo(() => {
    return langs.find(lang => lang.key === currentLang)?.label
  }, [langs, currentLang])
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)

  const onChangeLang = (newLang) => {
    dispatch({
      type: 'app/selectLang',
      payload: {
        lang: newLang,
      },
    });
  };

  return (
    <BetterLangSelectBox>
      <Dropdown
        onVisibleChange={(nv) => {
          setVisible(nv)
        }}
        overlayClassName={styles.dropdown}
        overlay={
          <Menu>
            {(langs || []).map(i => {
              const isActive = i.key === currentLang
              return (
                <Menu.Item
                  key={i.key}
                  onClick={() => {
                    if (!isActive) {
                      onChangeLang(i.key)
                    }
                  }}
                >
                  <LangLine>
                    <LangLineLabel isActive={isActive}>{i.label}</LangLineLabel>
                    {isActive && <LangLineIcon src={langCheckedSvg} alt='selected' />}
                  </LangLine>
                </Menu.Item>
              )
            })}
          </Menu>
        }
        trigger={['click']}
      >
        <BetterLangSelectInner>
          {currentLangLabel}
          <BetterLangSelectIcon rotate={visible} src={langArrowUrl} alt='arrow' />
        </BetterLangSelectInner>
      </Dropdown>
    </BetterLangSelectBox>
  )
}

export default Banner;
