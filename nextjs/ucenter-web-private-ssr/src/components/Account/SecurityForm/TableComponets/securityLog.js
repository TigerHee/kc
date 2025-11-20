/**
 * Owner: willen@kupotech.com
 */
import { Table, withResponsive } from '@kux/mui';
import MiniTable from 'components/Account/MiniTable';
import DateTimeFormat from 'components/common/DateTimeFormat';
import KcPagination from 'components/common/MuiPagination';
import { showDatetime } from 'helper';
import React from 'react';
import { injectLocale } from 'src/components/LoadLocale';
import { _t } from 'tools/i18n';
import { SECURITY_LOG_TYPE } from './consts';
import { MiniTableWrapper, TableWrapper } from './styled';

@withResponsive
@injectLocale
class OverViewTable extends React.Component {
  render() {
    const { dataSource = [], isRTL, responsive, ...tableProps } = this.props;
    const { lg } = responsive;

    const createColumns = () => {
      return [
        {
          title: _t('login.region'),
          width: '40%',
          dataIndex: 'location',
          render(val, item) {
            return <span>{`${val}(${item.ip})`}</span>;
          },
        },
        {
          title: _t('type'),
          dataIndex: 'operation',
          width: '30%',
          render(val) {
            return _t(SECURITY_LOG_TYPE[val]);
          },
        },
        {
          title: _t('time'),
          dataIndex: 'time',
          align: 'right',
          width: '30%',
          render(time) {
            return <DateTimeFormat>{time}</DateTimeFormat>;
          },
        },
      ];
    };

    const miniCreateColumns = () => {
      return [
        {
          title: _t('login.region'),
          dataIndex: 'location',
          reverse: true,
          render(val, item) {
            return <span>{`${val}(${item.ip})`}</span>;
          },
          expandedIcon() {
            return null;
          },
        },
        {
          title: _t('type'),
          dataIndex: 'operation',
          render(val) {
            return _t(SECURITY_LOG_TYPE[val]);
          },
        },
        {
          title: _t('time'),
          dataIndex: 'time',
          render(time) {
            return showDatetime(new Date(time));
          },
        },
      ];
    };
    return (
      <TableWrapper>
        <div>
          {!lg ? (
            <MiniTableWrapper>
              <MiniTable
                loading={false}
                columns={miniCreateColumns()}
                dataSource={dataSource}
                pagination={false}
                rowKey="id"
              />
            </MiniTableWrapper>
          ) : (
            <Table
              {...tableProps}
              title={_t('sec.logs')}
              columns={createColumns()}
              dataSource={dataSource}
              pagination={false}
              loading={false}
              rowKey="id"
              size="small"
              bordered
              locale={{
                emptyText: _t('hoqk98pcivrSHjEds7SCJP'),
              }}
            />
          )}
        </div>
        {tableProps.pagination && tableProps.pagination?.total > tableProps.pagination?.pageSize ? (
          <KcPagination
            {...tableProps.pagination}
            onChange={(page) => {
              tableProps.onChange(page, tableProps.pagination.pageSize);
            }}
            siblingCount={1}
          />
        ) : null}
      </TableWrapper>
    );
  }
}

export default OverViewTable;
