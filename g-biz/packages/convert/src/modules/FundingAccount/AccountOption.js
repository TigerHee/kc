/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import { ICHookOutlined } from '@kux/icons';
import NumberFormat from '../../components/common/NumberFormat';
import CoinCurrency from '../../components/common/CoinCurrency';
import CoinPrecision from '../../components/common/CoinPrecision';
import CoinCodeToName from '../../components/common/CoinCodeToName';
import { isFinite } from '../../utils/format';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  overflow: hidden;
`;

const ICHookOutlinedPro = styled(ICHookOutlined)`
  color: ${({ theme }) => theme.colors.primary};
`;

const Value = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  margin-top: 4px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text40};
`;

const AccountOption = ({ label, coin, value, selected, ...otherProps }) => {
  return (
    <Container {...otherProps}>
      <div>
        <Label>{label}</Label>
        <Value>
          {isFinite(value) ? (
            <NumberFormat>
              <CoinPrecision coin={coin} value={value} />
            </NumberFormat>
          ) : (
            '--'
          )}{' '}
          <CoinCodeToName coin={coin} />
          <CoinCurrency coin={coin} value={value} style={{ marginLeft: 3 }} />
        </Value>
      </div>
      {Boolean(selected) && <ICHookOutlinedPro size={16} className="horizontal-flip-in-arabic" />}
    </Container>
  );
};

export default React.memo(AccountOption);
