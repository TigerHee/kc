/**
 * Owner: odan.ou@kupotech.com
 */
import { map } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Table, Spin, Pagination, Empty, styled, useResponsive } from '@kux/mui';
import { _t } from 'tools/i18n';
import { DateTimeFormat } from '../utils';

const EmptyBox = styled.div`
  display: flex;
  justify-content: center;
  min-height: 200px;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:not(:first-of-type) {
    margin-top: 8px;
  }
`;
const RowLabel = styled.span`
  font-size: 13px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;
const RowValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;
const PaginationBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: 24px;
`;
const StyledPagination = styled(Pagination)`
  margin-bottom: 80px;
`;

const MobileTable = ({ loading, dataSource, columns, rowKey }) => {
  return (
    <Spin spinning={loading}>
      <div style={{ minHeight: 200 }}>
        {map(dataSource, (item, index) => {
          return (
            <div key={rowKey ? rowKey(item) : index} style={{ marginTop: 8, padding: '16px 0' }}>
              {map(columns, ({ dataIndex, title, render }, i) => {
                return (
                  <Row key={dataIndex ?? i}>
                    <RowLabel>{title}</RowLabel>
                    <RowValue>
                      {typeof render === 'function'
                        ? render(item[dataIndex], item)
                        : item[dataIndex]}
                    </RowValue>
                  </Row>
                );
              })}
            </div>
          );
        })}
      </div>
    </Spin>
  );
};

const DetailTable = (props) => {
  const { sm } = useResponsive();
  const { dataSource, onChange: onChangeProp, pagination: paginationProp, loading = false } = props;

  const columns = useMemo(() => {
    return [
      {
        width: '40%',
        title: _t('market.name'), // 名称
        dataIndex: '_',
        render: (val) => {
          return _t('assets.margin.bonus.detail.Interest.deduct');
        },
      },
      {
        title: _t('s4TKPQ4MmdtaZsDi7Ws1Gm'), // 数量
        dataIndex: 'discountAmount',
        render: (val, { currencyName }) => {
          return val ? `${val} ${currencyName}` : '--';
        },
      },
      {
        title: _t('time'), // 时间
        dataIndex: 'createdAt',
        align: 'right',
        render: (val) => {
          if (!val) return '--';
          return <DateTimeFormat>{val}</DateTimeFormat>;
        },
      },
    ];
  }, []);

  const onChange = useCallback(
    (e, page) => {
      return onChangeProp?.(page);
    },
    [onChangeProp],
  );
  const pagination = useMemo(() => {
    return {
      ...paginationProp,
      onChange,
    };
  }, [onChange, paginationProp]);

  return (
    <>
      {loading || dataSource?.length > 0 ? (
        sm ? (
          <Table
            size="small"
            loading={loading}
            rowKey={(v) => v.id}
            headerType="filled"
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            locale={{
              emptyText: _t('4ZXsbhmZYRojKVuaUbnnec'),
            }}
          />
        ) : (
          <MobileTable
            loading={loading}
            columns={columns}
            rowKey={(v) => v.id}
            dataSource={dataSource}
          />
        )
      ) : (
        <EmptyBox>
          <Empty size="small" description={_t('table.empty')} />
        </EmptyBox>
      )}
      {pagination?.total > pagination?.pageSize && (
        <PaginationBox>
          <StyledPagination {...pagination} />
        </PaginationBox>
      )}
    </>
  );
};

export default DetailTable;
