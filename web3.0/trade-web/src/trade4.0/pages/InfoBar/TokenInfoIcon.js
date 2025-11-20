/**
 * Owner: brick.fan@kupotech.com
 */
import React, { useState, memo } from 'react';
import { useDispatch } from 'dva';
import Dropdown from '@/components/mui/Dropdown';
import { styled } from '@/style/emotion';
import { getCurrentSymbol } from '@/hooks/common/useSymbol';
import { getTradeType } from '@/hooks/common/useTradeType';
import { ICInfoContainOutlined } from '@kux/icons';
import useSensorFunc from '@/hooks/useSensorFunc';
import TokenInfo from '../TokenInfo/index';
import { FUTURES } from '../../meta/const';
import { addLangToPath } from 'src/utils/lang';

const DropdownContentBox = styled.div`
  width: 400px;
  ${(props) => (props.isMarginFund ? 'max-height: 526px;' : '')}
  overflow-y: auto;
  border-radius: 12px;
  /* margin-top: 20px; */
  background-color: ${(props) => props.theme.colors.layer};
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
`;

const ICInfoContainOutlinedBox = styled(ICInfoContainOutlined)`
  margin-right: 18px;
  color: ${(props) => props.theme.colors.icon60};
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.icon};
  }
`;

const TokenInfoIcon = ({ symbol, type, resetOverLayTop }) => {
  const [visible, setVisible] = useState(false);
  const sensorFunc = useSensorFunc();

  const handleClick = (e) => {
    const tradeType = getTradeType();
    const currentSymbol = getCurrentSymbol();
    if (tradeType === FUTURES) {
      e.preventDefault();
      e.stopPropagation();
      setVisible(false);
      window.open(addLangToPath(`/futures/contract/detail/${currentSymbol}`), '_blank');
    } else {
      resetOverLayTop();
      sensorFunc(['tokenInformation', 'tokenInfo', 'click']);
      setVisible(true);
    }
  };

  const isMarginFund = type === 'MARGIN_FUND';
  return (
    <Dropdown
      visible={visible}
      onVisibleChange={setVisible}
      overlay={
        <DropdownContentBox isMarginFund={isMarginFund}>
          <TokenInfo symbol={symbol} type={type} />
        </DropdownContentBox>
      }
    >
      <ICInfoContainOutlinedBox size={16} onClick={handleClick} />
    </Dropdown>
  );
};

export default memo(TokenInfoIcon);
