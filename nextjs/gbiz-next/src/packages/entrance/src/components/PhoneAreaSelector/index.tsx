import React, { useState, useEffect, useCallback, useRef } from 'react';
import clsx from 'clsx';
import { Divider, Modal, useTheme } from '@kux/design';
import useIsMobile from '../../hooks/useIsMobile';
import { Dropdown, ThemeProvider } from '@kux/mui';
import { TriangleBottomIcon } from '@kux/iconpack';
import { kcsensorsManualTrack } from 'tools/sensors';
import Overlay, { OverLayProps } from './OverLay';
import { isForbiddenCountry } from '../../common/tools';
import { getCountryUsingGet } from '../../api/universal-core';
import { getTenantConfig } from '../../config/tenant';
import styles from './index.module.scss';

type ArrayItemType<T> = T extends Array<infer U> ? U : never;

export type IPhoneAreaSelectorProps = {
  countries?: OverLayProps['data'];
  onChange?: OverLayProps['onClickCode'];
  value?: string;
  language?: string;
  useInit?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  fromDrawer?: boolean;
} & Pick<OverLayProps, 'checkForbidden' | 'forbiddenCountry' | 'canChoose' | 'scene'>;

const PhoneAreaSelector: React.FC<IPhoneAreaSelectorProps> = ({
  countries = [],
  onChange,
  value,
  language,
  useInit,
  checkForbidden,
  forbiddenCountry,
  canChoose,
  disabled,
  defaultValue,
  ...otherProps
}) => {
  const { scene } = otherProps;
  const [phoneAreaValue, setPhoneAreaValue] = useState<string | undefined>(value);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const isCn = language === 'zh_CN';
  const isSm = useIsMobile();
  const theme = useTheme();

  // const currentCountry = countries.find(i => i.mobileCode === phoneAreaValue);

  // 合规规则
  const getMobileCodeFromRules = (curCountry?: ArrayItemType<OverLayProps['data']>) => {
    if (!curCountry) return '';
    if (curCountry.code === 'PT') return '55';
    if (forbiddenCountry && curCountry?.dismiss && !canChoose) return '';
    if (['forgetPwd', 'login'].includes(scene) && curCountry.dismissLogin) return '';
    if (
      getTenantConfig()
        .common.notPreFillMobileCodeCountries()
        .includes(curCountry.code || '')
    ) {
      kcsensorsManualTrack(
        {
          spm: ['phoneAreaSelector', '1'],
          data: {
            category: 'notPreFillMobileCode',
            resultType: curCountry.code,
          },
        },
        'technology_event'
      );
      return '';
    }
    if (countries && curCountry) {
      return curCountry.mobileCode || '';
    }
    return '';
  };

  const getMobileCodeFromDefaultValue = () => {
    if (defaultValue) {
      const curCountry = countries.find(c => c.mobileCode === defaultValue);
      return getMobileCodeFromRules(curCountry);
    }
    return '';
  };

  const getMobileCodeFromLang = () => {
    const langCode = language ? language.split('_')[1] : getTenantConfig().common.initLanguageCode;
    const curCountry = countries.find(c => c.code === langCode);
    return getMobileCodeFromRules(curCountry);
  };

  const getMobileCodeFromIP = async () => {
    const res = await getCountryUsingGet();
    if (res?.success && res?.data) {
      const data = res?.data || {};
      const countryItem = countries.find(i => i.code === data?.countryCode);
      return getMobileCodeFromRules(countryItem);
    }
    return getMobileCodeFromLang();
  };

  const getDefaultMobileCode = async () => {
    if (!countries?.length) return '';
    try {
      const defaultMobileCode = getMobileCodeFromDefaultValue();
      if (defaultMobileCode) return defaultMobileCode;
      const mobileCode = await getMobileCodeFromIP();
      return mobileCode || getMobileCodeFromLang();
    } catch {
      return getMobileCodeFromLang();
    }
  };

  const init = async () => {
    if (useInit) {
      return;
    }
    const defaultParam = await getDefaultMobileCode();
    setPhoneAreaValue(defaultParam);
    onChange?.(defaultParam);
  };

  const initRef = useRef(init);
  initRef.current = init;

  const handleClick = (code: string) => {
    setPhoneAreaValue(code);
    if (isSm) {
      onClose();
    } else {
      setVisible(false);
    }
    onChange?.(code);
  };

  const getIsForbidden = useCallback(
    (code: string) => {
      const forbiddenItem = isForbiddenCountry(code);
      const isForbidden = checkForbidden && forbiddenItem;
      return isForbidden ? forbiddenItem : false;
    },
    [checkForbidden]
  );

  const getDisplayCode = (code?: string) => {
    const codeFormat = code ? `+${code}` : '';
    if (!checkForbidden) return codeFormat;
    const isForbidden = getIsForbidden(code || '');
    let displayCode = '';
    if (isForbidden) {
      displayCode = isCn ? isForbidden.aliasName : isForbidden.aliasNameEN;
    }
    return isForbidden ? `${displayCode}` : codeFormat;
  };

  const onVisibleChange = (v: boolean) => {
    const isMatch = phoneAreaValue === countries[0]?.mobileCode;
    if (v && countries.length < 2 && isMatch) return;
    setVisible(v);
  };

  const showList = useCallback(() => setShow(true), []);
  const onClose = useCallback(() => setShow(false), []);

  useEffect(() => {
    initRef.current();
    // eslint-disable-next-line
  }, [useInit, countries, language, forbiddenCountry, canChoose, scene]);

  return isSm ? (
    <>
      <span
        className={clsx(styles.fixedBox, disabled && styles.disabled)}
        onClick={showList}
        tabIndex={0}
        data-inspector="phone-selector-trigger"
      >
        <div className={styles.text}>
          {/* 国旗有合规风险，先不展示  */}
          {/* {currentCountry?.ico && <img alt="country-logo" className={styles.countryLogo} src={currentCountry?.ico} />} */}
          <span data-inspector="phone-selector-text">{getDisplayCode(phoneAreaValue)}</span>
        </div>
        <TriangleBottomIcon size={14} className={clsx(styles.triangleIcon, visible && styles.open)} />
        <Divider className={styles.dividerIcon} direction="vertical" />
      </span>
      <Modal
        isOpen={show}
        mobileTransform
        footer={null}
        maskClosable={false}
        onCancel={onClose}
        onClose={onClose}
        title={'选择区号'}
        showCloseX
        size="small"
      >
        <ThemeProvider theme={theme}>
          <Overlay
            data={countries}
            isCn={isCn}
            onClickCode={handleClick}
            checkForbidden={checkForbidden}
            canChoose={canChoose}
            forbiddenCountry={forbiddenCountry}
            isH5
            {...otherProps}
          />
        </ThemeProvider>
      </Modal>
    </>
  ) : (
    // @ts-ignore
    <Dropdown
      visible={visible}
      trigger="click"
      overlay={
        <ThemeProvider theme={theme}>
          <Overlay
            data={countries}
            isCn={isCn}
            onClickCode={handleClick}
            checkForbidden={checkForbidden}
            canChoose={canChoose}
            forbiddenCountry={forbiddenCountry}
            {...otherProps}
          />
        </ThemeProvider>
      }
      onVisibleChange={disabled ? undefined : onVisibleChange}
      popperStyle={{ width: '100%', transform: 'translateX(0px)' }}
      popperClassName="customDropdown"
      placement="bottom-start"
    >
      <span
        className={clsx(styles.fixedBox, disabled && styles.disabled)}
        tabIndex={0}
        data-inspector="phone-selector-trigger"
      >
        <div className={styles.text}>
          {/* 国旗有合规风险，先不展示  */}
          {/* {currentCountry?.ico && <img alt="country-logo" className={styles.countryLogo} src={currentCountry?.ico} />} */}
          <span data-inspector="phone-selector-text">{getDisplayCode(phoneAreaValue)}</span>
        </div>
        <TriangleBottomIcon size={12} className={clsx(styles.triangleIcon, visible && styles.open)} />
        <Divider className={styles.dividerIcon} direction="vertical" />
      </span>
    </Dropdown>
  );
};

export default PhoneAreaSelector;
