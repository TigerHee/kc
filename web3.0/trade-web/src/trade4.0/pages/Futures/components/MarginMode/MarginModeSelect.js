/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';

import clsx from 'clsx';
// import { forEach } from 'lodash';

import { trackClick, gaExpose } from 'src/utils/ga';

import { ICQuestionOutlined } from '@kux/icons';

import DSelect from '@/components/DropdownSelect';
import dropStyle from '@/components/DropdownSelect/style';
import SymbolText from '@/components/SymbolText';
import { MARGIN_MODE_MODULE, FUTURES_MARGIN_MODE_EXPOSE } from '@/meta/futuresSensors/trade';

import { _t, styled, useLoginDrawer } from '@/pages/Futures/import';

import { SELECT_OPTIONS } from './config';
import {
  useMarginMode,
  useMarginModeSelectProps,
  useMarginModeExplainDialogProps,
  useMarginModeDialogProps,
  useSupportMarginMode,
  // useCanChangeMarginMode,
} from './hooks';

const MarginModeBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text};
  .can-operator {
    cursor: pointer;
  }
`;

const HelpIcon = styled(ICQuestionOutlined)`
  margin-right: 4px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.icon60};
  &:hover {
    color: ${(props) => props.theme.colors.icon};
  }
`;

const Select = styled(DSelect)`
  .KuxDropDown-trigger {
    margin-right: ${(props) => (props.type === 'normal' ? 'unset' : '12px')};
  }
  .dropdown-value {
    padding: 0 2px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text};
  }
`;

const DropdownExtend = {
  List: styled(dropStyle.List)`
    .dropdown-item {
      font-size: 14px;
      display: flex;
      align-items: center;
    }
    .select-footer {
      &:hover,
      &:active {
        background: ${(props) => props.theme.colors.cover8};
      }
    }
  `,
};

const SymbolTextCls = styled(SymbolText)`
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
`;

const ModeSetting = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text};
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
  padding-top: 11px;
  cursor: pointer;
`;

const MarginModeSelect = ({ symbol, type = 'normal', className = '' }) => {
  // const [selectOptions, setSelectOptions] = useState(SELECT_OPTIONS);
  const { getMarginModeForSymbol } = useMarginMode();
  const { onMarginModeChange } = useMarginModeSelectProps();
  const { onExplainDialogChange } = useMarginModeExplainDialogProps();
  const { onMarginModeDialogChange } = useMarginModeDialogProps();
  const { getSupportMarginModeForSymbol } = useSupportMarginMode();
  // const { getCanChangeMarginModeForSymbol, getHasOrders } = useCanChangeMarginMode();
  const { open, isLogin } = useLoginDrawer();

  const supportMarginMode = getSupportMarginModeForSymbol(symbol);
  const currentMode = getMarginModeForSymbol(symbol);

  const handleSelectChange = useCallback(
    (v) => {
      if (!isLogin) {
        open();
        return;
      }
      onMarginModeChange(v, symbol);
    },
    [isLogin, onMarginModeChange, open, symbol],
  );

  const handleOpenExplainDialog = useCallback(() => {
    onExplainDialogChange(true);
    // 埋点
    trackClick([MARGIN_MODE_MODULE, '1']);
  }, [onExplainDialogChange]);

  const handleOpenModeDialog = useCallback(() => {
    onMarginModeDialogChange(true);
    trackClick([MARGIN_MODE_MODULE, '4']);
  }, [onMarginModeDialogChange]);

  useEffect(() => {
    // 增加曝光
    if (isLogin) {
      gaExpose(FUTURES_MARGIN_MODE_EXPOSE, {
        marginMode: currentMode,
        symbol,
      });
    }
  }, [currentMode, isLogin, symbol]);

  // 每次打开都需要判断一次能不能切换
  // const handleUpdateSelect = useCallback(() => {
  //   const options = SELECT_OPTIONS;

  //   forEach(options, (item) => {
  //     item.disabled = !getCanChangeMarginModeForSymbol(symbol, getHasOrders());
  //   });

  //   setSelectOptions(options);
  // }, [getCanChangeMarginModeForSymbol, getHasOrders, symbol]);

  return (
    <MarginModeBox className={clsx(className, { 'can-operator': supportMarginMode })}>
      {supportMarginMode ? (
        <>
          <HelpIcon onClick={handleOpenExplainDialog} />
          <Select
            size="small"
            value={currentMode}
            configs={SELECT_OPTIONS}
            onChange={handleSelectChange}
            // disablePortal={false}
            type={type}
            extendStyle={DropdownExtend}
            // showSelectCallback={handleUpdateSelect}
            overlayProps={{
              header: <SymbolTextCls symbol={symbol} />,
              footer: (
                <ModeSetting onClick={handleOpenModeDialog}>
                  {_t('futures.mode.setting')}
                </ModeSetting>
              ),
            }}
          />
        </>
      ) : (
        <span>{_t('futures.isolated')}</span>
      )}
    </MarginModeBox>
  );
};

export default React.memo(MarginModeSelect);
