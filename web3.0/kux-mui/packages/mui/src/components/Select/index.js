/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import styled from 'emotion/index';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ICTriangleTopOutlined, ICCloseFilled } from '@kux/icons';
import ClickAwayListener from 'components/ClickAwayListener';
import useTheme from 'hooks/useTheme';
import { throttle } from 'lodash-es';
import { usePopper } from 'react-popper';
import { on, off } from 'utils/dom';
import useForkRef from 'hooks/useForkRef';
import useMergedState from 'hooks/useMergedState';
import Spin from '../Spin';
import ResizeObserver from '../ResizeObserver';

import {
  SelectSelector,
  SelectContainer,
  LabelContainer,
  LabelFieldSet,
  LabelLegend,
} from './StyledComps';
import Portal from '../Portal';
import MultipleSelector from './MultipleSelector';
import SingleSelector from './SingleSelector';

import { getOptionHeightFromSize, fillFieldNames, toArray, getSearchIconSizeFromSize } from './aux';
import useOptions from './selectHooks/useOptions';
import useFilterOptions from './selectHooks/useFilterOptions';

import OptionList from './OptionList';
import useFlattenOptions from './selectHooks/useFlattenOptions';
import useClassNames from './useClassNames';

const preSize = {
  mini: 'small',
  basic: 'medium',
  large: 'large',
  xlarge: 'xlarge',
};

const IconWrapper = styled.span`
  position: ${(props) => (props.noStyle ? 'unset' : 'absolute')};
  top: 50%;
  transform: ${(props) => (props.noStyle ? 'none' : 'translateY(-50%)')};
  display: flex;
  align-items: center;
  line-height: 1;
  text-align: center;
  right: ${(props) => (props.noStyle ? 0 : '16px')};
`;

const StyledTriangleUpOutlined = styled.div((props) => {
  return {
    marginLeft: '6px',
    'svg': {
      transform: `rotate(${props.isShow ? 0 : -180}deg)`,
      transformOrigin: 'center',
      transition: 'transform 0.3s',
    },
  };
});

function handlePlaceholder(placeholder, shrink) {
  if (shrink) return placeholder;
}

