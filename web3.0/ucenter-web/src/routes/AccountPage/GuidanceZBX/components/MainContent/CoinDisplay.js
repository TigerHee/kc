/**
 * Owner: john.zhang@kupotech.com
 */

import { styled } from '@kux/mui';
import CoinIcon from 'src/components/common/CoinIcon';

const CoinBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  font-weight: 500;
`;
const StyledCoinIcon = styled(CoinIcon)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-weight: 500;
`;

const CoinDisplay = ({ currency }) => {
  return (
    <CoinBox>
      {currency && <StyledCoinIcon coin={currency} persist />}
      {currency}
    </CoinBox>
  );
};

export default CoinDisplay;
