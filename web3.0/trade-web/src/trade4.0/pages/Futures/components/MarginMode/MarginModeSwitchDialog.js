/**
 * Owner: garuda@kupotech.com
 */
import React, { memo, useCallback, useEffect, useMemo } from 'react';

import { useMediaQuery, useTheme } from '@kux/mui/hooks';
import { map } from 'lodash';

import { gaExpose as trackExposeS, trackClick } from 'utils/ga';

import { ICCloseFilled, ICSearchOutlined } from '@kux/icons';
import { Checkbox as KuxCheckbox } from '@kux/mui';

import Button from '@mui/Button';
import AdaptiveModal from '@mui/Dialog';
import KuxEmpty from '@mui/Empty';
import KuxInput from '@mui/Input';

import SymbolText from '@/components/SymbolText';
import TooltipWrapper from '@/components/TooltipWrapper';

import { MARGIN_MODE_CROSS, MARGIN_MODE_ISOLATED } from '@/meta/futures';
import {
  FUTURES_MARGIN_MODE_CHANGE,
  FUTURES_MARGIN_MODE_MULTI_EXPOSE,
  FUTURES_MARGIN_MODE_SEARCH,
  FUTURES_MARGIN_MODE_SELECT,
  FUTURES_MARGIN_MODE_SELECT_ALL,
  SENSORS_MARGIN_TYPE,
} from '@/meta/futuresSensors/trade';

import { styled, _t } from '@/pages/Futures/import';

import { MARGIN_MODE_LABEL } from './config';
import {
  useMarginModeDialogProps,
  // useMarginMode,
  // useCanChangeMarginMode,
  useMarginModeSelectProps,
} from './hooks';

const Dialog = styled(AdaptiveModal)`
  .KuxDialog-body {
    max-width: 520px;
  }
  .KuxDialog-content {
    padding: 0;
  }
  .mobile-drawer-content {
    padding: 16px 0;
  }
  .KuxCheckbox-wrapper {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    > span {
      margin: 0;
    }
    .KuxCheckbox-checkbox {
      top: 0;
      margin-left: 4px;
    }
    .KuxCheckbox-inner {
      border: 2px solid ${(props) => props.theme.colors.icon40};
    }
    &.KuxCheckbox-wrapper-checked {
      .KuxCheckbox-inner {
        border: 2px solid ${(props) => props.theme.colors.primary};
      }
    }
  }
  .KuxMDialog-content {
    padding: 16px 0 0;
  }
`;

const InputWrapper = styled.div`
  padding: ${(props) => (props.isMobile ? '0 16px' : '0 32px')};
  .close {
    cursor: pointer;
  }
`;

const Input = styled(KuxInput)``;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${(props) => (props.isMobile ? '0 0 16px' : '0  0 18px')};
  font-size: 14px;
  line-height: 1.3;
  user-select: none;
  .total-box {
    display: flex;
    align-items: center;

    .label {
      color: ${(props) => props.theme.colors.text40};
    }

    .amount {
      margin-left: 4px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
    }
  }
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 312px;
  max-height: 312px;
  padding: ${(props) => (props.isMobile ? '0 16px' : '0 32px')};
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }
`;

const TableItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 12px 0;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  > span {
    display: flex;
    justify-content: space-between;
    width: 100%;
    user-select: none;
  }
`;

const Empty = styled(KuxEmpty)`
  text-align: center;
`;

const Checkbox = styled(KuxCheckbox)`
  .KuxCheckbox-inner,
  .KuxCheckbox-input {
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  }
  &.select-all {
    font-weight: 500;
  }
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.isMobile ? '10px 16px 16px' : '10px 32px 20px')};
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
  .tip {
    margin: 0 8px 0 0;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 500;
    font-size: 14px;
    line-height: 1.3;
  }
  button {
    margin-left: 16px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-left: 8px;
    }
  }
  .footer-button {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;

const SymbolTextCls = styled(SymbolText)`
  max-width: calc(100% - 80px);
  > div,
  .currencyText {
    color: ${(props) => (props.disabled ? props.theme.colors.text30 : props.theme.colors.text)};
    font-weight: 500;
  }
