/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import { useTheme, styled } from '@kux/mui';
import { useSelector } from 'react-redux';
import { ICClosePlusOutlined, ICLanguageOutlined } from '@kux/icons';
import { isRTLLanguage } from '@utils';
import { useLang } from '../../../hookTool';
import { namespace } from '../../model';
import {
  HeaderClose,
  DrawerWrapper,
  ContentWrapper,
  ScrollContent,
  CusDrawer,
  Hr2,
  Hr3,
  I18nItem,
  ItemValue,
  Title,
  ThemeItem,
} from '../../MenuDrawer/styled';
import ThemeBox from '../../ThemeBox';
import UserBox from '../UserBox';
import NavUser from '../NavUser';

const H5Wrapper = styled.div`
  width: 100%;
  height: 79px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.layer};
  z-index: 1;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

export default function MenuDrawer(props) {
  const {
    show,
    onClose,
    handleShowDrawer,
    currentLang,
    isNav,
    userInfo,
    navStatus,
    inTrade,
    mainTheme,
    onThemeChange,
  } = props;
  const theme = useTheme();
  const { t } = useLang();
  const langListMap = useSelector((state) => state[namespace].langListMap);
  const isRTL = isRTLLanguage(currentLang);

  useEffect(() => {
    if (navStatus < 1) {
      onClose();
    }
  }, [onClose, navStatus]);

  return (
    <CusDrawer
      anchor={isRTL ? 'left' : 'right'}
      show={show}
      onClose={onClose}
      colors={theme.colors}
      back={false}
      headerBorder={false}
      header={null}
    >
      <DrawerWrapper>
        {navStatus >= 3 ? (
          <H5Wrapper>
            <HeaderClose onClick={onClose}>
              <ICClosePlusOutlined size={12} color={theme.colors.text} />
            </HeaderClose>
          </H5Wrapper>
        ) : (
          <HeaderClose onClick={onClose}>
            <ICClosePlusOutlined size={12} color={theme.colors.text} />
          </HeaderClose>
        )}
        <Hr3 />
        <ContentWrapper theme={theme}>
          {show ? (
            <ScrollContent>
              {!isNav && (
                <div className="userBox">
                  <UserBox {...props} inDrawer />
                </div>
              )}
              {isNav && !userInfo && (
                <div
                  className="userBox2"
                  style={{ marginTop: navStatus <= 2 ? 104 : navStatus <= 5 ? 24 : 0 }}
                >
                  <NavUser {...props} inDrawer navStatus={navStatus} />
                </div>
              )}
              {navStatus > 0 && isNav && (
                <div
                  className="downBox"
                  style={{ marginTop: userInfo && navStatus <= 2 ? 80 : navStatus <= 4 ? 12 : 0 }}
                >
                  <ThemeItem>
                    <ThemeBox
                      inDrawer
                      inTrade={inTrade}
                      onChange={onThemeChange}
                      mainTheme={mainTheme}
                    />
                  </ThemeItem>
                  <Hr2 colors={theme.colors} />
                  <I18nItem
                    colors={theme.colors}
                    onClick={() => handleShowDrawer('i18n', true, 'lang')}
                  >
                    <Title>
                      <ICLanguageOutlined size={20} />
                      <span>{t('language')}</span>
                    </Title>

                    <ItemValue colors={theme.colors}>
                      {
                        (langListMap[currentLang || window._DEFAULT_LANG_ || 'en_US'] || {})
                          .langName
                      }
                    </ItemValue>
                  </I18nItem>
                </div>
              )}
            </ScrollContent>
          ) : null}
        </ContentWrapper>
      </DrawerWrapper>
    </CusDrawer>
  );
}
