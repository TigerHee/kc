/**
 * Owner: john.zhang@kupotech.com
 */

import { styled } from '@kux/mui';
import CoinIcon from 'src/components/common/CoinIcon';

const CoinBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  line-height: 140%;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
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
