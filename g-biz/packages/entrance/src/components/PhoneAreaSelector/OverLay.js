/**
 * Owner: iron@kupotech.com
 */
import React, { useState } from 'react';
import map from 'lodash/map';
import { Box, Input, styled, isPropValid, useTheme } from '@kux/mui';
import { ICSearchOutlined } from '@kux/icons';
import { useLang, useToast } from '../../hookTool';
import { isForbiddenCountry, kcsensorsClick } from '../../common/tools';
import NoData from '../../../static/noData.svg';
import NoData_dark from '../../../static/noData_dark.svg';

const Overlay = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme, isH5, fromDrawer, maxHeight }) => {
  return {
    width: '100%',
    borderRadius: isH5 ? '0px' : '8px',
    background: theme.colors.overlay,
    border: isH5 ? 'none' : `1px solid ${theme.colors.cover4}`,
    boxShadow: isH5 ? 'none' : '0px 4px 40px rgba(0, 0, 0, 0.06)',
    position: isH5 ? 'unset' : 'absolute',
    left: 0,
    top: 25,
    display: isH5 ? 'flex' : 'unset',
    flexDirection: 'column',
    height: isH5 ? '100%' : 'unset',
    '& .activeItem': {
      width: '100%',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '48px',
      color: theme.colors.primary,
      position: 'relative',
    },
    '& .overlayHeader': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px 16px 8px',
      flexShrink: 0,
    },
    '& .overlayBody': {
      maxHeight: isH5 ? 'unset' : fromDrawer ? '290px' : maxHeight || '360px',
      overflow: 'auto',
      margin: isH5 ? '0px 0px 34px' : '0',
      flex: 1,
      paddingBottom: isH5 ? '34px' : 'unset',
      '&::-webkit-scrollbar': {
        background: 'transparent',
        width: '4px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: '2px',
        background: theme.colors.cover16,
      },
    },
    '& .overlayItem': {
      width: '100%',
      height: '48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: '16px',
      paddingRight: '16px',
      cursor: 'pointer',
      color: theme.colors.text,
      fontWeight: '400',
      fontSize: '16px',
      lineHeight: '130%',
      '&:hover': {
        background: theme.colors.cover2,
      },
      '.highLight': {
        color: theme.colors.textPrimary,
      },
      '& .disabledText': {
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '130%',
        color: theme.colors.text60,
        marginLeft: '8px',
        display: 'inline-block',
        backgroundColor: theme.colors.cover4,
        borderRadius: '4px',
        padding: '2px 6px',
      },
      '&.overlayItemDisabled': {
        cursor: 'not-allowed',
        opacity: '0.4',
        '&:hover': {
          color: theme.colors.text,
        },
      },
    },
  };
});
const Content = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    display: 'flex',
  };
});

const NotSupportedWrapper = styled('span', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 6px',
    background: theme.colors.cover4,
    borderRadius: '4px',
    fontWeight: '400',
    fontSize: '12px',
    color: theme.colors.text60,
    lineHeight: '130%',
    marginLeft: '8px',
    flexShrink: '0',
  };
});

const Nodata = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    width: '100%',
    height: '350px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    '& img': {
      width: '150px',
      height: '110px',
    },
    '& .title': {
      fontWeight: '500',
      fontSize: '14px',
      lineHeight: '130%',
      color: theme.colors.text60,
    },
    '& .subTitle': {
      fontWeight: '400',
      fontSize: '12px',
      lineHeight: '130%',
      marginTop: 4,
      color: theme.colors.text40,
    },
  };
});

