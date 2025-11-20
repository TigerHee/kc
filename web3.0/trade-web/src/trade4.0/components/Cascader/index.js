/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-04-29 17:16:27
 * @Description: 级联选择
 */
import React, {
  isValidElement,
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
  Fragment,
} from 'react';
import classNames from 'classnames';
import Input from '@mui/Input';
import { arrayTreeFilter } from './utils';
import { RightOutlined, TriangleUpOutlined, CloseOutlined } from '@kux/icons';

import { GlobalStyle, RcCascaderWrapper, SelectedOption } from './style';

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
      flattenOptions = flattenOptions.concat(
        flattenTree(option.children, changeOnSelect, path),
      );
    }
  });
  return flattenOptions;
}
function defaultFilterOption(inputValue, path) {
  return path.some((option) => {
    return isMatchInLabel(option.label, inputValue);
  });
}

function defaultRenderFilteredOption(path) {
  return path.map(({ label }, index) => {
    if (!isValidElement(label)) {
      return index === 0 ? label : ['-', label];
    }
    return label;
  });
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
    className,
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
    value: valueFromProps,
    options: optionsFromProps,
    popupVisible: popupVisibleFromProps,
    ...otherProps
  } = props;

  const [value, setValue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [flattenOptions, setFlattenOptions] = useState([]);

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
        setInputFocused(_popupVisible);
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

  const handleInputClick = useCallback(
    (e) => {
      // Prevent `Trigger` behaviour.
      if (inputFocused || popupVisible) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }
    },
    [inputFocused, popupVisible],
  );

  const handleKeyDown = useCallback((e) => {
    // KeyCode.BACKSPACE: 8; KeyCode.SPACE: 32
    if (e.keyCode === 8) {
      e.stopPropagation();
    }
  }, []);

  const clearSelection = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!inputValue) {
        changeValue([]);
        handlePopupVisibleChange(false);
      } else {
        setInputValue('');
      }
    },
    [inputValue, changeValue, handlePopupVisibleChange],
  );

  const clearIcon = useMemo(() => {
    return (allowClear && !disabled && value.length > 0) || inputValue ? (
      <CloseOutlined className={'pickerClear'} onClick={clearSelection} />
    ) : null;
  }, [allowClear, disabled, value, inputValue]);

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
          label: render(path, inputValue, prefixCls),
          value: path.map((o) => o.value),
          disabled: path.some((o) => o.disabled),
        };
      });
    }
    return [
      {
        label: notFoundContent,
        value: 'KC_CASCADER_NOT_FOUND',
        disabled: true,
      },
    ];
  }, [
    prefixCls,
    showSearch,
    inputValue,
    popupVisible,
    flattenOptions,
    notFoundContent,
    optionsFromProps,
  ]);

  const isNotFound =
    (options || []).length === 1 &&
    options[0].value === 'KC_CASCADER_NOT_FOUND';
  const resultListMatchInputWidth =
    (showSearch || {}).matchInputWidth !== false;
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

  const arrowCls = useMemo(
    () =>
      classNames({
        pickerArrow: true,
        pickerArrowExpand: popupVisible,
      }),
    [popupVisible],
  );

  const pickerCls = useMemo(
    () =>
      classNames({
        picker: true,
        withValue: inputValue,
        disabled,
      }),
    [inputValue, disabled],
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

  return (
    <Fragment>
      <RcCascaderWrapper
        {...props}
        options={options}
        value={value}
        popupVisible={popupVisible}
        getPopupContainer={() => document.body}
        onPopupVisibleChange={handlePopupVisibleChange}
        onChange={handleChange}
        dropdownMenuColumnStyle={dropdownMenuColumnStyle}
        expandIcon={<RightOutlined size="14" className="horizontal-flip-in-arabic" />}
        popupClassName={classNames('popup', {
          [popupClassName]: popupClassName,
        })}
      >
        {children || (
          <span style={style} className={pickerCls}>
            <span className={'pickerLabel'}>{displayLabel}</span>
            <Input
              ref={input}
              disabled={disabled}
              readOnly={!showSearch}
              className={'input'}
              value={inputValue}
              onKeyDown={handleKeyDown}
              onBlur={showSearch ? () => setInputFocused(false) : undefined}
              onClick={showSearch ? handleInputClick : undefined}
              onChange={
                showSearch ? (e) => setInputValue(e.target.value) : undefined
              }
              placeholder={value && value.length > 0 ? undefined : placeholder}
            />
            {clearIcon}
            <TriangleUpOutlined className={arrowCls} />
          </span>
        )}
      </RcCascaderWrapper>
      <GlobalStyle />
    </Fragment>
  );
});
Cascader.defaultProps = {
  options: [],
  placeholder: '',
  disabled: false,
  allowClear: false,
  notFoundContent: 'Not Found',
  popupPlacement: 'bottomLeft',
  prefixCls: 'kc-cascader-20210430',
  displayRender: defaultDisplayRender,
  showSearch: {
    filter: defaultFilterOption,
    render: defaultRenderFilteredOption,
    sort: defaultSortFilteredOption,
  },
};
export default Cascader;
