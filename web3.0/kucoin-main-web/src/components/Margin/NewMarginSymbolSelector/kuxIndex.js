/**
 * Owner: melonr@kupotech.com
 */

/** 2024.06.26 资产页-黑白主题适配 */
import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { Spin, Select } from '@kux/mui';
import { styled } from '@kux/mui';
import { ConfirmOutlined, TriangleDownOutlined } from '@kux/icons';
import PropTypes from 'prop-types';

import { _t } from 'tools/i18n';

import { useLocale } from '@kucoin-base/i18n';

import NewDraw from '../NewDraw';

// 交易对抽屉 start

const DrawerWrapper = styled.div`
  width: 100%;
`;

const DrawerSymbolDisplay = styled.div`
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0.5px solid rgba(0, 13, 29, 0.16);
  border-radius: 4px;
  padding: 12px;
`;

const DrawerSymbolDisplayText = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
`;

const DrawerSymbolIcon = styled(TriangleDownOutlined)`
  color: ${({ theme }) => theme.colors.text60};
`;

const DrawerSymbolList = styled.ul`
  margin: 12px 0;
  max-height: 320px;
  overflow-y: scroll;
  .new-active-symbol {
    background: ${({ theme }) => theme.colors.cover4};
  }
`;

const DrawerSymbolItem = styled.li`
  padding: 16px;
  width: 100%;
  background: ${({ theme }) => theme.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DrawerSymbolName = styled.div``;

const DrawerSymbolCheckedIcon = styled(ConfirmOutlined)`
  color: ${({ theme }) => theme.colors.primary};
`;

const EmptyContent = styled.div`
  display: flex;
  max-width: 120px;
  padding: 10px;
  font-size: 12px;
  line-height: 130%;
  word-break: break-word;
`;
// 交易对抽屉 end

const NewRoot = styled.div`
  position: relative;
  font-size: 0px;
  .spin {
    position: absolute;
    top: 50%;
    right: 12px;
    background: rgba(0, 20, 42, 0.04);
    transform: translate3d(0, -50%, 0);
  }
  .hideSpan {
    visibility: hidden;
  }
  .container {
    svg {
      display: none;
    }
  }
`;

const ALL = 'all';

const MarginSymbolSelector = memo((props) => {
  useLocale();
  const {
    loading,
    needAll,
    disabled,
    onChange,
    placeholder = '',
    isolatedSymbolsMap,
    disableClearable = true,
    value: valueFromProps,
    symbols,
    isDrawer,
    ...restProps
  } = props;
  const [value, setValue] = useState(() => valueFromProps);
  const [showDraw, setShowDraw] = useState(false); // 是否展示抽屉

  useEffect(() => {
    if (!valueFromProps && needAll) {
      setValue('');
    } else if (!valueFromProps) {
      setValue(undefined);
    } else {
      setValue(valueFromProps);
    }
  }, [valueFromProps, needAll]);

  const getOptions = (symbols) => {
    const allSymbols = needAll ? [{ symbol: '', symbolName: _t(ALL) }, ...symbols] : symbols;
    let options = [];
    options = allSymbols.map((item) => {
      return {
        value: item.symbol,
        label: item.symbolName,
        title: item.symbolName,
      };
    });
    return options;
  };

  // 交易对选项
  const symbolOptions = useMemo(() => getOptions(symbols), [symbols]);

  // 关闭交易对抽屉
  const onCloseDraw = () => {
    setShowDraw(false);
  };

  // 点击抽屉交易对
  const onClickDrawerSymbolItem = useCallback(
    (val) => {
      if (onChange && typeof onChange === 'function') {
        onChange(val);
      }
      onCloseDraw();
    },
    [onChange],
  );

  if (isDrawer) {
    return (
      <DrawerWrapper>
        <DrawerSymbolDisplay onClick={() => setShowDraw(true)}>
          <DrawerSymbolDisplayText>{value}</DrawerSymbolDisplayText>
          <DrawerSymbolIcon />
        </DrawerSymbolDisplay>
        <NewDraw
          anchor="bottom"
          show={showDraw}
          onClose={onCloseDraw}
          title={'Coin'}
          {...restProps}
        >
          <DrawerSymbolList>
            {symbolOptions.map((i) => (
              <DrawerSymbolItem
                className={value === i.value ? 'new-active-symbol' : ''}
                key={i.value}
                onClick={() => onClickDrawerSymbolItem(i.value)}
              >
                <DrawerSymbolName>{i.label || i.title}</DrawerSymbolName>
                {value === i.value ? <DrawerSymbolCheckedIcon size={18} /> : null}
              </DrawerSymbolItem>
            ))}
          </DrawerSymbolList>
        </NewDraw>
      </DrawerWrapper>
    );
  }

  return (
    <NewRoot>
      <div className={loading ? 'spin' : 'hideSpan'}>
        <Spin size="small" spinning={loading} />
      </div>
      <Select
        value={value}
        options={symbolOptions}
        disabled={loading || disabled}
        onChange={(v) => {
          if (onChange) {
            onChange(v);
          }
        }}
        allowClear={disableClearable}
        allowSearch={true}
        {...restProps}
        emptyContent={<EmptyContent>{_t('6upHgrUnAQ3hi7FbyMbTWc')}</EmptyContent>}
      />
    </NewRoot>
  );
});

MarginSymbolSelector.propTypes = {
  isDrawer: PropTypes.bool, // 是否是抽屉类型
  loading: PropTypes.bool, // 是否加载中
  needAll: PropTypes.bool, // 是否需要全部的数据
  disabled: PropTypes.bool, // 是否不可用
  onChange: PropTypes.func.isRequired, // 修改时的回调
  type: PropTypes.string, // 类型
  value: PropTypes.any, // 选中的值
};

MarginSymbolSelector.defaultProps = {
  isDrawer: false,
  loading: false,
  disabled: false,
  type: 'BORROW',
  value: undefined,
};
export default connect((state, prop) => {
  const { isolatedSymbols, isolatedSymbolsMap } = state.market;
  const { positionTags } = state.marginBorrow;
  const symbols = prop.symbols || (prop.type === 'BORROW' ? positionTags : isolatedSymbols);
  return { symbols, isolatedSymbolsMap };
})(MarginSymbolSelector);
