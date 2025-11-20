/**
 * Owner: john.zhang@kupotech.com
 */

import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import { ReactComponent as GetRecordsError } from 'static/svg_icons/get-records-error.svg';
import AmountText from '../AssetsTax/components/AmountText';
import { AssetsFormItem, useAssetsTaxForm } from '../AssetsTax/components/AssetsForm';
import CoinDisplay from '../AssetsTax/components/CoinDisplay';
import TableEmptyRetry from '../AssetsTax/components/TableEmptyRetry';
import TaxSelect from '../AssetsTax/components/TaxSelect';
import TaxUnitCost from '../AssetsTax/components/TaxUnitCost';
import TotalTaxText from '../AssetsTax/components/TotalTaxCost';
import { getBeforeTaxFreeDateKey, getUnitCostKey, unitCostVilidator } from '../AssetsTax/utils';
import { TableRightColumn } from './CommonTable';

const CardBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider4};
  background: ${({ theme }) => theme.colors.cover2};
  padding: 18px 16px;
  gap: 16px;
`;

const ColumnItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 140%;
`;

const ColumnLabel = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text40};
`;

const ColumnValue = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text40};
  justify-content: flex-end;
`;

const CardListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const EmptyPlaceholderBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
`;
const GetRecordsErrorIcon = styled(GetRecordsError)`
  width: 112px;
  width: 136px;
`;

const H5AssetsCardList = ({ list = [], assetsForm, handleRetry }) => {
  const { formData, refresh, formCheck } = useAssetsTaxForm(assetsForm);

  return (
    <CardListContainer>
      {list?.length === undefined && (
        <EmptyPlaceholderBox>
          <GetRecordsErrorIcon />
          <TableEmptyRetry onRetry={handleRetry} />
        </EmptyPlaceholderBox>
      )}
      {list?.map((data, index) => (
        <CardItem
          key={data?.key || index}
          data={data}
          formCheck={formCheck}
          refresh={refresh}
          formData={formData}
        />
      ))}
    </CardListContainer>
  );
};

const CardItem = ({ data, refresh, formCheck, formData = {} }) => {
  if (!data) {
    return null;
  }

  const { currency, totalAmount } = data || {};

  // 未选择 "购买日期" 字段时，显示 label
  const needTax = data.needTax;

  return (
    <CardBox>
      {/* header: 币种+数量 */}
      <ColumnItem>
        <CoinDisplay currency={currency} />
        <TableRightColumn>
          <AmountText value={totalAmount} />
        </TableRightColumn>
      </ColumnItem>
      {/* header: 购买日期 */}
      <ColumnItem>
        <AssetsFormItem
          name={getBeforeTaxFreeDateKey(data)}
          rules={[{ required: true, message: _t('24805280f9324800a76c') }]}
        >
          <TaxSelect
            defaultValue={data?.needTax ?? null}
            onChange={() => {
              refresh();
              const beforeKey = getBeforeTaxFreeDateKey(data);
              const beforeValue = formData[beforeKey];
              const unitKey = getUnitCostKey(data);
              const unitValue = formData[unitKey];

              // 交互优化，当unitValue为空时不检查
              if (beforeValue && (unitValue === undefined || unitValue === null)) {
                return;
              }
              // 重新检查当前数据的 单位成本
              formCheck([unitKey]);
            }}
          />
        </AssetsFormItem>
      </ColumnItem>
      {/* header: 单位成本(EUR) */}
      {typeof needTax !== 'boolean' ? (
        <ColumnItem>
          <ColumnLabel>{_t('362b795e4a024000a191')}</ColumnLabel>
          <TableRightColumn>
            <ColumnValue>--</ColumnValue>
          </TableRightColumn>
        </ColumnItem>
      ) : (
        <ColumnItem>
          <AssetsFormItem
            name={getUnitCostKey(data)}
            rules={[
              {
                validator: (rule, value, callback) =>
                  unitCostVilidator(value, data, formData, callback),
              },
            ]}
          >
            <TaxUnitCost
              defaultValue={data.unitCost}
              formData={formData}
              record={data}
              onChange={refresh}
            />
          </AssetsFormItem>
        </ColumnItem>
      )}
      {/* header: 总成本(EUR) */}
      <ColumnItem>
        <ColumnLabel>{_t('b0db864d2ab94800acbf')}</ColumnLabel>
        <TableRightColumn>
          <TotalTaxText formData={formData} record={data} />
        </TableRightColumn>
      </ColumnItem>
    </CardBox>
  );
};

export default H5AssetsCardList;
