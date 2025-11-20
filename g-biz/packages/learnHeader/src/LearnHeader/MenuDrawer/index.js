/**
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Drawer, styled, useMediaQuery, useTheme, useSnackbar } from '@kux/mui';
import {
  ICClosePlusOutlined,
  ICAppDownloadOutlined,
  ICLanguageOutlined,
  ICCopyOutlined,
} from '@kux/icons';
import NavUser from '../NavUser';
import NavLink from '../Nav/Nav';
import Link from '../../components/Link';
import { useLang } from '../../hookTool';
import { namespace } from '../model';
import { checkIsInApp } from '../../common/tools';

// height: '100%', position: 'absolute', display: 'flex', flexDirection: 'column'

const HeadWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 79px;
  padding: 20px 16px;
`;

const CloseDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border: 2px solid ${(props) => props.theme.colors.cover8};
  border-radius: 100%;
  cursor: pointer;
  position: absolute;
  right: 16px;
`;

const Hr = styled.hr`
  height: 1px;
  background: ${(props) => props.colors.divider};
  margin: 16px 24px 16px;
  border: none;
  display: ${(props) => (props.hidden ? 'none' : 'block')};
`;

const Hr2 = styled(Hr)`
  margin: 12px;
`;

const Hr3 = styled(Hr)`
  margin: 0 32px 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 0 16px 0;
  }
`;

const DrawerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  & .navLinks {
    margin-top: 12px;
    & .rc-collapse {
      background: ${(props) => props.theme.colors.overlay} !important;
    }
  }
  .userBox2 {
    margin-top: 2px;
    margin-bottom: 20px;
  }
`;

const ScrollContent = styled.div`
  width: 100%;
  padding: 0 20px 100px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 24px 12px 100px 12px;
  }
`;

const CusDrawer = styled(Drawer)`
  width: ${(props) => (props.isMobile ? '100vw' : '320px')};
  height: 100vh;
  overflow: scroll;
  padding: 0 !important;
  background-color: ${(props) => props.colors.layer} !important;
  & .showDownBox {
    padding: 0 24px;
  }
  & .userBox {
    margin: 0;
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  height: 48px;
  line-height: 48px;
  cursor: pointer;
  color: ${(props) => props.colors.text};
  font-weight: 500;
  padding: ${(props) => (props.isMobile ? '0 12px' : '0 24px')};
  &:hover {
    background: rgba(115, 126, 141, 0.08);
  }
`;

const ItemLink = styled(Link)`
  display: block;
  padding: 14px 24px;
  cursor: pointer;
  color: ${(props) => props.colors.text};
  text-decoration: none !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  position: relative;
  white-space: break-spaces;
  word-break: break-all;
  &:hover {
    background: ${(props) => props.colors.cover4};
    color: ${(props) => props.colors.text};
    & .uid {
      border-color: ${(props) => props.colors.divider};
    }
  }
  .nameView {
    display: flex;
    align-items: center;
  }
  .email {
    font-size: 20px;
    line-height: 1.4;
    color: ${(props) => props.colors.text};
    margin-right: 8px;
    font-weight: 500;
  }
  .tagView {
    display: flex;
    align-items: center;
    margin-top: 8px;
  }
  .subAccount {
    font-size: 12px;
    line-height: 1.5;
    color: ${(props) => props.colors.text60};
    margin-right: 8px;
  }
  .uid {
    display: flex;
    align-items: center;
    width: auto;
    height: auto;
    padding: 2px 8px;
    background: ${(props) => props.colors.cover4};
    border-radius: 12px;
    font-size: 12px;
    line-height: 1.6;
    color: ${(props) => props.colors.text60};
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
  }
`;

const ItemLogout = styled(Item)`
  justify-content: center;
  display: ${(props) => (props.hidden ? 'none' : 'block')};
`;

const CusLink = styled(Link)`
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.colors.text};
  text-decoration: none;
  display: flex;
  align-items: center;
  &:hover {
    color: ${(props) => props.colors.text};
  }
  & svg {
    margin: 0px 10px 0px 0px;
    [dir='rtl'] & {
      margin: 0px 0px 0px 10px;
    }
  }
`;

const ItemValue = styled.div`
  font-weight: 400;
  color: ${(props) => props.colors.text60};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  & svg {
    margin: 2px 12px 0px 0px;
    [dir='rtl'] & {
      margin: 2px 0px 0px 12px;
    }
  }
  & .USD {
    margin: 2px 12px 0 0;
  }
`;

export default function MenuDrawer(props) {
  const { show, onClose, handleShowDrawer, currentLang, userInfo, isSub, hostConfig } = props;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isPc = useMediaQuery('(min-width: 1025px)');
  const isMobile = useMediaQuery('(max-width:400px)');
  const theme = useTheme();

  const { t } = useLang();
  const { langListMap } = useSelector((state) => state[namespace]);

  const { KUCOIN_HOST } = hostConfig;
  const accountHref = isSub ? `${KUCOIN_HOST}/account/security` : `${KUCOIN_HOST}/account`;

  const { nickname = '', email = '', phone = '', subAccount = '' } = userInfo || {};
  const userName = isSub ? subAccount : nickname || email || phone || '';

  const isInApp = checkIsInApp();

  const doNothing = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleLogout = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    const to = '';
    dispatch({ type: `${namespace}/logout`, payload: { to, spm: ['person', '9'] } });
  };

  return (
    <CusDrawer
      anchor="right"
      show={show}
      onClose={onClose}
      isMobile={isMobile}
      colors={theme.colors}
      back={false}
      headerBorder={false}
      header={null}
    >
      <DrawerWrapper>
        <HeadWrapper>
          <CloseDiv onClick={onClose}>
            <ICClosePlusOutlined size={12} color={theme.colors.text} />
          </CloseDiv>
        </HeadWrapper>
        <Hr3 colors={theme.colors} />
        <ContentWrapper theme={theme}>
          <ScrollContent theme={theme}>
            {isPc ? null : userInfo ? (
              <div className="userBox">
                <ItemLink
                  colors={theme.colors}
                  href={accountHref}
                  data-ga="person"
                  data-modid="person"
                  data-idx={2}
                  lang={currentLang}
                >
                  <div className="nameView">
                    <span className="email">{userName}</span>
                  </div>
                  <div className="tagView">
                    {isSub && <span className="subAccount">{t('subaccount.subaccount')} : </span>}
                    <div onClick={doNothing}>
                      <CopyToClipboard
                        text={userInfo && userInfo.uid}
                        onCopy={() => {
                          enqueueSnackbar.success(t('copy.succeed'));
                        }}
                      >
                        <div className="uid">
                          UID: {userInfo && userInfo.uid}
                          <ICCopyOutlined size="18" style={{ marginLeft: 4 }} />
                        </div>
                      </CopyToClipboard>
                    </div>
                  </div>
                </ItemLink>
                <Hr colors={theme.colors} />
              </div>
            ) : (
              <div className="userBox2">
                <NavUser {...props} inDrawer />
              </div>
            )}

            <div className="navLinks">
              <NavLink {...props} inDrawer closeDrawer={onClose} />
            </div>

            {!isPc && (
              <>
                <Hr colors={theme.colors} />
                <div className="downBox">
                  <Item colors={theme.colors} isMobile={isMobile}>
                    <CusLink href="/download" colors={theme.colors}>
                      <ICAppDownloadOutlined size="20" />
                      <span>{t('download')}</span>
                    </CusLink>
                  </Item>
                  <Hr2 colors={theme.colors} />
                  <Item
                    colors={theme.colors}
                    onClick={() => handleShowDrawer('i18n', true, 'lang')}
                    isMobile={isMobile}
                  >
                    <Title>
                      <ICLanguageOutlined size="20" />
                      <span>{t('language')}</span>
                    </Title>

                    <ItemValue colors={theme.colors}>
                      {
                        (langListMap[currentLang || window._DEFAULT_LANG_ || 'en_US'] || {})
                          .langName
                      }
                    </ItemValue>
                  </Item>
                  {/* app访问，隐藏 退出登录按钮 */}
                  {!!userInfo && (
                    <>
                      <Hr colors={theme.colors} hidden={isInApp} />
                      <ItemLogout
                        colors={theme.colors}
                        onClick={handleLogout}
                        data-modid="person"
                        data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '10' : '9'}
                        hidden={isInApp}
                      >
                        {t('logout')}
                      </ItemLogout>
                    </>
                  )}
                </div>
              </>
            )}
          </ScrollContent>
        </ContentWrapper>
      </DrawerWrapper>
    </CusDrawer>
  );
}