const Select = React.forwardRef(
  (
    {
      // open
      open,
      defaultOpen,
      onDropDownVisibleChange,
      className,

      // value
      value,
      defaultValue,
      onChange,

      // filter
      optionFilterProp,

      optionLabelProp,

      size,
      placeholder,
      error,
      allowClear,
      allowSearch,
      searchIcon = true,
      dropdownIcon = true,
      disabled,
      loading,
      searchPlaceholder,

      // type,

      classNames = {},

      fullWidth,
      reference,
      matchWidth,
      filterOption,
      placement,

      autoScrollToSelected,

      dropdownHeight,
      dropdownAddonAfter,
      dropdownAddonBefore,
      dropdownAddonAfterHeight,
      dropdownAddonBeforeHeight,
      listItemHeight,
      emptyContent,
      onFocus,
      onBlur,
      options,
      multiple,
      style,
      noStyle,
      label,
      labelProps = {},
      autoComplete = 'off',
      ...rest
    },
    ref,
  ) => {
    size = preSize[size] || size;
    const fontSize = size === 'mini' ? 14 : size === 'large' || size === 'xlarge' ? 20 : 16;
    const _classNames = useClassNames({ size, disabled, loading, error });

    dropdownAddonAfterHeight = dropdownAddonAfterHeight || getOptionHeightFromSize(size);
    dropdownAddonBeforeHeight = dropdownAddonBeforeHeight || getOptionHeightFromSize(size);
    listItemHeight = listItemHeight || getOptionHeightFromSize(size);

    const theme = useTheme();
    const targetRef = React.useRef();
    const handleRef = useForkRef(targetRef, ref);
    const [elRef, setElRef] = React.useState();
    const [searchVal, setSearchVal] = React.useState('');
    const searchRef = React.useRef(null);

    const [selectionWidth, setSelectionWidth] = React.useState(0);

    const [isHover, setIsHover] = React.useState(false);

    const mergedFieldNames = React.useMemo(() => fillFieldNames(), []);

    const [innerValue, setInnerValue] = useMergedState(defaultValue, {
      value,
    });

    const [innerOpen, setInnerOpen] = useMergedState(defaultOpen, {
      value: open,
    });

    const toggleOpen = useCallback(
      (newOpen) => {
        const nextOpen = newOpen !== undefined ? newOpen : !innerOpen;

        if (innerOpen !== nextOpen && !disabled) {
          setInnerOpen(nextOpen);
          if (onDropDownVisibleChange) {
            onDropDownVisibleChange(nextOpen);
          }
        }
        if (newOpen === false) {
          setIsHover(false);
        }
      },
      [disabled, innerOpen, onDropDownVisibleChange, setInnerOpen],
    );

    const { options: mergedOptions, valueOptions } = useOptions(options);

    const filteredOptions = useFilterOptions(
      mergedOptions,
      searchVal,
      filterOption,
      mergedFieldNames,
      optionFilterProp,
    );

    const flattenOptions = useFlattenOptions(filteredOptions);

    // 选中的选项

    const mergedValues = React.useMemo(() => {
      return toArray(innerValue);
    }, [innerValue]);

    const selectedValues = React.useMemo(() => {
      return new Set(mergedValues.map((val) => val));
    }, [mergedValues]);

    const selectedOptions = React.useMemo(() => {
      return mergedValues.map((v) => valueOptions.get(v));
    }, [mergedValues, valueOptions]);

    const handleChange = React.useCallback(
      (val) => {
        if (value === undefined) {
          setInnerValue(val);
        }
        if (onChange) {
          const returnValues = val;
          const returnOptions = val.map((v) => valueOptions.get(v));

          onChange(
            multiple ? returnValues : returnValues[0],
            multiple ? returnOptions : returnOptions[0],
          );
        }
      },
      [value, onChange, setInnerValue, multiple, valueOptions],
    );

    const onSelectValue = React.useCallback(
      (val, info) => {
        let cloneValues = [];

        const mergedSelect = multiple ? info.selected : true;

        if (mergedSelect) {
          cloneValues = multiple ? [...mergedValues, val] : [val];
        } else {
          cloneValues = mergedValues.filter((v) => v !== val);
        }
        handleChange(cloneValues);

        if (!multiple) {
          toggleOpen(false);
        } else {
          toggleOpen(true);
        }
      },
      [handleChange, mergedValues, multiple, toggleOpen],
    );

    const handleRemove = React.useCallback(
      (val) => {
        let cloneValues = [];
        cloneValues = mergedValues.filter((v) => v !== val);
        handleChange(cloneValues);
      },
      [handleChange, mergedValues],
    );

    const handleInputClick = React.useCallback(
      (event) => {
        if (disabled || loading) {
          return;
        }
        toggleOpen(!innerOpen);
      },
      [disabled, innerOpen, loading, toggleOpen],
    );

    const handleClearValue = React.useCallback(() => {
      handleChange([]);
    }, [handleChange]);

    const dropdownIconNode = useMemo(() => {
      const isNode = React.isValidElement(dropdownIcon);
      return dropdownIcon ? (
        <StyledTriangleUpOutlined isShow={innerOpen} className={_classNames.dropdownIcon}>
          {isNode ? (
            dropdownIcon
          ) : (
            <ICTriangleTopOutlined
              size={getSearchIconSizeFromSize(size)}
              color={
                disabled
                  ? theme.colors.disabled
                  : isHover || innerOpen
                  ? theme.colors.text60
                  : theme.colors.text
              }
            />
          )}
        </StyledTriangleUpOutlined>
      ) : null;
    }, [dropdownIcon, size, theme, innerOpen, disabled, isHover]);

    // 按钮
    const iconNode = React.useMemo(() => {
      if (disabled) {
        return dropdownIconNode;
      }
      if (loading) {
        return <Spin size="small" type="normal" />;
      }

      // 去除空值 ['']
      const _mergedValues = mergedValues ? mergedValues.filter((item) => item) : [];

      if (_mergedValues && _mergedValues.length && allowClear && (isHover || innerOpen)) {
        return (
          <ICCloseFilled
            size={fontSize}
            color={theme.colors.text20}
            onClick={(e) => {
              e.stopPropagation();
              handleClearValue();
              toggleOpen(false);
            }}
          />
        );
      }
      return dropdownIconNode;
    }, [
      fontSize,
      disabled,
      loading,
      mergedValues,
      allowClear,
      isHover,
      innerOpen,
      theme,
      handleClearValue,
      toggleOpen,
      dropdownIconNode,
    ]);

    const detectSize = React.useCallback(() => {
      if (innerOpen) {
        const usedRef = reference || targetRef.current;
        if (usedRef) {
          setSelectionWidth(usedRef.offsetWidth || 0);
        }
      }
    }, [reference, innerOpen]);

    React.useEffect(() => {
      const el = searchRef.current;
      if (innerOpen && allowSearch && el) {
        el.focus();
      }
      if (!innerOpen && allowSearch) {
        setSearchVal('');
      }
      if (disabled) {
        setSearchVal('');
      }
    }, [innerOpen, allowSearch, disabled]);

    React.useEffect(() => {
      detectSize();
      const _detectSize = throttle(detectSize, 16);
      on(window, 'resize', _detectSize, false);
      return () => {
        off(window, 'resize', _detectSize, false);
      };
    }, [detectSize]);

    React.useEffect(() => {
      if (innerOpen) {
        onFocus && onFocus();
      } else {
        onBlur && onBlur();
      }
    }, [innerOpen, onFocus, onBlur]);

    const { styles, attributes, update } = usePopper(targetRef.current, elRef, {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 4],
          },
        },
      ],
      placement,
    });

    const handleResize = () => {
      if (update && innerOpen) {
        update();
      }
    };

    const shrink =
      innerOpen ||
      innerValue ||
      labelProps.shrink ||
      (allowSearch && searchIcon) ||
      !label ||
      false;

    const _placeholder = handlePlaceholder(placeholder, shrink);

    return (
      <ClickAwayListener
        onClickAway={() => {
          toggleOpen(false);
        }}
      >
        <SelectContainer
          {...rest}
          style={style}
          fullWidth={fullWidth}
          className={clsx(_classNames.root, classNames.container, className)}
          error={error}
          isFocus={innerOpen}
          theme={theme}
          noStyle={noStyle}
        >
          <ResizeObserver onResize={handleResize}>
            <SelectSelector
              multiple={multiple}
              ref={handleRef}
              className={clsx(_classNames.wrapper, classNames.select)}
              size={size}
              error={error}
              theme={theme}
              noStyle={noStyle}
              isFocus={innerOpen}
              onClick={handleInputClick}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              onTouchStart={() => setIsHover(true)}
              onTouchEnd={() => setIsHover(false)}
              disabled={disabled}
              isLoading={loading}
            >
              {multiple ? (
                <MultipleSelector
                  size={size}
                  optionLabelProp={optionLabelProp}
                  onRemove={handleRemove}
                  selectedOptions={selectedOptions}
                  searchPlaceholder={searchPlaceholder}
                  placeholder={_placeholder}
                  searchRef={searchRef}
                  searchVal={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  autoComplete={autoComplete}
                />
              ) : (
                <SingleSelector
                  multiple={multiple}
                  innerOpen={innerOpen}
                  classNames={classNames}
                  allowSearch={allowSearch}
                  searchIcon={searchIcon}
                  selectedOptions={selectedOptions}
                  searchPlaceholder={searchPlaceholder}
                  placeholder={_placeholder}
                  searchRef={searchRef}
                  searchVal={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  size={size}
                  noStyle={noStyle}
                  optionLabelProp={optionLabelProp}
                  autoComplete={autoComplete}
                />
              )}
              <IconWrapper noStyle={noStyle} className={_classNames.icon}>
                {iconNode}
              </IconWrapper>
            </SelectSelector>
          </ResizeObserver>

          {innerOpen ? (
            <Portal>
              <OptionList
                popperStyles={styles}
                popperAttributes={attributes}
                ref={(el) => setElRef(el)}
                selectionWidth={selectionWidth}
                matchWidth={matchWidth}
                classNames={classNames}
                dropdownHeight={dropdownHeight}
                listItemHeight={listItemHeight}
                options={flattenOptions}
                dropdownAddonBefore={dropdownAddonBefore}
                dropdownAddonAfter={dropdownAddonAfter}
                dropdownAddonBeforeHeight={dropdownAddonBeforeHeight}
                dropdownAddonAfterHeight={dropdownAddonAfterHeight}
                selectedValues={selectedValues}
                theme={theme}
                size={size}
                onSelect={onSelectValue}
                autoScrollToSelected={autoScrollToSelected}
                emptyContent={emptyContent}
              />
            </Portal>
          ) : null}
          {label ? (
            <LabelContainer
              theme={theme}
              disabled={disabled}
              isFocus={innerOpen}
              error={error}
              value={innerValue}
              size={size}
              labelProps={labelProps}
              shrink={shrink}
            >
              {label}
            </LabelContainer>
          ) : null}

          <LabelFieldSet theme={theme} error={error} isFocus={innerOpen} noStyle={noStyle}>
            <LabelLegend shrink={shrink} size={size} label={label}>
              {label}
            </LabelLegend>
          </LabelFieldSet>
        </SelectContainer>
      </ClickAwayListener>
    );
  },
);