function OverLay({
  data,
  isCn,
  onClickCode,
  checkForbidden,
  forbiddenCountry,
  canChoose,
  isH5,
  fromDrawer,
  scene,
}) {
  const [searchValue, setSearchValue] = useState('');
  const toast = useToast();
  const { currentTheme, colors } = useTheme();
  const { t } = useLang();

  const countries = data.filter((country) => {
    const code = `+${country.mobileCode}`;
    let isCountry;
    if (isCn) {
      isCountry = country.cn.includes(searchValue);
    } else {
      isCountry = country.en.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
    }
    const forbiddenItem = isForbiddenCountry(country.mobileCode);
    const isForbidden = checkForbidden && forbiddenItem;
    let otherSearchTxt = '';
    if (isCn && isForbidden) {
      otherSearchTxt = forbiddenItem.aliasName.includes(searchValue);
    } else if (!isCn && isForbidden) {
      otherSearchTxt = forbiddenItem.aliasNameEN
        .toLocaleLowerCase()
        .includes(searchValue.toLocaleLowerCase());
    }
    if (otherSearchTxt) return true;
    if (searchValue && isForbidden) {
      return false;
    }
    return code.includes(searchValue) || isCountry;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchValue(value);
  };

  const getCountryName = (country, isEmpty, forbiddenItem) => {
    let str = '';
    if (!isEmpty) {
      str = isCn ? country?.cn : country?.en;
    } else {
      str = isCn ? forbiddenItem?.aliasName : forbiddenItem?.aliasNameEN;
    }
    return findHighlight(searchValue, str, false);
  };

  const findHighlight = (keyWord, source, isNumber) => {
    if (!source) {
      return '';
    }
    const addSymbol = isNumber ? '+' : '';
    if (source.indexOf(keyWord) < 0) {
      return `${addSymbol}${source}`;
    }
    const str = source.replace(keyWord, `,`);
    const [before, after] = str.split(',');
    return (
      <span>
        <span>{addSymbol}</span>
        {before}
        <span className="highLight">{keyWord}</span>
        {after}
      </span>
    );
  };

  const handleClickCode = (code, _isForbidden, _canChoose) => {
    let blockid = '';
    if (scene === 'signup') {
      blockid = fromDrawer ? 'sidePhoneRegister' : 'phone';
    }
    if (scene === 'login') {
      blockid = fromDrawer ? 'sidePhoneLogin' : 'phone';
    }
    if (scene === 'forgetPwd') {
      blockid = 'phone';
    }
    if (blockid) {
      kcsensorsClick([blockid, 'phonecode'], { country: code });
    }

    if (_isForbidden && !_canChoose) {
      return;
    }
    if (_isForbidden) {
      toast.info(t('dGT9CuchoqYqTgFmw8aK39'));
    }
    onClickCode(code);
  };

  return (
    <Overlay
      isH5={isH5}
      fromDrawer={fromDrawer}
      maxHeight={scene === 'forgetPwd' ? '200px' : null}
      data-inspector="phone_area_selector"
    >
      <div className="overlayHeader">
        <Input
          size={isH5 ? 'large' : 'medium'}
          placeholder={t('search')}
          fullWidth
          onChange={handleSearch}
          value={searchValue}
          prefix={<ICSearchOutlined size={20} color={colors.text40} />}
          inputProps={{ autocomplete: 'off' }}
          data-inspector="phone_area_selector_search"
        />
      </div>
      <div className="overlayBody">
        {countries && countries.length > 0 ? (
          map(countries, (country, key) => {
            // dismiss 控制注册场景下，区号是否能选择
            const isForbidden =
              forbiddenCountry && !['forgetPwd', 'login'].includes(scene) && country.dismiss;
            const forbiddenItem = isForbiddenCountry(country.mobileCode);
            const isEmpty = checkForbidden && forbiddenItem;
            // dismissLogin 控制登录场景下，区号是否能选择
            const isHide = ['forgetPwd', 'login'].includes(scene) && country.dismissLogin;
            if (isHide) {
              return null;
            }
            return (
              <div
                data-inspector="phone_area_selector_item"
                className={`overlayItem ${isForbidden && !canChoose ? 'overlayItemDisabled' : ''}`}
                key={key}
                onClick={() => handleClickCode(country.mobileCode, isForbidden, canChoose)}
              >
                <Box display="flex" alignItems="center">
                  <Content>
                    <span>{getCountryName(country, isEmpty, forbiddenItem)}</span>
                    {isForbidden ? (
                      <NotSupportedWrapper>{t('uCQNHSVrZKcrqS71dULWqJ')}</NotSupportedWrapper>
                    ) : null}
                  </Content>
                </Box>
                <div>
                  {isEmpty
                    ? ''
                    : searchValue
                    ? findHighlight(searchValue, country.mobileCode, true)
                    : `+${country.mobileCode}`}
                </div>
              </div>
            );
          })
        ) : (
          <Nodata>
            <img src={currentTheme === 'dark' ? NoData_dark : NoData} alt="NoData" />
            <div className="title">{t('2YF8KTsSCT2r4XeNJRpXJP')}</div>
            <div className="subTitle">{t('1Mpnr3kMDvJpUG5cUX1fuZ')}</div>
          </Nodata>
        )}
      </div>
    </Overlay>
  );
}

export default OverLay;
