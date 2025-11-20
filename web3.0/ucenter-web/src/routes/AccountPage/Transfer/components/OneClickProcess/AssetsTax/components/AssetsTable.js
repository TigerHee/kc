/**
 * Owner: john.zhang@kupotech.com
 */

import { styled } from '@kux/mui';
import { useMemo } from 'react';
import { _t } from 'src/tools/i18n';
import CommonTable, { TableRightColumn } from '../../components/CommonTable';
import { getBeforeTaxFreeDateKey, getUnitCostKey, unitCostVilidator } from '../utils';
import AmountText from './AmountText';
import { AssetsFormItem, useAssetsTaxForm } from './AssetsForm';
import CoinDisplay from './CoinDisplay';
import TableEmptyRetry from './TableEmptyRetry';
import TaxSelect from './TaxSelect';
import TaxUnitCost from './TaxUnitCost';
import TotalTaxText from './TotalTaxCost';

const BaseColumnTitle = styled.div`
  min-width: 100px;
`;

const StyledCommonTable = styled(CommonTable)`
  max-width: 1184px;
  tbody tr {
    vertical-align: top;
    td > div:first-of-type {
      display: flex;
      align-items: center;
      min-height: 48px;
      line-height: 48px;
    }
  }
`;

const AssetsTable = ({ assetsForm, list, handleRetry }) => {
  const { formData, refresh, formCheck } = useAssetsTaxForm(assetsForm);

  const columns = useMemo(
    () => [
      {
        // 币种
        title: _t('qCtpCMRwSpHG73GhHUkTF8'),
        dataIndex: 'currency',
        width: 100,
        render: (text) => <CoinDisplay currency={text} />,
      },
      {
        // 数量
        title: _t('qN61LLGpxv8GMe2HcBQg1j'),
        dataIndex: 'totalAmount',
        render: (text) => <AmountText value={text} />,
        width: 200,
      },
      {
        // 购买日期
        title: _t('3809ca3e30374800aba8'),
        dataIndex: 'needTax',
        width: 300,
        render: (value, record) => (
          <AssetsFormItem
            name={getBeforeTaxFreeDateKey(record)}
            rules={[{ required: true, message: _t('24805280f9324800a76c') }]}
          >
            <TaxSelect
              onChange={() => {
                refresh();
                const beforeKey = getBeforeTaxFreeDateKey(record);
                const beforeValue = formData[beforeKey];
                const unitKey = getUnitCostKey(record);
                const unitValue = formData[unitKey];

                // 交互优化，当unitValue为空时不检查
                if (beforeValue && (unitValue === undefined || unitValue === null)) {
                  return;
                }
                // 重新检查当前数据的 单位成本
                formCheck([unitKey]);
              }}
              defaultValue={value}
            />
          </AssetsFormItem>
        ),
      },
      {
        // 单位成本 (EUR)
        title: <BaseColumnTitle>{_t('362b795e4a024000a191')}</BaseColumnTitle>,
        dataIndex: 'unitCost',
        width: 100,
        render: (value, record) => {
          return (
            <AssetsFormItem
              name={getUnitCostKey(record)}
              rules={[
                {
                  validator: (rule, value, callback) =>
                    unitCostVilidator(value, record, formData, callback),
                },
              ]}
            >
              <TaxUnitCost formData={formData} record={record} onChange={refresh} />
            </AssetsFormItem>
          );
        },
      },
      {
        // 总成本 (EUR)
        title: (
          <TableRightColumn>
            <BaseColumnTitle>{_t('b0db864d2ab94800acbf')}</BaseColumnTitle>
          </TableRightColumn>
        ),
        dataIndex: 'totalCost',
        width: 100,
        render: (text, record) => (
          <TableRightColumn>
            <TotalTaxText formData={formData} record={record} />
          </TableRightColumn>
        ),
      },
    ],
    [formData],
  );

  return (
    <StyledCommonTable
      id="StyledCommonTable"
      columns={columns}
      dataSource={list}
      emptyPlaceholder={<TableEmptyRetry onRetry={handleRetry} />}
    />
  );
};

export default AssetsTable;