Select.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultOpen: PropTypes.bool, // default open select panel
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']), // default size
  allowClear: PropTypes.bool, // allow clear
  error: PropTypes.bool, // error status
  disabled: PropTypes.bool, // disabled status
  loading: PropTypes.bool, // loading status
  allowSearch: PropTypes.bool, // allow search
  fullWidth: PropTypes.bool, // full input width
  matchWidth: PropTypes.bool, // panel width is match with input
  multiple: PropTypes.bool, // is multiple select
  noStyle: PropTypes.bool, // no input style
  autoScrollToSelected: PropTypes.bool, // auto scroll selected option to view
  placement: PropTypes.string, // panel anchor, you can search Placement in @popperjs/core;
  dropdownHeight: PropTypes.number, // panel height
  optionLabelProp: PropTypes.string, // option label prop
  optionFilterProp: PropTypes.string, // option label filter at
  options: PropTypes.array, // options
  dropdownIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]), // custom dropdown icon
  classNames: PropTypes.object, // set className to some node
  onDropDownVisibleChange: PropTypes.func, // callback for panel visible change
  onChange: PropTypes.func, // callback for select item
  onBlur: PropTypes.func, // callback for input onblur
  onFocus: PropTypes.func, // callback for input focus
  listItemHeight: PropTypes.number, // option item height
  emptyContent: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]), // set empty content, use Empty props
};

Select.defaultProps = {
  defaultOpen: false,
  size: 'medium',
  allowClear: false,
  error: false,
  disabled: false,
  loading: false,
  allowSearch: false,
  fullWidth: true,
  matchWidth: true,
  multiple: false,
  noStyle: false,
  autoScrollToSelected: true,
  placement: 'bottom-start',
  dropdownHeight: 256,
  optionLabelProp: 'label',
  optionFilterProp: 'title',
  options: [],
  dropdownIcon: true,
  classNames: {
    container: '',
    select: '',
    clearIcon: '',
    dropdownContainer: '',
    optionItem: '',
    searchPlaceholder: '',
    placeholder: '',
  },
};

export default Select;
