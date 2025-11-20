import React, { useRef, useState } from 'react';
import map from 'lodash-es/map';
import { toast, useTheme } from '@kux/design';
import { Input } from '@kux/mui';
import { SearchIcon } from '@kux/iconpack';
import clsx from 'clsx';
import { trackClick } from 'tools/sensors';
import { useLang } from '../../hookTool';
import { isForbiddenCountry } from '../../common/tools';
import NoData from '../../../static/noData.svg';
import NoData_dark from '../../../static/noData_dark.svg';
import { CountryCodeResponse } from '../../api/ucenter';
import styles from './index.module.scss';

interface ForbiddenItem {
  aliasName: string;
  aliasNameEN: string;
}

export interface OverLayProps {
  data: CountryCodeResponse[];
  isCn: boolean;
  onClickCode: (code: string) => void;
  checkForbidden?: boolean;
  forbiddenCountry?: boolean;
  canChoose?: boolean;
  scene: 'forgetPwd' | 'login' | 'signup';
  fromDrawer?: boolean;
  isH5?: boolean;
}

const OverLay: React.FC<OverLayProps> = ({
  data,
  isCn,
  onClickCode,
  checkForbidden,
  forbiddenCountry,
  canChoose,
  isH5,
  fromDrawer,
  scene,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const currentTheme = useTheme();
  const { t } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);

  const countries = data.filter(country => {
    const code = `+${country.mobileCode}`;
    let isCountry;
    if (isCn) {
      isCountry = country.cn?.includes(searchValue);
    } else {
      isCountry = country.en?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
    }
    const forbiddenItem = isForbiddenCountry(country.mobileCode);
    const isForbidden = checkForbidden && forbiddenItem;
    let otherSearchTxt: boolean = false;
    if (isCn && isForbidden) {
      otherSearchTxt = forbiddenItem.aliasName.includes(searchValue);
    } else if (!isCn && isForbidden) {
      otherSearchTxt = forbiddenItem.aliasNameEN.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
    }
    if (otherSearchTxt) return true;
    if (searchValue && isForbidden) {
      return false;
    }
    return code.includes(searchValue) || isCountry;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchValue(value);
  };

  const getCountryName = (country: CountryCodeResponse, isEmpty: boolean, forbiddenItem: ForbiddenItem) => {
    let str: string | undefined;
    if (!isEmpty) {
      str = isCn ? country?.cn : country?.en;
    } else {
      str = isCn ? forbiddenItem?.aliasName : forbiddenItem?.aliasNameEN;
    }
    return findHighlight(searchValue, str!, false);
  };

  const findHighlight = (keyWord: string, source: string, isNumber: boolean) => {
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
        <span className={styles.highLight}>{keyWord}</span>
        {after}
      </span>
    );
  };

  const handleClickCode = (code: string, _isForbidden: boolean, _canChoose: boolean) => {
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
      trackClick([blockid, 'phonecode'], { country: code });
    }

    if (_isForbidden && !_canChoose) {
      return;
    }
    if (_isForbidden) {
      toast.info(t('dGT9CuchoqYqTgFmw8aK39'));
    }
    onClickCode(code);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    inputRef.current?.focus();
  };

  return (
    <div
      className={clsx(styles.overlay, {
        [styles.overlayH5]: isH5,
      })}
      data-inspector="phone_area_selector"
    >
      <div
        className={clsx(styles.overlayHeader, {
          [styles.overlayHeaderH5]: isH5,
        })}
      >
        {/* @ts-ignore */}
        <Input
          size={isH5 ? 'large' : 'medium'}
          placeholder={t('search')}
          fullWidth
          onChange={handleSearch}
          onClick={handleClick}
          value={searchValue}
          prefix={<SearchIcon size={20} color={'var(--kux-text40)'} />}
          data-inspector="phone_area_selector_search"
          ref={inputRef}
        />
      </div>
      <div
        className={clsx(styles.overlayBody, {
          [styles.overlayBodyH5]: isH5,
          [styles.overlayBodyDrawer]: fromDrawer,
          [styles.overlayBodyForgetPwd]: scene === 'forgetPwd',
        })}
      >
        {countries && countries.length > 0 ? (
          map(countries, (country, key) => {
            const mobileCode = country.mobileCode;
            const isForbidden = forbiddenCountry && !['forgetPwd', 'login'].includes(scene) && country.dismiss;
            const forbiddenItem = isForbiddenCountry(mobileCode);
            const isEmpty = checkForbidden && forbiddenItem;
            const isHide = ['forgetPwd', 'login'].includes(scene) && country.dismissLogin;
            if (isHide || !mobileCode) {
              return null;
            }
            return (
              <div
                data-inspector="phone_area_selector_item"
                className={clsx(styles.overlayItem, {
                  [styles.overlayItemDisabled]: isForbidden && !canChoose,
                  [styles.overlayItemH5]: isH5,
                })}
                key={key}
                onClick={() => handleClickCode(mobileCode, !!isForbidden, !!canChoose)}
              >
                <div className={styles.overlayBox}>
                  <span className={styles.content}>
                    {/* 国旗有合规风险，先不展示  */}
                    {/* {country.ico && <img alt="country-logo" className={styles.countryLogo} src={country.ico} />} */}
                    <span>{getCountryName(country, !!isEmpty, forbiddenItem!)}</span>
                    {isForbidden ? (
                      <span className={styles.notSupportedWrapper}>{t('uCQNHSVrZKcrqS71dULWqJ')}</span>
                    ) : null}
                  </span>
                </div>
                <div>
                  {isEmpty ? '' : searchValue ? findHighlight(searchValue, mobileCode, true) : `+${mobileCode}`}
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.nodata}>
            <img src={currentTheme === 'dark' ? NoData_dark : NoData} alt="NoData" />
            <div className={styles.title}>{t('2YF8KTsSCT2r4XeNJRpXJP')}</div>
            <div className={styles.subTitle}>{t('1Mpnr3kMDvJpUG5cUX1fuZ')}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverLay;
