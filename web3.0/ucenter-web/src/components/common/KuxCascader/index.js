/**
 * Owner: judith@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowLeft2Outlined, ICArrowLeftOutlined, ICArrowRightOutlined } from '@kux/icons';
import { Empty, Input, useTheme } from '@kux/mui';
import classNames from 'classnames';
import RcCascader from 'rc-cascader';
import React, { isValidElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { _t } from 'tools/i18n';
import {
  Adden,
  Dropdown,
  GlobalStyle,
  ICSearch,
  KcCascaderWrapper,
  SelectedOption,
  StyledTriangleUpOutlined,
} from './style';
import { arrayTreeFilter } from './utils';

function noop() {}

// 注意：如果label要传Node，请把显示的文字用label传进来，用于搜索。如： <LabelComp label="Kucoin" />
function isMatchInLabel(label, searchText) {
  let result;
  try {
    const labelText = isValidElement(label) ? label.props.label : label;
    result = labelText.toUpperCase().indexOf(searchText.toUpperCase()) > -1;
  } catch (e) {
    result = false;
  }
  return result;
}
function flattenTree(options, changeOnSelect, ancestor = []) {
  let flattenOptions = [];
  options.forEach((option) => {
    const path = ancestor.concat(option);
    if (changeOnSelect || !option.children || !option.children.length) {
      flattenOptions.push(path);
    }
    if (option.children) {
      flattenOptions = flattenOptions.concat(flattenTree(option.children, changeOnSelect, path));
    }
  });
  return flattenOptions;
}
function defaultFilterOption(inputValue, path) {
  return path.some((option) => {
    return isMatchInLabel(option.label, inputValue);
  });
}

function defaultRenderFilteredOption(path, fieldNames) {
  return path[path.length - 1][fieldNames.label];
}

function defaultSortFilteredOption(a, b, inputValue) {
  function callback(elem) {
    return isMatchInLabel(elem.label, inputValue);
  }

  return a.findIndex(callback) - b.findIndex(callback);
}

const defaultDisplayRender = (labels) => {
  const [accountLabel, symbolLabel = null] = labels;
  const { icon, label } = accountLabel?.props || {};
  return (
    <SelectedOption>
      {symbolLabel ? (
        <div className="isolatedLabel">
          {icon}
          <div>
            <div className="account">{typeof label === 'function' ? label() : label}</div>
            <div className="symbol">{symbolLabel}</div>
          </div>
        </div>
      ) : (
        accountLabel
      )}
    </SelectedOption>
  );
};

const Cascader = React.memo((props) => {
  const cachedOptions = useRef([]);
  const input = useRef(null);
  const {
    style,
    disabled,
    onChange,
    children,
    prefixCls,
    allowClear,
    showSearch,
    placeholder,
    defaultValue,
    displayRender,
    changeOnSelect,
    popupClassName,
    notFoundContent,
    onPopupVisibleChange,
    fieldNames,
    value: valueFromProps,
    options: optionsFromProps,
    popupVisible: popupVisibleFromProps,
  } = props;

  const [value, setValue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [flattenOptions, setFlattenOptions] = useState([]);
  const [isBack, setIsBack] = useState(false);
  const theme = useTheme();

  const changeValue = useCallback(
    (_value, selectedOptions = []) => {
      if (!('value' in props)) {
        setValue(_value);
      }
      if (onChange) {
        onChange(_value, selectedOptions);
      }
    },
    [onChange],
  );

  const handleChange = useCallback(
    (_value, selectedOptions) => {
      setInputValue('');
      if (selectedOptions[0].__IS_FILTERED_OPTION) {
        const unwrappedValue = _value[0];
        const unwrappedSelectedOptions = selectedOptions[0].path;
        changeValue(unwrappedValue, unwrappedSelectedOptions);
        return;
      }
      changeValue(_value, selectedOptions);
    },
    [changeValue],
  );

  const handlePopupVisibleChange = useCallback(
    (_popupVisible) => {
      if (!('popupVisible' in props)) {
        setPopupVisible(_popupVisible);
        if (!_popupVisible) {
          setInputValue('');
        }
      }
      if (onPopupVisibleChange) {
        onPopupVisibleChange(popupVisible);
      }
    },
    [onPopupVisibleChange],
  );

  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInputValue(e.target.value);
  };

  const options = useMemo(() => {
    if (!popupVisible) {
      return cachedOptions.current;
    }
    if (!inputValue) return optionsFromProps;
    const {
      filter = defaultFilterOption,
      render = defaultRenderFilteredOption,
      sort = defaultSortFilteredOption,
    } = showSearch || {};
    const filtered = flattenOptions
      .filter((path) => filter(inputValue, path))
      .sort((a, b) => sort(a, b, inputValue));

    if (filtered.length > 0) {
      return filtered.map((path) => {
        return {
          __IS_FILTERED_OPTION: true,
          path,
          [fieldNames.label]: render(path, fieldNames, inputValue, prefixCls),
          value: path.map((o) => o.value),
          disabled: path.some((o) => o.disabled),
        };
      });
    }
    return [
      { [fieldNames.label]: notFoundContent, value: 'KC_CASCADER_NOT_FOUND', disabled: true },
    ];
  }, [
    prefixCls,
    showSearch,
    inputValue,
    popupVisible,
    flattenOptions,
    notFoundContent,
    optionsFromProps,
    fieldNames,
  ]);

  const isNotFound = (options || []).length === 1 && options[0].value === 'KC_CASCADER_NOT_FOUND';
  const resultListMatchInputWidth = (showSearch || {}).matchInputWidth !== false;
  const dropdownMenuColumnStyle = useMemo(() => {
    const result = {};
    if (isNotFound) {
      result.height = 'auto';
    }
    // The default value of `matchInputWidth` is `true`
    if (resultListMatchInputWidth && inputValue && input.current) {
      result.width = input.current.offsetWidth;
    }
    return result;
  }, [isNotFound, resultListMatchInputWidth, inputValue]);

  const displayLabel = useMemo(() => {
    const unwrappedValue = Array.isArray(value[0]) ? value[0] : value;
    const selectedOptions = arrayTreeFilter(
      optionsFromProps,
      (o, level) => o.value === unwrappedValue[level],
    );
    const label = selectedOptions.map((o) => o.label);
    return displayRender(label, selectedOptions);
  }, [displayRender, optionsFromProps, value]);

  const getCurrentRenderLevel = (activeValue, optionsFromProps, isBack) => {
    let currentLevel = 0;
    if (activeValue) {
      const currentValue = Array.isArray(activeValue[0]) ? activeValue[0] : activeValue;
      const activeOptions = arrayTreeFilter(
        optionsFromProps,
        (o, level) => o.value === currentValue[level],
      );
      if (activeOptions && activeOptions.length) {
        const nextOptions = activeOptions[activeOptions.length - 1].children;
        // 有子选项，会自动展开子选项，当前层级+1
        currentLevel = nextOptions ? activeOptions.length : activeOptions.length - 1;
        // 点返回按钮 当前层级-1
        if (isBack && currentLevel > 0) {
          currentLevel = currentLevel - 1;
        }
      }
    }
    return currentLevel;
  };

  const renderDropDown = useCallback(
    (menus) => {
      const { activeValue } = menus.props;
      const currentLevel = getCurrentRenderLevel(activeValue, optionsFromProps, isBack);
      // 只展示当前层级的选项，隐藏父级选项，用返回键返回父级；
      return (
        <Dropdown currentLevel={inputValue ? 0 : currentLevel}>
          {currentLevel > 0 && (
            <Adden>
              <ICArrowLeft2Outlined
                size={20}
                color={theme.colors.icon}
                onClick={() => {
                  setInputValue('');
                  setIsBack(true);
                }}
              />
              {showSearch && (
                <Input
                  disabled={disabled}
                  value={inputValue}
                  allowClear={allowClear}
                  prefix={<ICSearch size={20} />}
                  size={'medium'}
                  onChange={handleSearch}
                />
              )}
            </Adden>
          )}
          <div onClick={() => setIsBack(false)}>{menus}</div>
        </Dropdown>
      );
    },
    [showSearch, optionsFromProps, inputValue, disabled, isBack],
  );

  useEffect(() => {
    // Dropdown menu should keep previous status until it is fully closed.
    if (popupVisible) {
      cachedOptions.current = options;
    }
  }, [popupVisible]);

  useEffect(() => {
    setPopupVisible(popupVisibleFromProps);
  }, [popupVisibleFromProps]);

  useEffect(() => {
    setValue(props.value || props.defaultValue || []);
  }, [valueFromProps, defaultValue]);

  useEffect(() => {
    if (showSearch) {
      const nextFlattenOptions = flattenTree(optionsFromProps, changeOnSelect);
      setFlattenOptions(nextFlattenOptions);
    }
  }, [showSearch, optionsFromProps, changeOnSelect]);
  const { isRTL } = useLocale();
  return (
    <KcCascaderWrapper>
      <RcCascader
        {...props}
        options={options}
        value={value}
        popupVisible={popupVisible}
        getPopupContainer={() => document.body}
        onPopupVisibleChange={handlePopupVisibleChange}
        onChange={handleChange}
        dropdownMenuColumnStyle={dropdownMenuColumnStyle}
        dropdownRender={renderDropDown}
        expandIcon={
          !isRTL ? (
            <ICArrowRightOutlined size="14" color={theme.colors.icon} />
          ) : (
            <ICArrowLeftOutlined size="14" color={theme.colors.icon} />
          )
        }
        popupClassName={classNames('kcCascader-popup', {
          [popupClassName]: popupClassName,
        })}
      >
        {children || (
          <span
            style={style}
            className={classNames('picker', {
              disabled: disabled,
            })}
          >
            <span className="pickerLabel">{displayLabel}</span>
            <StyledTriangleUpOutlined isShow={popupVisible} />
          </span>
        )}
      </RcCascader>
      <GlobalStyle theme={theme} />
    </KcCascaderWrapper>
  );
});
Cascader.defaultProps = {
  options: [],
  placeholder: '',
  disabled: false,
  allowClear: true,
  notFoundContent: (
    <Empty
      style={{ margin: '42px auto' }}
      description={_t('k8UQZ4icRzMeE8mypXaMbf')}
      size="small"
    />
  ),
  popupPlacement: 'bottomLeft',
  prefixCls: 'kc-cascader-20210430',
  displayRender: defaultDisplayRender,
  showSearch: {
    filter: defaultFilterOption,
    render: defaultRenderFilteredOption,
    sort: defaultSortFilteredOption,
  },
  fieldNames: {
    label: 'label',
  },
};
export default Cascader;
