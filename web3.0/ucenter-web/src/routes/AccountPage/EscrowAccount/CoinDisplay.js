/**
 * Owner: john.zhang@kupotech.com
 */

import { styled } from '@kux/mui';
import CoinIcon from 'src/components/common/CoinIcon';
import { useSelector } from 'src/hooks/useSelector';

const CoinBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 100px;
`;

const StyledCoinIcon = styled(CoinIcon)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const CoinTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2;
`;
const CoinTitle = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text};
`;
const CoinFullName = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text40};
`;

const CoinDisplay = ({ currency }) => {
  const categories = useSelector((state) => state.categories);
  const coin = categories[currency];

  return currency ? (
    <CoinBox>
      <StyledCoinIcon coin={currency} persist />
      <CoinTextBox>
        <CoinTitle>{currency}</CoinTitle>
        {coin?.name ? <CoinFullName>{coin.name}</CoinFullName> : null}
      </CoinTextBox>
    </CoinBox>
  ) : null;
};

export default CoinDisplay;
