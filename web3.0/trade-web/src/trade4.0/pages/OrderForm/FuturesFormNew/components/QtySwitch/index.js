/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';
import { useDispatch } from 'react-redux';

import QtyModal from './QtyModal';

import { storagePrefix, styled, storage } from '../../builtinCommon';

import { useGetSymbolInfo } from '../../hooks/useGetData';
import useGetUSDsUnit from '../../hooks/useGetUSDsUnit';
import { tradeOrderQtySensors } from '../../utils';
import TriangleIconWrapper from '../TriangleIconWrapper';

const SwitchWrapper = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text60};
`;

const UnitWrapper = styled.div`
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  margin-left: 2px;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled(TriangleIconWrapper)`
  color: ${(props) => props.theme.colors.icon};
`;

const QtySwitch = ({ className, showBrackets = true }) => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const { symbolInfo: contract } = useGetSymbolInfo();
  const { unit, tradingUnit, chooseUSDsUnit } = useGetUSDsUnit();

  const handleClick = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('test click --->', e);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (key) => {
    dispatch({
      type: 'futuresForm/setUserBasicConfig',
      payload: { tradingUnit: key },
    });
    dispatch({
      type: 'futuresForm/update',
      payload: { chooseUSDsUnit: false },
    });
    storage.setItem('chooseUSDsUnit', false, storagePrefix);
    handleClose();
    tradeOrderQtySensors({ unit: key });
  };

  // 选择按usds下单的时候，触发事件
  const handleUsdsUnitSelect = () => {
    dispatch({
      type: 'futuresForm/update',
      payload: { chooseUSDsUnit: true },
    });
    storage.setItem('chooseUSDsUnit', true, storagePrefix);
    handleClose();
    tradeOrderQtySensors({ unit: 'usds' });
  };

  const okEvent = (value) => {
    if (value === contract.quoteCurrency) {
      handleUsdsUnitSelect();
    } else {
      handleSelect(value);
    }
  };

  if (contract.isInverse) {
    return null;
  }

  return (
    <SwitchWrapper className={className}>
      <UnitWrapper onClick={handleClick}>
        {showBrackets ? `(${unit || '--'})` : unit || '--'}
        <IconWrapper active={!!anchorEl} />
      </UnitWrapper>
      <QtyModal
        quoteCurrency={contract.quoteCurrency}
        baseCurrency={contract.baseCurrency}
        multiplier={contract.multiplier}
        open={!!anchorEl}
        onClose={handleClose}
        tradingUnit={tradingUnit}
        chooseUSDsUnit={chooseUSDsUnit}
        onOk={okEvent}
      />
    </SwitchWrapper>
  );
};

export default React.memo(QtySwitch);
