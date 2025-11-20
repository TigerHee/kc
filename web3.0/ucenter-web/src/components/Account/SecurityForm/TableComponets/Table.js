/**
 * Owner: willen@kupotech.com
 */
import { Table, withResponsive } from '@kux/mui';
import MiniTable from 'components/Account/MiniTable';
import DateTimeFormat from 'components/common/DateTimeFormat';
import KcPagination from 'components/common/MuiPagination';
import React from 'react';
import { injectLocale } from 'src/components/LoadLocale';
import { _t } from 'tools/i18n';
import getPlatformIcon from './loginPlatformIcon';
import { Cell_icon, MiniTableWrapper, TableWrapper } from './styled';

const STATUS = {
  trueO: 'online',
  falseO: 'offline',
};

@withResponsive
@injectLocale
class OverViewTable extends React.Component {
  render() {
    const { dataSource, isRTL, responsive, ...tableProps } = this.props;
    const { lg } = responsive;

    const ICON = (platform, icons = null) => {
      return getPlatformIcon(platform, icons);
    };

    const createColumns = () => {
      return [
        {
          title: _t('login.region'),
          key: 'address',
          render(val, item) {
            return <span>{`${item.area}(${item.ip})`}</span>;
          },
        },
        {
          title: _t('login.device'),
          key: 'device',
          render(val, item) {
            const { system, device, platform } = item;
            return (
              <Cell_icon>
                {ICON(platform)}
                <span className="ml-8">{system}</span>
                <span className="ml-2">{device}</span>
              </Cell_icon>
            );
          },
        },
        {
          title: _t('time'),
          dataIndex: 'time',
          key: 'date',
          render(time) {
            return <DateTimeFormat>{time}</DateTimeFormat>;
          },
        },
        {
          title: _t('status'),
          // className: 'text-right',
          key: 'status',
          align: isRTL ? 'right' : 'left',
          width: 160,
          render(val, item) {
            const st = item.onlineStatus || item.currentOnlineStatus;
            const sta = STATUS[`${st}O`];
            const prefix =
              item.currentOnlineStatus || item.isCurrentOnline ? _t('current.device') : '';
            return <span>{prefix || _t(sta)}</span>;
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
                columns={createColumns()}
                dataSource={dataSource}
                pagination={false}
                rowKey="id"
                locale={{
                  emptyText: _t('hoqk98pcivrSHjEds7SCJP'),
                }}
              />
            </MiniTableWrapper>
          ) : (
            <Table
              {...tableProps}
              rowKey="id"
              title={_t('recent.login')}
              columns={createColumns()}
              dataSource={dataSource}
              loading={false}
              pagination={false}
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
            boundaryCount={1}
          />
        ) : null}
      </TableWrapper>
    );
  }
}

export default OverViewTable;
