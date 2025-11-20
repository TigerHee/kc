/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useState, useMemo } from 'react';
import { uniqBy } from 'lodash';
import clsx from 'clsx';
import { GetCountry } from 'kycCompliance/service';
import useFetch from 'kycCompliance/hooks/useFetch';
import useCommonData from 'kycCompliance/hooks/useCommonData';
import { CountrySelectOption } from './CountrySelectOption';
import CountryDrawer from './CountryDrawer';
import { SelectWrapper, SelectStyle } from './style';

export default ({
  componentGroupTitle,
  componentCode,
  complianceMetaCode,
  setLabel,
  componentTitle,
  componentContent,
  isMultiChoice,
  placeholder,
  ...props
}) => {
  const { value, onChange, label, disabled } = props;
  const { flowData, formData, inApp } = useCommonData();
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
        const ipItem = countries?.list?.find(i => i?.isIpRegion && i?.isDisplay && i?.isOptional);
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
    return [value, title].some(v => {
      return (v || '').toLowerCase().indexOf(lowcaseInput) > -1;
    });
  };

  const countryOptions = CountrySelectOption(
    (countries?.list || []).filter(i => i.isDisplay),
    value
  );

  const appCountryOptions = useMemo(() => {
    let list = [];
    if (countryOptions.some(i => i.options)) {
      countryOptions.forEach(i => {
        list = [...list, ...i.options];
      });
    } else {
      list = countryOptions;
    }

    return uniqBy(list, 'value').filter(i => handleFilter(searchValue, i));
  }, [countryOptions, searchValue]);

  const onHideDrawer = () => {
    setDrawerShow(false);
    setSearchValue('');
  };

  return (
    <>
      <SelectWrapper
        onClick={() => {
          if (inApp && !disabled) setDrawerShow(true);
        }}
        className={clsx({
          isFocus: isFocus && !isMultiChoice,
          isMultiChoice: isMultiChoice,
          isinApp: inApp,
          disabled,
        })}
      >
        <SelectStyle
          {...props}
          inApp={inApp}
          placeholder={isMultiChoice ? '' : placeholder}
          filterOption={handleFilter}
          allowSearch
          searchIcon={false}
          options={countryOptions}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          multiple={isMultiChoice}
        />
        {componentContent && <span className="tip">{componentContent}</span>}
      </SelectWrapper>

      <CountryDrawer
        show={isDrawerShow}
        onClose={onHideDrawer}
        label={label}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        appCountryOptions={appCountryOptions}
        onChange={onChange}
        isMultiChoice={isMultiChoice}
        value={value}
      />
    </>
  );
};
