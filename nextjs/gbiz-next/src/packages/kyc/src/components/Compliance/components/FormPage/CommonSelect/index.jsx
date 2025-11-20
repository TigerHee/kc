/**
 * Owner: tiger@kupotech.com
 * 公共下拉
 */
import { useMemo, useState, Fragment, useEffect } from 'react';
import clsx from 'clsx';
import { Input, Empty } from '@kux/mui';
import { isEmpty } from 'lodash-es';
import useFetch from '../../../hooks/useFetch';
import { postJsonWithPrefix } from '../../../service';
import useCommonData from '../../../hooks/useCommonData';
import { useLang } from '../../../../../hookTool';
import { selectFetchUrlConfig } from '../formConfig';
import {
  SelectWrapper,
  SelectStyle,
  StyledDrawer,
  DrawerHeader,
  CloseIcon,
  SearchIcon,
  ActiveIcon,
} from './style';

const OptionItem = ({ label, value, active, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(value)}
      className={clsx({
        item: true,
        itemActive: active,
      })}
      key={value}
    >
      <span>{label}</span>
      {active ? <ActiveIcon /> : null}
    </div>
  );
};

export default (props) => {
  const {
    componentCode,
    complianceMetaCode,
    onChange,
    placeholder,
    options: customOptions,
    uiConfig,
    form,
    name,
    curFormValue,
    componentType,
  } = props;

  const { _t } = useLang();
  const { flowData, inApp, formData } = useCommonData();
  // const inApp = true;

  const [isDrawerShow, setDrawerShow] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const dependentMetaCode = uiConfig?.dependentMetaCode;
  const parentCode = dependentMetaCode ? formData[dependentMetaCode] : undefined;

  const ready = useMemo(() => {
    if (customOptions) {
      return false;
    }
    return Boolean(flowData?.complianceStandardCode && complianceMetaCode && !dependentMetaCode);
  }, [flowData?.complianceStandardCode, complianceMetaCode, customOptions, dependentMetaCode]);

  const { data, onFetchData } = useFetch(
    (param) => {
      const url =
        componentType === 6
          ? '/compliance/component/enum/list'
          : selectFetchUrlConfig[componentCode] || `/compliance/component/${componentCode}/init`;
      return postJsonWithPrefix(url, param);
    },
    {
      cacheKey: complianceMetaCode,
      ready,
      params: {
        complianceStandardCode: flowData?.complianceStandardCode,
        metaCode: complianceMetaCode,
      },
    },
  );

  useEffect(() => {
    if (dependentMetaCode) {
      onFetchData({
        complianceStandardCode: flowData?.complianceStandardCode,
        metaCode: complianceMetaCode,
        parentCode,
      });

      if (curFormValue[dependentMetaCode]) {
        form.setFieldsValue({ [name]: '' });
      }
    }
  }, [parentCode]);

  const fullOptionSource = useMemo(() => {
    if (customOptions) return customOptions;
    return data?.list?.filter((i) => i.isOptional && i.isDisplay) || [];
  }, [customOptions, data?.list]);

  const optionList = useMemo(() => {
    const lowerSearch = searchValue.toLowerCase();
    return fullOptionSource
      .filter((i) => {
        if (i.options) {
          return true;
        }
        return (i.name || i.label)?.toLowerCase().includes(lowerSearch);
      })
      .map(({ name, code, label, value, options }) => {
        const optionItem = {
          label: <span title={name}>{name || label}</span>,
          value: String(code || value || ''),
          title: name || label,
        };
        if (options) {
          optionItem.options = options.filter((i) => {
            return String(i.name || i.label)
              ?.toLowerCase()
              .includes(lowerSearch);
          });
        }
        return optionItem;
      });
  }, [fullOptionSource, searchValue]);

  const handleFilter = (inputValue, option) => {
    const { name, title, label } = option;
    const lowercaseInput = (inputValue || '').toLowerCase();
    return String(name || title || label)
      .toLowerCase()
      .includes(lowercaseInput);
  };

  const onHideDrawer = () => {
    setDrawerShow(false);
    setSearchValue('');
  };

  return (
    <>
      <SelectWrapper
        onClick={() => {
          if (inApp) setDrawerShow(true);
        }}
      >
        <SelectStyle
          size="xlarge"
          fullWidth
          inApp={inApp}
          searchIcon={false}
          allowSearch
          filterOption={handleFilter}
          options={optionList}
          {...props}
        />
      </SelectWrapper>

      <StyledDrawer
        show={isDrawerShow}
        onClose={onHideDrawer}
        anchor="bottom"
        header={
          <DrawerHeader>
            <div className="headerTop">
              <span className="headerTitle">{placeholder}</span>
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
        {optionList.length > 0 ? (
          <div className="list">
            {optionList.map((item) => {
              // 分组
              if (item.options) {
                if (isEmpty(item.options)) {
                  return <Fragment key={item.label} />;
                }
                return (
                  <Fragment key={item.label}>
                    <div className="groupLabel">{item.title}</div>
                    {item.options.map((sub) => (
                      <OptionItem
                        key={sub.value}
                        label={sub.label}
                        value={sub.value}
                        active={sub.value === props.value}
                        onSelect={(val) => {
                          onChange(val);
                          onHideDrawer();
                        }}
                      />
                    ))}
                  </Fragment>
                );
              }

              return (
                <OptionItem
                  key={item.value}
                  label={item.label}
                  value={item.value}
                  active={item.value === props.value}
                  onSelect={(val) => {
                    onChange(val);
                    onHideDrawer();
                  }}
                />
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
