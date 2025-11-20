/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useState, useMemo } from 'react';
import { uniqBy } from 'lodash';
import classnames from 'classnames';
import { Input, Empty } from '@kux/mui';
import useLang from '@packages/kyc/src/hookTool/useLang';
import { GetCountry } from '@kycCompliance/service';
import useFetch from '@kycCompliance/hooks/useFetch';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import { CountrySelectOption } from './CountrySelectOption';
import {
  SelectWrapper,
  SelectStyle,
  ExtraLabel,
  DownIcon,
  StyledDrawer,
  DrawerHeader,
  CloseIcon,
  SearchIcon,
} from './style';

export default ({
  componentGroupTitle,
  componentCode,
  complianceMetaCode,
  setLabel,
  componentTitle,
  componentContent,
  ...props
}) => {
  const { onChange, label } = props;
  const { flowData, formData, inApp } = useCommonData();
  const { _t } = useLang();
  // const inApp = true;

  const [isDrawerShow, setDrawerShow] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isFocus, setFocus] = useState(false);

  const { data: countries = [] } = useFetch(GetCountry, {
    cacheKey: complianceMetaCode,
    ready: flowData?.complianceStandardCode && complianceMetaCode,
    params: {
      complianceStandardCode: flowData?.complianceStandardCode,
      metaCode: complianceMetaCode,
    },
  });

  useEffect(() => {
    if (countries?.componentTitle && !componentTitle) {
      setLabel(countries?.componentTitle);
    }

    // 根据ip定位设置默认选中
    let timer = null;
    timer = setTimeout(() => {
      if (countries?.list) {
        const ipItem = countries?.list?.find((i) => i?.isIpRegion && i?.isDisplay && i?.isOptional);
        if (ipItem && !formData[componentCode]) {
          onChange(ipItem?.code);
        }
      }
    }, 300);

    return () => {
      timer && clearTimeout(timer);
    };
  }, [countries, formData, componentCode, onChange, setLabel, componentTitle]);

  const handleFilter = (inputValue, option) => {
    const { value, title } = option;
    const lowcaseInput = (inputValue || '').toLowerCase();
    return [value, title].some((v) => {
      return (v || '').toLowerCase().indexOf(lowcaseInput) > -1;
    });
  };

  const countryOptions = CountrySelectOption((countries?.list || []).filter((i) => i.isDisplay));

  const appCountryOptions = useMemo(() => {
    let list = [];
    if (countryOptions.some((i) => i.options)) {
      countryOptions.forEach((i) => {
        list = [...list, ...i.options];
      });
    } else {
      list = countryOptions;
    }

    return uniqBy(list, 'value').filter((i) => handleFilter(searchValue, i));
  }, [countryOptions, searchValue]);

  const onHideDrawer = () => {
    setDrawerShow(false);
    setSearchValue('');
  };

  return (
    <>
      {componentGroupTitle ? <ExtraLabel>{componentGroupTitle}</ExtraLabel> : null}
      <SelectWrapper
        onClick={() => {
          if (inApp) setDrawerShow(true);
        }}
        className={classnames({ isFocus })}
      >
        <SelectStyle
          inApp={inApp}
          placeholder={_t('kyc.verification.info.country.select')}
          filterOption={handleFilter}
          allowSearch
          searchIcon={false}
          options={countryOptions}
          dropdownIcon={<DownIcon />}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...props}
        />
        {componentContent && <span className="tip">{componentContent}</span>}
      </SelectWrapper>

      <StyledDrawer
        show={isDrawerShow}
        onClose={onHideDrawer}
        anchor="right"
        header={
          <DrawerHeader>
            <div className="headerTop">
              <span className="headerTitle">{label}</span>
              <CloseIcon onClick={onHideDrawer} />
            </div>
            <Input
              placeholder={_t('h2nHmo4Fgqf7G5JpsNSTEt')}
              fullWidth
              allowClear
              size="medium"
              onChange={(e) => {
                e.preventDefault();
                setSearchValue(e.target.value);
              }}
              value={searchValue}
              prefix={<SearchIcon />}
              inputProps={{ autocomplete: 'off' }}
            />
          </DrawerHeader>
        }
      >
        {appCountryOptions.length > 0 ? (
          <div className="list">
            {appCountryOptions.map((item) => {
              const { value, label, disabled } = item;
              return (
                <div
                  key={value}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }
                    onChange(value);
                    onHideDrawer();
                  }}
                >
                  {label()}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="emptyBox">
            <Empty description={_t('tjVXsDRHhXnSLT4q8mThSm')} size="small" />
          </div>
        )}
      </StyledDrawer>
    </>
  );
};
