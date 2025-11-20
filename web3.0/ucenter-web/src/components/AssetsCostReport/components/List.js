import { ICEdit2Outlined } from '@kux/icons';
import { Box, Button, Spin, styled } from '@kux/mui';
import moment from 'moment';
import { _t } from 'src/tools/i18n';
import AmountText from './AmountText';
import CoinDisplay from './CoinDisplay';
import FreeTaxText from './FreeTaxText';
import TableEmptyRetry from './TableEmptyRetry';

const StyledSpin = styled(Spin)`
  width: 100%;
`;
const Container = styled.div``;

const Item = styled.div`
  display: flex;
  padding: 16px 0;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider4};
  border-radius: 12px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ItemContent = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ItemLabel = styled.span`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
`;
const ItemValue = styled.span`
  color: ${({ theme, filled }) => (filled ? theme.colors.text : theme.colors.text40)};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%; /* 22.4px */
`;

const ExButton = styled(Button)`
  font-size: 12px;
  font-weight: 600;
  line-height: 140%;
`;

export default function List({ dataSource, loading = false, onDeclare, onRetry }) {
  return (
    <StyledSpin spinning={loading}>
      <Container>
        {dataSource.length ? (
          dataSource.map((item) => {
            const {
              currency,
              totalAmount,
              needTax,
              assetAcquireStartTime,
              assetAcquireEndTime,
              totalCost,
            } = item;
            const filled = typeof needTax === 'boolean';
            return (
              <Item key={currency}>
                <ItemHeader>
                  <CoinDisplay currency={currency} />
                  <AmountText value={totalAmount} />
                </ItemHeader>
                <ItemContent>
                  <ItemRow>
                    <ItemLabel>{_t('3809ca3e30374800aba8')}</ItemLabel>
                    <ItemValue filled={filled}>
                      {!filled ? (
                        <span>{_t('58259d56a0d34800ac8d')}</span>
                      ) : needTax ? (
                        <span>
                          {/* todo: 为啥不用 dayjs? */}
                          {moment(assetAcquireStartTime).format('DD/MM/YYYY')}
                          &nbsp;-&nbsp;
                          {moment(assetAcquireEndTime).format('DD/MM/YYYY')}
                        </span>
                      ) : (
                        <span>{_t('d851de8d5a4d4000a0cc')}</span>
                      )}
                    </ItemValue>
                  </ItemRow>
                  <ItemRow>
                    <ItemLabel>{_t('b0db864d2ab94800acbf')}</ItemLabel>
                    <ItemValue filled={filled}>
                      {!filled ? (
                        <span>{_t('58259d56a0d34800ac8d')}</span>
                      ) : needTax ? (
                        <AmountText value={totalCost} />
                      ) : (
                        <FreeTaxText />
                      )}
                    </ItemValue>
                  </ItemRow>
                </ItemContent>
                <ExButton type="default" size="small" fullWidth onClick={() => onDeclare(item)}>
                  <ICEdit2Outlined size={16} />
                  <Box size={4} />
                  {filled ? (
                    <span>{_t('41836045b4b94800a333')}</span>
                  ) : (
                    <span>{_t('6d22ffc9eb0f4800a90c')}</span>
                  )}
                </ExButton>
              </Item>
            );
          })
        ) : (
          <TableEmptyRetry onRetry={onRetry} />
        )}
      </Container>
    </StyledSpin>
  );
}
