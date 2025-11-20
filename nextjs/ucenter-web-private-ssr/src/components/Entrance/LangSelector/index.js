/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { ConfirmOutlined } from '@kux/icons';
import { Dropdown, isPropValid, styled, useTheme } from '@kux/mui';
import useLocaleChange from 'hooks/useLocaleChange';
import { map } from 'lodash-es';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import CloseIcon from 'static/ucenter/close.svg';
import { _t } from 'tools/i18n';

const OverlayContent = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme, inDrawer }) => {
  return {
    width: '240px',
    height: '480px',
    boxShadow: theme.shadows.base,
    overflow: 'auto',
    borderRadius: '4px',
    background: theme.colors.base,
    padding: '24px 0 8px 0',
    '&.inDrawer': {
      width: '100%',
      height: '100%',
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
    },
    '&::-webkit-scrollbar': {
      background: 'transparent',
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '2px',
      background: inDrawer ? 'transparent' : theme.colors.text60,
    },
    '& .title': {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      lineHeight: '20px',
      color: theme.colors.text60,
      paddingLeft: '48px',
      margin: 0,
      // "[dir='rtl'] &": {
      //   paddingLeft: '0',
      //   paddingRight: '48px',
      // },
      '&.inDrawer': {
        fontSize: '20px',
        lineHeight: '32px',
        color: theme.colors.text,
        paddingLeft: '40px',
        paddingRight: '20px',
        marginBottom: '12px',
        fontWeight: 500,
      },
    },
    '& .langList': {
      flex: 1,
      overflow: 'scroll',
      '&::-webkit-scrollbar': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'transparent',
      },
    },
    '& .activeItem': {
      width: '100%',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '48px',
      color: theme.colors.primary,
      position: 'relative',
      fontSize: '14px',
      // "[dir='rtl'] &": {
      //   paddingLeft: '0',
      //   paddingRight: '48px',
      // },
      '&.inDrawer': {
        paddingLeft: '40px',
        paddingRight: '40px',
        justifyContent: 'space-between',
      },
      '& .MuiIcon-icon': {
        position: 'absolute',
        left: '26px',
      },
    },
    '& .overlayItem': {
      width: '100%',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '48px',
      paddingRight: 0,
      fontSize: '14px',
      color: theme.colors.text,
      '&.inDrawer': {
        paddingLeft: '40px',
        paddingRight: '40px',
        fontSize: '14px',
      },
      '&:hover': {
        background: theme.colors.cover8,
        color: theme.colors.primary,
        cursor: 'pointer',
      },
    },
    '& .closeIcon': {
      width: '24px',
      height: '24px',
      cursor: 'pointer',
    },
  };
});

const Choose = styled('a', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    color: theme.colors.text60,
    '&:hover': {
      color: theme.colors.primary,
    },
    '& span': {
      fontSize: '14px',
      lineHeight: '22px',
      color: theme.colors.primary,
    },
    "[dir='rtl'] & .ant-dropdown": {
      right: 'unset',
    },
  };
});

function LangSelector({ inDrawer, onClose }) {
  const theme = useTheme();

  const { langListMap } = useSelector((state) => state.app);

  const { currentLang } = useLocale();

  const changeLocale = useLocaleChange();

  const changeLang = useCallback(
    (lang) => {
      changeLocale(lang);
      if (inDrawer && onClose) {
        onClose();
      }
    },
    [changeLocale, inDrawer, onClose],
  );

  const getLangList = useCallback(() => {
    const _langListMap = { ...langListMap };
    delete _langListMap[currentLang];
    return _langListMap;
  }, [currentLang, langListMap]);

  const currentLangItem = langListMap[currentLang] || {};

  const OverLay = (
    <OverlayContent inDrawer={inDrawer} isIN theme={theme}>
      <p className="title">{_t('language')}</p>
      <div className="activeItem">
        <ConfirmOutlined size="16" color={theme.colors.primary} />
        {currentLangItem.langName}
      </div>
      <React.Fragment>
        {map(getLangList(), (item, key) => {
          return (
            <div
              className="overlayItem"
              key={key}
              onClick={() => {
                changeLang(key);
              }}
            >
              {(item || {}).langName}
            </div>
          );
        })}
      </React.Fragment>
    </OverlayContent>
  );

  const OverLayInDrawer = (
    <OverlayContent inDrawer={inDrawer} theme={theme} className="inDrawer">
      <p className="title inDrawer">
        {_t('language')}
        <img src={CloseIcon} onClick={onClose} className="closeIcon" alt="close-icon" />
      </p>
      <div className="langList">
        <div className="activeItem inDrawer">
          {currentLangItem.langName}
          <ConfirmOutlined size="16" color={theme.colors.primary} />
        </div>
        <React.Fragment>
          {map(getLangList(), (item, key) => {
            return (
              <div
                className="overlayItem inDrawer"
                key={key}
                onClick={() => {
                  changeLang(key);
                }}
              >
                {(item || {}).langName}
              </div>
            );
          })}
        </React.Fragment>
      </div>
    </OverlayContent>
  );

  if (inDrawer) {
    return OverLayInDrawer;
  }

  return (
    <Dropdown disablePortal={false} trigger="hover" overlay={OverLay}>
      <Choose theme={theme}>
        <span>{currentLangItem.langName}</span>
        <ConfirmOutlined size="14" color={theme.colors.primary} />
      </Choose>
    </Dropdown>
  );
}

export default LangSelector;
