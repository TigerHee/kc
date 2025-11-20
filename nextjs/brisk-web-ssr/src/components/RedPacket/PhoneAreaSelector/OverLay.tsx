/**
 * Owner: willen@kupotech.com
 * PhoneAreaSelector OverLay - converted to TypeScript with @kux/mui-next
 */
import React, { useState } from 'react';
import { Box, Input } from '@kux/mui-next';
import { ICSearchOutlined } from '@kux/icons';
import { useSnackbar } from '@kux/mui-next/hooks';
import useTheme from '@/hooks/useTheme';
import clsx from 'clsx';
import { map } from 'lodash-es';
import useTranslation from '@/hooks/useTranslation';
import { CountryCodeResponse } from '@/api/ucenter/types.gen';
import { isForbiddenCountry } from '../utils/countries';
import NoData from '@/static/redpacket/noData.svg';
import NoData_dark from '@/static/redpacket/noData_dark.svg';
import styles from './styles.module.scss';

interface OverLayProps {
  data: CountryCodeResponse[];
  isCn: boolean;
  onClickCode: (code: string) => void;
  checkForbidden?: boolean;
  forbiddenCountry?: boolean;
  canChoose?: boolean;
  overlayBoxWidth?: string;
}

/**
 *
 * @param {Array} props.data 国家区号数据
 * @param {bool} props.isCn 是否是中文zh_CN
 * @param {function} props.onClickCode 点击国家区号回调
 * @param {bool} props.checkForbidden  被禁止的国家，国旗/区号不显示， 国家名称显示为其他 暂未使用，
 * @param {bool} props.forbiddenCountry 使用countries里的dismiss字段来禁止国家显示,被禁止的国家，不可选； 会展示文案"暂不支持 "
 * @param {bool} props.canChoose 被禁止的国家，可选，但是点击选择会toast提醒
 * @param {string} props.overlayBoxWidth 下拉选择内容盒子宽度
 * @returns
 */
const OverLay: React.FC<OverLayProps> = ({
  data,
  isCn,
  onClickCode,
  checkForbidden,
  forbiddenCountry,
  canChoose,
  overlayBoxWidth,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>('');
  const { message } = useSnackbar();
  const { theme } = useTheme();

  const countries = data.filter((country) => {
    // forbiddenCountry = true 不显示该国家
    if (forbiddenCountry === true && isForbiddenCountry(country.mobileCode || '')) {
      return false;
    }
    const code = `+${country.mobileCode}`;
    let isCountry: boolean;
    if (isCn) {
      isCountry = country.cn?.includes(searchValue) || false;
    } else {
      isCountry = country.en?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) || false;
    }

    const forbiddenItem = isForbiddenCountry(country.mobileCode || '');
    const isForbidden = checkForbidden && forbiddenItem;
    let otherSearchTxt = false;
    if (isCn && isForbidden) {
      otherSearchTxt = forbiddenItem.aliasName?.includes(searchValue) || false;
    } else if (!isCn && isForbidden) {
      otherSearchTxt = forbiddenItem.aliasNameEN
        ?.toLocaleLowerCase()
        .includes(searchValue.toLocaleLowerCase()) || false;
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

  const getCountryName = (country: CountryCodeResponse, isEmpty: boolean, forbiddenItem: any) => {
    let str = '';
    if (!isEmpty) {
      str = isCn ? country?.cn || '' : country?.en || '';
    } else {
      str = isCn ? forbiddenItem?.aliasName || '' : forbiddenItem?.aliasNameEN || '';
    }
    return findHighlight(searchValue, str, false);
  };

  /** 搜索匹配高亮 */
  const findHighlight = (keyWord: string, source: string, isNumber: boolean): React.ReactNode => {
    if (!source) {
      return '';
    }
    const addSymbol = isNumber ? '+' : '';
    if (source.indexOf(keyWord) < 0) {
      return `${addSymbol}${source}`;
    }
    const str = source.replace(keyWord, ',');
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

  const handleClickCode = (code: string, _isForbidden: boolean, _canChoose?: boolean) => {
    if (_isForbidden && !_canChoose) {
      return;
    }
    if (_isForbidden) {
      message.info(t('dGT9CuchoqYqTgFmw8aK39'));
    }
    onClickCode(code);
  };

  return (
    <div className={styles.overlayBox} style={{ width: overlayBoxWidth || '100%' }}>
      <div className={styles.overlayHeader}>
        <Input
          placeholder={t('search')}
          fullWidth
          size="small"
          onChange={handleSearch}
          value={searchValue}
          startAdornment={<ICSearchOutlined size={14} />}
        />
      </div>
      <div className={styles.overlayBody}>
        {countries && countries.length > 0 ? (
          map(countries, (country, key) => {
            /** 是否是屏蔽国家列表内的国家 */
            const forbiddenItem = isForbiddenCountry(country.mobileCode || '');
            /** 是否显示"暂不支持" 文案  （dismiss字段 控制注册场景下，区号是否能选择）  */
            const isForbidden = forbiddenCountry && country.dismiss;
            /** 展示 '' - 条件是 被禁止的国家不显示区号 & 屏蔽国家  */
            const isEmpty = checkForbidden && forbiddenItem;
            /** 展示不可选样式 */
            const disabledStyle = isForbidden && !canChoose;
            return (
              <div
                role="presentation"
                className={clsx(styles.overlayItem, { [styles.overlayItemDisabled]: disabledStyle })}
                key={key}
                onClick={() => handleClickCode(country.mobileCode || '', !!isForbidden, canChoose)}
              >
                <Box display="flex" alignItems="center">
                  <div className={styles.content}>
                    <span>{getCountryName(country, !!isEmpty, forbiddenItem)}</span>
                    {isForbidden ? (
                      <div className={styles.notSupportedWrapper}>{t('uCQNHSVrZKcrqS71dULWqJ')}</div>
                    ) : null}
                  </div>
                </Box>
                <Box>
                  {isEmpty
                    ? ''
                    : searchValue
                      ? findHighlight(searchValue, country.mobileCode || '', true)
                      : `+${country.mobileCode}`}
                </Box>
              </div>
            );
          })
        ) : (
          <div className={styles.noDataWrapper}>
            <img src={theme === 'dark' ? NoData_dark : NoData} alt='NoData' />
            <div className={styles.title}>{t('2YF8KTsSCT2r4XeNJRpXJP')}</div>
            <div className={styles.subTitle}>{t('1Mpnr3kMDvJpUG5cUX1fuZ')}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverLay;
