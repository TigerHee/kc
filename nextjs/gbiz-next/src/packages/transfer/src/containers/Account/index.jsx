/**
 * Owner: solar@kupotech.com
 */
import {
  ICArrowRightOutlined,
  ICArrowUpOutlined,
  ICArrowDownOutlined,
  ICArrowLeft2Outlined,
} from '@kux/icons';
import { ClickAwayListener, Empty, Input, useTheme, Spin } from '@kux/mui';
import clns from 'classnames';
import { forwardRef, memo, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'tools/i18n';
import { useForceFormFieldChange } from '@transfer/hooks/fields';
import { registAnimateItem } from '../../animate';
import { useDebounce } from '../../hooks/useDebounce';
// import { getConfigByAccount } from '../../config';
import { useGetConfigByAccount } from '../../hooks/accounts';
import { useTransferDispatch, useTransferSelector, useTransferLoading } from '../../utils/redux';

import {
  ICSearch,
  StyledSubSelect,
  StyledOverlay,
  StyledDropdown,
  StyledTopSelect,
  StyledAccountShow,
} from './style';

const LEVEL_UP = 'level_up';

const TopSelect = memo(({ onChange, topOptions, value, topName }) => {
  const forceFormUpdate = useForceFormFieldChange();
  const theme = useTheme();
  const subName = useMemo(
    () =>
      ({
        payAccountType: 'payTag',
        recAccountType: 'recTag',
      }[topName]),
    [topName],
  );
  const getConfigByAccount = useGetConfigByAccount();
  return (
    <StyledTopSelect>
      {topOptions.map((option) => {
        const { label, icon: ICON, value: itemValue, topGap } = option;
        // 是否有二级下拉
        const hasSubLevel = getConfigByAccount(itemValue)?.getTags;
        return (
          <>
            {topGap && <div className="top-gap" key={`${itemValue}-gap`} />}
            <button
              className={clns('top-option', {
                'actived': value === itemValue,
              })}
              type="button"
              onClick={() => {
                if (hasSubLevel) {
                  onChange(itemValue, LEVEL_UP);
                  return;
                }
                onChange(itemValue);
                forceFormUpdate(() => ({ [subName]: '' }));
              }}
              key={itemValue}
            >
              <div className="top-option-left">
                <ICON />
                <span>{label}</span>
              </div>
              {hasSubLevel && (
                <ICArrowRightOutlined className="arrow" size={20} color={theme.colors.icon60} />
              )}
            </button>
          </>
        );
      })}
    </StyledTopSelect>
  );
});
const SubSelect = memo(
  ({
    onBack = () => {},
    onClose = () => {},
    showSearch = true,
    allowClear = true,
    subOptions = [],
    topName,
  }) => {
    const [searchValue, setSearchValue] = useState('');
    const loading = useTransferLoading('queryIsolateTag');
    const { t: _t } = useTranslation('transfer');
    const theme = useTheme();
    const forceFormUpdate = useForceFormFieldChange();
    const topNameValue = useTransferSelector((state) => state[`_${topName}`]);

    const subName = useMemo(
      () =>
        ({
          payAccountType: 'payTag',
          recAccountType: 'recTag',
        }[topName]),
      [topName],
    );

    const subNameValue = useTransferSelector((state) => state[subName]);

    const debouncedSearchValue = useDebounce(searchValue, { wait: 300 });
    const options = useMemo(
      () =>
        subOptions.filter((item) => {
          const optionText = `${item.base?.currencyName || item.base?.currency}/${item.quote
            ?.currencyName || item.quote?.currency}`;
          return optionText.toUpperCase().includes(searchValue.toUpperCase());
        }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [debouncedSearchValue, subOptions],
    );

    const handleSearch = useCallback((e) => {
      setSearchValue(e.target.value);
    }, []);

    const handleSubSelect = useCallback(
      (tag) => {
        forceFormUpdate(() => ({ [subName]: tag, [topName]: topNameValue }));
        onClose();
      },
      [onClose, subName, topName, topNameValue, forceFormUpdate],
    );
    return (
      <Spin spinning={loading} size="small">
        <StyledSubSelect>
          <div className="sub-select-header">
            <div className="sub-select-header-back">
              <ICArrowLeft2Outlined
                onClick={() => {
                  setSearchValue('');
                  onBack();
                }}
                theme={theme.colors.icon60}
                size="18"
              />
            </div>
          </div>
          {showSearch && (
            <Input
              //   disabled={disabled}
              value={searchValue}
              allowClear={allowClear}
              className="search-input"
              prefix={<ICSearch size={20} />}
              size="medium"
              onChange={handleSearch}
              onBlur={(e) => {
                e.preventDefault();
              }}
            />
          )}
          <div className="sub-select-main">
            {options.map((item) => (
              <button
                type="button"
                onClick={handleSubSelect.bind(
                  null,
                  `${item?.base?.currency}-${item?.quote?.currency}`,
                )}
                key={item.label}
                className={clns('sub-option-item', {
                  'actived': subNameValue === item.symbol,
                })}
              >
                <div className="sub-option-item-left">
                  <span className="base-currency">{item?.base?.currencyName}</span>
                  <span className="quote-currency">/{item?.quote?.currencyName}</span>
                </div>
                <div className="sub-option-item-right">
                  <span className="base-currency">{item?.base?.availableBalance}</span>
                  <span className="quote-currency">/{item?.quote?.availableBalance}</span>
                </div>
              </button>
            ))}
            {options.length === 0 && (
              <div className="empty-container">
                <Empty
                  style={{ margin: '42px auto' }}
                  description={_t('k8UQZ4icRzMeE8mypXaMbf')}
                  size="small"
                />
              </div>
            )}
          </div>
        </StyledSubSelect>
      </Spin>
    );
  },
);

const Overlay = memo(
  forwardRef(({ onChange, topOptions, subOptions, value, id, onClose }, ref) => {
    const dispatchTransfer = useTransferDispatch();
    const [level, setLevel] = useState(0);
    const handleTopChange = useCallback(
      (value, type) => {
        if (!type) {
          onChange(value);
          return;
        }
        switch (type) {
          case LEVEL_UP:
            // 如果是二级下拉，比如逐仓，需要先暂存一级，然后再
            dispatchTransfer({
              type: 'update',
              payload: {
                [`_${id}`]: value,
              },
            });
            setLevel((prev) => prev + 1);
            break;
          default:
        }
      },
      [onChange, dispatchTransfer, id],
    );
    const onBack = useCallback(() => {
      setLevel((prev) => prev - 1);
    }, []);
    return (
      <StyledOverlay ref={ref}>
        {level === 0 && (
          <TopSelect
            onChange={handleTopChange}
            topOptions={topOptions}
            value={value}
            topName={id}
          />
        )}
        {level === 1 && (
          <SubSelect subOptions={subOptions} onBack={onBack} onClose={onClose} topName={id} />
        )}
      </StyledOverlay>
    );
  }),
);

function AccountShow(props) {
  const { label, onClick, prefix, suffix, dropDownOpen, type, disabled } = props;
  return (
    <StyledAccountShow
      className={clns('account-input', { dropDownOpen, disabled })}
      onClick={onClick}
      ref={(ref) => {
        registAnimateItem(ref, type);
      }}
    >
      <div className="prefix">{prefix}</div>
      <div className="label">{label}</div>
      <div className="suffix">{suffix}</div>
    </StyledAccountShow>
  );
}

export default function Account(props) {
  const { onChange, value, label, type, ...rest } = props;
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const dropDownRef = useRef();
  const focusFlagRef = useRef(false);
  const theme = useTheme();
  const getConfigByAccount = useGetConfigByAccount();
  // 当批量划转打开时，不能选择账户
  const isBatchEnable = useTransferSelector((state) => state.isBatchEnable);
  // 当划转除了批量只支持下拉一个选择时，不能选择账户
  const supportAccounts = rest.topOptions.filter((o) => o.value !== 'MULTI');
  const disabled = isBatchEnable || supportAccounts.length === 1;

  const PrefixIcon = useMemo(() => getConfigByAccount(value)?.icon, [value, getConfigByAccount]);

  const SuffixIcon = useMemo(() => (dropDownVisible ? ICArrowUpOutlined : ICArrowDownOutlined), [
    dropDownVisible,
  ]);

  const _onChange = useCallback(
    (value) => {
      onChange(value);
      setDropDownVisible(false);
    },
    [onChange],
  );

  // input的focus事件，focus同时展示下拉框
  // const inputHandleFocus = useCallback(() => {
  //   focusFlagRef.current = true;
  //   setDropDownVisible(true);
  // }, []);

  const handleClick = useCallback(() => {
    if (disabled) return;
    setDropDownVisible((prev) => !prev);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setDropDownVisible(false);
  }, []);

  return (
    <>
      <StyledDropdown
        visible={dropDownVisible}
        overlay={
          <ClickAwayListener
            onClickAway={() => {
              if (focusFlagRef.current) {
                focusFlagRef.current = false;
              } else {
                setDropDownVisible(false);
              }
            }}
          >
            <Overlay
              onChange={_onChange}
              ref={dropDownRef}
              value={value}
              onClose={handleClose}
              {...rest}
            />
          </ClickAwayListener>
        }
        popperClassName="account-type-dropdown"
      >
        <AccountShow
          dropDownOpen={dropDownVisible}
          label={label}
          // onFocus={inputHandleFocus}
          onClick={handleClick}
          disabled={disabled}
          // onBlur={inputHandleBlur}
          prefix={PrefixIcon && <PrefixIcon />}
          suffix={<SuffixIcon size={16} color={theme.colors.icon60} />}
          type={type}
        />
      </StyledDropdown>
    </>
  );
}
