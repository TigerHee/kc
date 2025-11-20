import { ICEdit2Outlined } from '@kux/icons';
import { Box, Button, styled, Table as OriginTable } from '@kux/mui';
import moment from 'moment';
import { useMemo } from 'react';
import { _t } from 'src/tools/i18n';
import AmountText from './AmountText';
import CoinDisplay from './CoinDisplay';
import FreeTaxText from './FreeTaxText';
import TableEmptyRetry from './TableEmptyRetry';

const ExTable = styled(OriginTable)`
  th {
    padding: 0;
  }
  tr:hover td {
    background: transparent;
  }
  td {
    padding: 0;
    &::after,
    &::before {
      display: none;
    }
  }
`;

const TableRightColumn = styled.div`
  text-align: right;
  display: flex;
  justify-content: end;
`;

const TableCellBase = styled.div`
  line-height: 140%;
  ${({ isFirst }) => (isFirst ? 'padding-left: 16px;' : undefined)}
  ${({ isLast }) => (isLast ? 'padding-right: 16px;' : undefined)}
  display: flex;
  justify-content: ${({ isAlignRight }) => (isAlignRight ? 'flex-end' : 'flex-start')};
`;

const TableCell = styled(TableCellBase)`
  min-height: 80px;
  padding: 16px 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text30};
  align-items: center;
  font-weight: 500;
  b {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TableTitle = styled(TableCellBase)`
  color: ${({ theme }) => theme.colors.text40};
  padding: 8px 12px;
  border-radius: ${({ isFirst, isLast }) =>
    `${isFirst ? 12 : 0}px ${isLast ? 12 : 0}px ${isLast ? 12 : 0}px ${isFirst ? 12 : 0}px`};
  background: ${({ theme }) => theme.colors.cover2};
  font-size: 14px;
  font-weight: 400;
`;

export default function Table({ dataSource, loading, onDeclare, onRetry }) {
  const columns = useMemo(() => {
    return [
      {
        dataIndex: 'currency',
        title: <TableTitle isFirst>{_t('qCtpCMRwSpHG73GhHUkTF8')}</TableTitle>,
        width: 210,
        render: (text) => (
          <TableCell>
            <CoinDisplay currency={text} />
          </TableCell>
        ),
      },
      {
        dataIndex: 'totalAmount',
        title: <TableTitle>{_t('qN61LLGpxv8GMe2HcBQg1j')}</TableTitle>,
        width: 210,
        render: (text) => (
          <TableCell>
            <AmountText value={text} />
          </TableCell>
        ),
      },
      {
        dataIndex: 'needTax',
        title: <TableTitle>{_t('3809ca3e30374800aba8')}</TableTitle>,
        width: 300,
        render: (_text, record) => {
          const { needTax, assetAcquireStartTime, assetAcquireEndTime } = record;
          return (
            <TableCell>
              {typeof needTax !== 'boolean' ? (
                <span>{_t('58259d56a0d34800ac8d')}</span>
              ) : needTax ? (
                <b>
                  {moment(assetAcquireStartTime).format('DD/MM/YYYY')}
                  &nbsp;-&nbsp;
                  {moment(assetAcquireEndTime).format('DD/MM/YYYY')}
                </b>
              ) : (
                <b>{_t('d851de8d5a4d4000a0cc')}</b>
              )}
            </TableCell>
          );
        },
      },
      {
        dataIndex: 'totalCost',
        title: <TableTitle isAlignRight>{_t('b0db864d2ab94800acbf')}</TableTitle>,
        width: 210,
        render: (text, record) => {
          const { needTax } = record;
          return (
            <TableCell isAlignRight>
              {typeof needTax !== 'boolean' ? (
                <span>{_t('58259d56a0d34800ac8d')}</span>
              ) : needTax ? (
                <AmountText value={text} />
              ) : (
                <TableRightColumn>
                  <FreeTaxText />
                </TableRightColumn>
              )}
            </TableCell>
          );
        },
      },
      {
        title: (
          <TableTitle isLast isAlignRight>
            {_t('7f32f3dbdb474800a0d7')}
          </TableTitle>
        ),
        width: 100,
        render: (_, record) => {
          const { needTax } = record;
          const filled = typeof needTax === 'boolean';
          return (
            <TableCell isLast isAlignRight>
              <Button
                variant="text"
                type="brandGreen"
                size="large"
                onClick={() => onDeclare(record)}
              >
                <ICEdit2Outlined size={16} />
                <Box size={4} />
                {filled ? (
                  <span>{_t('41836045b4b94800a333')}</span>
                ) : (
                  <span>{_t('6d22ffc9eb0f4800a90c')}</span>
                )}
              </Button>
            </TableCell>
          );
        },
      },
    ];
  }, []);

  return (
    <ExTable
      dataSource={dataSource}
      columns={columns}
      rowKey="currency"
      loading={loading}
      headerBorder
      emptyPlaceholder={<TableEmptyRetry onRetry={onRetry} />}
    />
  );
}
