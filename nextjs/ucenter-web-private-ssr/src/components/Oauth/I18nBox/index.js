/**
 * Owner: willen@kupotech.com
 */
import { CloseOutlined, ICLanguageOutlined } from '@kux/icons';
import { ClassNames, Dialog, Drawer, styled, useTheme } from '@kux/mui';
import clsx from 'clsx';
import { isArray, map } from 'lodash-es';
import { useCallback, useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import checkIcon from 'static/oauth/check.svg';
import { _t } from 'tools/i18n';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const useStyles = ({ color, isDark }) => {
  return {
    showItem: `
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: ${isDark ? color.overlay : 'rgba(115, 126, 141, 0.08)'};
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid  ${isDark ? color.cover8 : 'rgba(115, 126, 141, 0.08)'};
      background-clip: padding-box !important;
      cursor: pointer;
      & > span {
        height: 36px;
        line-height: 36px;
      }
      & .navIcon {
        color: ${color.text};
      }
      &:hover {
        border-color: rgba(115, 126, 141, 0.16);
        opacity: 0.6;
      }
      &:active {
        border: 1px solid rgba(115, 126, 141, 0.08);
        opacity: 1;
      }
    `,
    tabsWrapper: `
      margin: 16px 32px 0;
      background: ${color.base};
      color: ${color.text};
    `,
    dialogWrapper: `
      animation: unset !important;
      & > div {
        border-radius: 4px;
        box-shadow: 0px 10px 60px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      & > div > div {
        padding: 0;
        & > div {
          margin-bottom: 0;
          & > div {
            top: 5px;
            right: 30px;
            z-index: 1;
          }
        }
      }
    `,
    overlayWrapper: `
      min-width: 400px;
      height: 530px;
      margin: 10px 0 20px;
      padding: 8px 0;
      display: flex;
      flex-direction: column;
      & .currencyGroup {
        min-width: 1000px;
      }
      & .langGroup {
        min-width: 600px;
      }
      & .group {
        flex: 1;
        height: 480px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        writing-mode: vertical-lr;
        margin-bottom: 8px;
        &::-webkit-scrollbar {
          background: transparent;
          width: 4px;
        }
        &::-webkit-scrollbar-track {
          background: transparent;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.24);
        }
        & .title {
          color: ${color.text60};
          padding: 8px 48px;
          font-size: 12px;
          line-height: 20px;
        }
        & .menuItem {
          padding: 13px 32px;
          color: ${color.text};
          display: flex;
          align-items: center;
          font-size: 14px;
          line-height: 1.2;
          cursor: pointer;
          width: 200px;
          height: 48px;
          writing-mode: horizontal-tb;
          & span {
            position: relative;
          }
          &:hover {
            background: ${color.cover4};
          }
          & .iconCurrency {
            margin-right: 8px;
            margin-left: 4px;
          }
        }
        & .activeItem {
          color: ${color.primary};
          & img {
            position: absolute;
            top: 50%;
            right: -18px;
            transform: translate3d(0, -50%, 0);
          }
        }
      }
    `,
    overlayTitle: `
      font-size: 16px;
      line-height: 26px;
      color: ${color.text};
      font-weight: bold;
      margin: 0 32px;
    `,
    inDrawer: `
      font-size: 14px;
      line-height: 22px;
      color: ${color.text};
      .group {
        margin-top: 12px;
        .title {
          color: ${color.text};
          margin: 20px 32px;
          font-size: 20px;
          font-family: Kufox Sans;
        }
        .menuItem {
          padding: 6px 32px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          color: ${color.text};
          &.activeItem {
            flex-direction: row-reverse;
            & span {
              width: 100%;
              display: flex;
              justify-content: space-between;
            }
          }
          &:hover {
            background: ${color.cover4};
          }
        }
      }
    `,
    tabsSpan: `
      color: ${color.text};
      height: 35px;
      font-weight: 500;
    `,
    activeTabsSpan: `
      color: ${color.primary};
    `,
  };
};

const CloseDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 32px;
`;

const CusDrawer = styled(Drawer)`
  padding: 24px 0 !important;
  width: ${(props) => (props.isMobile ? '100vw' : '320px')};
  height: 100vh;
  overflow: scroll;
  background-color: ${(props) => props.colors.base} !important;
`;

const I18nBox = (props) => {
  const {
    currentLang,
    onLangChange,
    inDrawer,
    surportLanguages, // 支持的语言
  } = props;
  const theme = useTheme();
  const rv = useResponsiveSSR();
  const isMobile = !rv?.sm;
  const classes = useStyles({ color: theme.colors, isDark: theme?.currentTheme === 'dark' });

  const { langList } = useSelector((state) => state.oauth);

  const [modalVisible, setModalVisible] = useState(false);

  const showModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleLangChange = (item) => {
    onLangChange && onLangChange(item[0]);
  };
  // 根据传入的 surportLanguages 过滤出支持的语种，不传或为空时使用全语种
  const filterSurportLanguages = () => {
    let data = langList;
    if (surportLanguages && isArray(surportLanguages) && surportLanguages.length > 0) {
      data = langList.filter((item) => {
        const [langCode] = item;
        if (surportLanguages.find((ele) => ele === langCode)) {
          return item;
        }
        return null;
      });
    }
    return data;
  };

  const getLang = () => {
    let _currentLang = currentLang;
    const _languages = filterSurportLanguages();
    const data = _languages.filter((item) => {
      const [langCode, langName] = item;
      if (langCode === currentLang) {
        _currentLang = langName;
      }
      return langCode !== currentLang;
    });
    if (!langList || !langList.length) {
      return null;
    }

    return (
      <div className={clsx('group', { langGroup: data.length >= 20 })}>
        {inDrawer && <div className="title">{_t('language.select')}</div>}
        <div className="menuItem activeItem">
          <span>
            {_currentLang}
            <img className="icon" src={checkIcon} alt="lang-icon" />
          </span>
        </div>
        {map(data, (item) => {
          return (
            <div key={item[0]} onClick={() => handleLangChange(item)} className="menuItem">
              <span>{item[1]}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <ClassNames>
      {({ css }) => (
        <>
          <div className={css(classes.showItem)} onClick={showModal}>
            <ICLanguageOutlined size="24" className="navIcon" />
          </div>
          {inDrawer ? (
            <CusDrawer
              show={modalVisible}
              anchor="right"
              isMobile={isMobile}
              onClose={closeModal}
              colors={theme.colors}
            >
              <CloseDiv>
                <CloseOutlined
                  size="24"
                  onClick={closeModal}
                  style={{ cursor: 'pointer' }}
                  color={theme.colors.text}
                />
              </CloseDiv>
              <ClassNames>
                {({ css }) => <div className={css(classes.inDrawer)}>{getLang()}</div>}
              </ClassNames>
            </CusDrawer>
          ) : (
            <Dialog
              maskClosable
              showCloseX
              footer={<span />}
              title=""
              size="large"
              open={modalVisible}
              onCancel={closeModal}
              wrapClassName={css(classes.dialogWrapper)}
            >
              <div className={css(classes.overlayWrapper)}>
                <div className={css(classes.overlayTitle)}>{_t('language.select')}</div>
                {getLang()}
              </div>
            </Dialog>
          )}
        </>
      )}
    </ClassNames>
  );
};

export default I18nBox;