`;

const noop = () => {};
const TableItem = memo(({ symbol, disabled, type, checked = false, onChange = noop }) => {
  const handleItemClick = useCallback(() => {
    if (disabled) return;
    onChange(!checked, symbol);
    // 埋点
    trackClick([FUTURES_MARGIN_MODE_SELECT, '2'], {
      selectType: !checked ? 'select' : 'cancel',
      symbol,
      select: !checked ? 1 : 2,
    });
  }, [checked, disabled, onChange, symbol]);

  const Content = useMemo(() => {
    return (
      <>
        <SymbolTextCls disabled={disabled} symbol={symbol} />
        <Checkbox disabled={disabled} checked={!disabled && checked}>
          {MARGIN_MODE_LABEL[type]}
        </Checkbox>
      </>
    );
  }, [checked, disabled, symbol, type]);

  return (
    <TableItems disabled={disabled} onClick={handleItemClick}>
      {disabled ? (
        <TooltipWrapper title={_t('futures.notChange.marginMode.tips')}>{Content}</TooltipWrapper>
      ) : (
        Content
      )}
    </TableItems>
  );
});

const MarginModeSwitchDialog = () => {
  const theme = useTheme();

  const {
    modeDialogVisible,
    onMarginModeDialogChange,
    search,
    selects,
    handleClearSearch,
    handleClearSelect,
    handleSetSearch,
    isSelectAll,
    handleChangeSelectAll,
    handleSetSelect,
    marginModes,
    getSwitchMarginModeList,
  } = useMarginModeDialogProps();

  // const { getMarginModeForSymbol } = useMarginMode();
  // const { getCanChangeMarginModeForSymbol } = useCanChangeMarginMode();
  const { onMarginModeChange } = useMarginModeSelectProps();
  // const {
  //   onMarginModeDialogChange: onMarginModeMobileDialogChange,
  // } = useMarginModeMobileDialogProps();
  const isMobile = useMediaQuery((media) => media.breakpoints.down('sm'));

  const handleCloseDialog = useCallback(() => {
    onMarginModeDialogChange(false);
  }, [onMarginModeDialogChange]);

  // const handleOpenSetMode = useCallback(() => {
  //   onMarginModeMobileDialogChange(true);
  // }, [onMarginModeMobileDialogChange]);

  const handleSetMarginCross = useCallback(() => {
    onMarginModeChange(MARGIN_MODE_CROSS, selects);
    // 埋点
    trackClick([FUTURES_MARGIN_MODE_CHANGE, '5'], {
      marginType: SENSORS_MARGIN_TYPE[MARGIN_MODE_CROSS],
      changemode: 2,
    });
  }, [onMarginModeChange, selects]);

  const handleSetMarginIsolated = useCallback(() => {
    onMarginModeChange(MARGIN_MODE_ISOLATED, selects);
    // 埋点
    trackClick([FUTURES_MARGIN_MODE_CHANGE, '5'], {
      marginType: SENSORS_MARGIN_TYPE[MARGIN_MODE_ISOLATED],
      changemode: 1,
    });
  }, [onMarginModeChange, selects]);

  const handleSearch = useCallback(() => {
    // 埋点
    trackClick([FUTURES_MARGIN_MODE_SEARCH, '4']);
  }, []);

  const handleSelectAll = useCallback(
    (e) => {
      const value = e?.target?.checked;
      handleChangeSelectAll(value);
      // 埋点
      trackClick([FUTURES_MARGIN_MODE_SELECT_ALL, '3'], {
        select_all: value ? 1 : 2,
        selectall: value ? 1 : 2,
      });
    },
    [handleChangeSelectAll],
  );

  // 弹框关闭，清空选中值
  useEffect(() => {
    if (modeDialogVisible) {
      getSwitchMarginModeList();
      // 增加曝光埋点
      trackExposeS(FUTURES_MARGIN_MODE_MULTI_EXPOSE);
      return () => {
        handleClearSearch();
        handleClearSelect();
      };
    }
  }, [getSwitchMarginModeList, handleClearSearch, handleClearSelect, modeDialogVisible]);

  return (
    <>
      <Dialog
        open={modeDialogVisible}
        disableBackdropClick
        onClose={handleCloseDialog}
        okText={null}
        cancelText={null}
        footer={null}
        title={_t('futures.marginMode.title')}
        destroyOnClose
      >
        <InputWrapper isMobile={isMobile}>
          <Input
            value={search}
            onChange={handleSetSearch}
            onClick={handleSearch}
            addonBefore={
              <ICSearchOutlined
                color={theme.colors.icon60}
                placeholder={_t('contract.list.search.placeholder')}
              />
            }
            addonAfter={
              search ? (
                <ICCloseFilled className="close" size={14} onClick={handleClearSearch} />
              ) : null
            }
          />
        </InputWrapper>
        <TableWrapper isMobile={isMobile}>
          {marginModes?.length ? (
            map(marginModes, ({ symbol, switchable, marginMode }) => (
              <TableItem
                key={symbol}
                disabled={!switchable}
                symbol={symbol}
                type={marginMode}
                checked={selects?.includes(symbol)}
                onChange={handleSetSelect}
              />
            ))
          ) : (
            <Empty />
          )}
        </TableWrapper>

        <FooterWrapper isMobile={isMobile}>
          <TableHeader isMobile={isMobile}>
            <div className="total-box">
              <span className="label">{_t('futures.total')}</span>
              <span className="amount">{selects.length}</span>
            </div>
            <Checkbox
              className="select-all"
              checked={isSelectAll}
              disabled={!marginModes?.length}
              onChange={handleSelectAll}
            >
              {_t('futures.select.all')}
            </Checkbox>
          </TableHeader>
          <div className="footer-button">
            <span className="tip">{_t('futures.setAs')}</span>
            <Button
              disabled={!selects.length}
              type="primary"
              variant="contained"
              onClick={handleSetMarginCross}
            >
              {_t('futures.cross')}
            </Button>
            <Button
              disabled={!selects.length}
              type="primary"
              variant="contained"
              onClick={handleSetMarginIsolated}
            >
              {_t('futures.isolated')}
            </Button>
          </div>
        </FooterWrapper>
      </Dialog>
      {/* <MarginModeMSwitchDialog
        handleSetMarginCross={handleSetMarginCross}
        handleSetMarginIsolated={handleSetMarginIsolated}
      /> */}
    </>
  );
};

export default React.memo(MarginModeSwitchDialog);
