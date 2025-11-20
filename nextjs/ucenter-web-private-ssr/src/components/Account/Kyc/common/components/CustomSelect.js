/**
 * Owner: vijay.zhou@kupotech.com
 * 这是业务自定义的 Select 组件
 * 由于 @kux/mui 的 Select 组件不满足以下设计：
 *  1. 搜索框内置到下拉列表里
 *  2. 下拉选项定制更丰富的内容
 * 所以重新写了一个，除了实现以上功能外，其他交互逻辑参考 @kux/mui 的 Select 组件
 */
import { ICArrowDownOutlined, ICSearchOutlined } from '@kux/icons';
import { ClickAwayListener, Input, isPropValid, Portal, styled, useTheme } from '@kux/mui';
import { capitalize, merge } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { _t } from 'src/tools/i18n';
import { variant } from 'styled-system';

/**
 * Start: 拷贝自 @kux/mui/Select 组件
 ** 删减了部分代码
 */
/**
 * 通过size获取文字大小
 * @param {*} size
 * @returns
 */
function getFontSizeFromSize(size) {
  switch (size) {
    case 'small':
      return 12;
    case 'large':
      return 16;
    case 'xlarge':
      return 16;
    default:
      return 14;
  }
}
/**
 * 通过size获取选项的高度
 * @param {*} size
 * @returns
 */
function getOptionHeightFromSize(size) {
  switch (size) {
    case 'small':
      return 32;
    case 'large':
      return 48;
    case 'xlarge':
      return 56;
    default:
      return 40;
  }
}
function useClassNames(state = {}) {
  const { size, disabled, loading, error } = state;
  const prefix = 'KuxSelect';
  const slots = {
    root: [
      'root',
      'size' + capitalize(size),
      disabled && 'disabled',
      loading && 'loading',
      error && 'error',
    ],
    wrapper: ['wrapper'],
    icon: ['icon'],
    dropdownIcon: ['dropdownIcon'],
  };
  return Object.keys(slots).reduce((res, key) => {
    res[key] = slots[key]
      .filter(Boolean)
      .map((cls) => `${prefix}-${cls}`)
      .join(' ');
    return res;
  }, {});
}
const SelectContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin: 0;
  padding: 0;
  width: 100%;
  border-radius: 8px;
  transition: all 0.3s ease;
`;
const SelectSelector = styled('div', {
  shouldForwardProp(props) {
    return isPropValid(props);
  },
})(({ theme, size, disabled, isLoading }) => {
  return merge(
    {
      position: 'relative',
      border: 'none',
      outline: 'none',
      transition: 'all 0.3s',
      boxSizing: 'border-box',
      width: '100%',
      fontSize: getFontSizeFromSize(size) + 'px',
      color: theme.colors.text,
      opacity: disabled ? 0.4 : 1,
      cursor: disabled ? 'not-allowed' : isLoading ? 'progress' : 'pointer',
    },
    {
      padding: '0 16px',
      height: getOptionHeightFromSize(size) + 'px',
    },
    {
      padding: 0,
      display: 'flex',
      alignItems: 'center',
    },
  );
});
const LabelContainer = styled.label(
  {
    position: 'absolute',
    left: 0,
    top: 0,
    transformOrigin: 'left top',
    padding: '0 2px',
    whiteSpace: 'nowrap',
    transition:
      'color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    pointerEvents: 'none',
  },
  ({ shrink }) => {
    return variant({
      prop: 'size',
      variants: {
        small: {
          fontSize: '12px',
          lineHeight: '16px',
          transform: shrink ? 'translate(14px, -5px) scale(0.75)' : 'translate(14px, 8px) scale(1)',
        },
        medium: {
          fontSize: '14px',
          lineHeight: '18px',
          transform: shrink
            ? 'translate(14px, -7px) scale(0.75)'
            : 'translate(14px, 10px) scale(1)',
        },
        large: {
          fontSize: '16px',
          lineHeight: '22px',
          transform: shrink
            ? 'translate(14px, -7px) scale(0.75)'
            : 'translate(14px, 12px) scale(1)',
        },
        xlarge: {
          fontSize: '16px',
          lineHeight: '24px',
          transform: shrink
            ? 'translate(14px, -9px) scale(0.75)'
            : 'translate(14px, 16px) scale(1)',
        },
      },
    });
  },
  ({ theme, error, disabled, isFocus }) => {
    return {
      color: error
        ? theme.colors.secondary
        : disabled
          ? theme.colors.text40
          : isFocus
            ? theme.colors.textPrimary
            : theme.colors.text,
    };
  },
);
const LabelFieldSet = styled('fieldset', {
  shouldForwardProp(props) {
    return isPropValid(props);
  },
})(({ theme, isFocus, error, disabled }) => {
  return {
    position: 'absolute',
    top: -5,
    left: -2,
    right: -2,
    bottom: 0,
    pointerEvents: 'none',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    color: disabled ? theme.colors.text40 : theme.colors.text,
    borderColor: error
      ? theme.colors.secondary
      : isFocus
        ? theme.colors.textPrimary
        : theme.colors.cover12,
  };
});
const LabelLegend = styled.legend(
  {
    visibility: 'hidden',
    height: 12,
    fontSize: 12,
    lineHeight: 24,
  },
  ({ shrink, label }) => {
    return {
      maxWidth: shrink ? '100%' : '0.01px',
      padding: shrink && label ? 2 : '0',
    };
  },
  () => {
    return variant({
      prop: 'size',
      variants: {
        small: {
          fontSize: 11,
        },
        medium: {
          fontSize: 12,
        },
        large: {
          fontSize: 12,
        },
        xlarge: {
          fontSize: 12,
        },
      },
    });
  },
);
/** End: 拷贝自 @kux/mui/Select 组件 */

const Content = styled.div`
  padding: 0 16px;
  display: flex;
  flex: 1;
  align-items: center;
`;
const SelectedLabel = styled.div`
  flex: 1;
`;
const DropdownIcon = styled(ICArrowDownOutlined)`
  transform-origin: center center;
  transition: transform 300ms;
  transform: ${({ active }) => (active ? 'rotate(-180deg)' : 'none')};
`;
const Popper = styled.div`
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.06) 0px 4px 40px 0px;
  border: 1px solid ${({ theme }) => theme.colors.divider4};
  background: ${({ theme }) => theme.colors.textEmphasis};
  overflow-y: hidden;
`;
const SearchBox = styled.div`
  padding: 20px 16px;
`;
const List = styled.div`
  max-height: 280px;
  overflow-y: auto;
`;
const Option = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: ${({ theme, active }) => (active ? theme.colors.divider4 : 'none')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background: ${({ theme }) => theme.colors.divider4};
  }
`;
const OptionLabel = styled.div`
  color: ${({ theme, disabled }) => (disabled ? theme.colors.text40 : theme.colors.text)};
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
`;
const OptionDesc = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
`;
const Divider = styled.div`
  margin: 0 16px;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider4};
`;

const CustomSelect = ({
  size = 'xlarge',
  name,
  label,
  value,
  options = [],
  allowSearch,
  disabled,
  loading,
  error,
  divider,
  onChange = () => {},
}) => {
  const classNames = useClassNames({ size, disabled, loading, error });
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const shrink = open || value;

  const filterOptions = useMemo(() => {
    if (!keyword) {
      return options;
    }
    return options.filter((opt) => {
      const _keyword = keyword.toUpperCase();
      // 检查父级选项是否匹配
      const parentMatches =
        opt.title?.toUpperCase?.().includes(_keyword) ||
        opt.description?.toUpperCase?.().includes(_keyword) ||
        opt.value?.toUpperCase?.().includes(_keyword);

      // 如果有子选项，检查子选项是否匹配
      if (opt.children && opt.children.length > 0) {
        const childrenMatch = opt.children.some(
          (child) =>
            child.title?.toUpperCase?.().includes(_keyword) ||
            child.description?.toUpperCase?.().includes(_keyword) ||
            child.value?.toUpperCase?.().includes(_keyword),
        );
        return parentMatches || childrenMatch;
      }

      return parentMatches;
    });
  }, [options, keyword]);

  const renderLabel = (opt, inner = false) => {
    return opt?.label?.(inner) ?? opt?.title ?? opt?.value;
  };

  const referenceRef = useRef();
  const [referenceWidth, setReferenceWidth] = useState(0);
  const [popperRef, setPopperRef] = useState();

  const { styles, attributes, update } = usePopper(referenceRef.current, popperRef, {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 4],
        },
      },
    ],
    placement: 'bottom-start',
  });

  useEffect(() => {
    const handleResize = () => {
      setReferenceWidth(referenceRef.current?.offsetWidth ?? 0);
      open && update?.();
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, update]);

  const currentValue = useMemo(() => {
    // 首先在父级选项中查找
    let found = options.find((opt) => opt.value === value);

    // 如果在父级中没找到，在子选项中查找
    if (!found) {
      for (const option of options) {
        if (option.children && option.children.length > 0) {
          found = option.children.find((child) => child.value === value);
          if (found) break;
        }
      }
    }

    return found;
  }, [options, value]);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <SelectContainer ref={referenceRef} id={name} className={classNames.root}>
        <SelectSelector
          theme={theme}
          size={size}
          disabled={disabled}
          isLoading={loading}
          className={classNames.wrapper}
          onClick={() => {
            if (disabled || loading) {
              return;
            }
            setOpen(!open);
          }}
        >
          <Content>
            <SelectedLabel>{renderLabel(currentValue, true)}</SelectedLabel>
            <DropdownIcon active={open} size={20} />
          </Content>
        </SelectSelector>
        <LabelContainer
          size={size}
          shrink={shrink}
          isFocus={open}
          error={error}
          disabled={disabled}
        >
          {label}
        </LabelContainer>
        <LabelFieldSet isFocus={open} error={error} disabled={disabled}>
          <LabelLegend size={size} label={label} shrink={shrink}>
            {label}
          </LabelLegend>
        </LabelFieldSet>
        {open ? (
          <Portal>
            <Popper
              id={name ? `${name}_popper` : undefined}
              ref={(el) => setPopperRef(el)}
              style={{
                width: referenceWidth,
                ...styles.popper,
              }}
              {...attributes.popper}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {allowSearch ? (
                <SearchBox>
                  <Input
                    size="large"
                    prefix={<ICSearchOutlined size={20} color={theme.colors.text40} />}
                    placeholder={_t('search')}
                    value={keyword}
                    allowClear
                    inputProps={{ autoFocus: true }}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                    }}
                  />
                </SearchBox>
              ) : null}
              <List className="custom_select_options">
                {filterOptions.map((option, index) => (
                  <div key={`option_group_${option.value}`}>
                    {index > 0 && divider && <Divider key={`divider_${option.value}`} />}
                    {/* 如果选项有children，则显示为不可选择的父级选项 */}
                    {option.children && option.children.length > 0 ? (
                      <>
                        <Option
                          key={`option_${option.value}`}
                          disabled={true}
                          active={false}
                          onClick={() => {
                            // 父级选项不可选择
                          }}
                        >
                          <OptionLabel disabled={true}>{renderLabel(option, false)}</OptionLabel>
                          {option.description ? (
                            <OptionDesc>{option.description}</OptionDesc>
                          ) : null}
                        </Option>
                        {/* 子级选项 */}
                        <div style={{ paddingLeft: '0' }}>
                          {option.children.map((child) => (
                            <Option
                              key={`child_option_${child.value}`}
                              disabled={child.disabled}
                              active={value === child.value}
                              onClick={() => {
                                if (!child.disabled) {
                                  onChange(child.value);
                                  setOpen(false);
                                }
                              }}
                            >
                              <OptionLabel disabled={child.disabled}>
                                {renderLabel(child, false)}
                              </OptionLabel>
                              {child.description ? (
                                <OptionDesc>{child.description}</OptionDesc>
                              ) : null}
                            </Option>
                          ))}
                        </div>
                      </>
                    ) : (
                      /* 如果选项没有children，则显示为普通可选择的选项 */
                      <Option
                        key={`option_${option.value}`}
                        disabled={option.disabled}
                        active={value === option.value}
                        onClick={() => {
                          if (!option.disabled) {
                            onChange(option.value);
                            setOpen(false);
                          }
                        }}
                      >
                        <OptionLabel disabled={option.disabled}>
                          {renderLabel(option, false)}
                        </OptionLabel>
                        {option.description ? <OptionDesc>{option.description}</OptionDesc> : null}
                      </Option>
                    )}
                  </div>
                ))}
              </List>
            </Popper>
          </Portal>
        ) : null}
      </SelectContainer>
    </ClickAwayListener>
  );
};

export default CustomSelect;
