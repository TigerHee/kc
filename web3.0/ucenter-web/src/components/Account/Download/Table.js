/**
 * Owner: tiger@kupotech.com
 */

import { injectLocale } from '@kucoin-base/i18n';
import { styled, Table, Tooltip, withResponsive } from '@kux/mui';
import MiniTable from 'components/Account/MiniTable';
import CoinCodeToName from 'components/common/CoinCodeToName';
import DateTimeFormat from 'components/common/DateTimeFormat';
import KcPagination from 'components/common/MuiPagination';
import { ALL_TOP_CODES, ALL_TOP_CODES_MAP } from 'components/V3ExportDrawer/config';
import Status from 'components/V3ExportDrawer/Status';
import { tenantConfig } from 'config/tenant';
import { intersection } from 'lodash';
import React, { Fragment } from 'react';
import errMsgIcon from 'static/order/err-msg.svg';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import saveAs from 'utils/saveAs';

const TableWrapper = styled.div`
  width: 100%;
  tr {
    td {
      font-weight: 500;
      font-size: 14px;
    }
  }
`;
const CategoryCodes = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const CategoryCodesH5 = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
`;
const DownloadBtn = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

export const getFailedMsg = (code) => {
  if (['NO_USER', 'NO_DATA'].includes(code)) {
    return _t('bill.export.failed.msg.noData'); // 暂无数据
  }

  if (
    ['LOAD_DATA_FAILED', 'PACK_FILE_FAILED', 'UPLOAD_FAILED', 'OVERTIME', 'UNKNOWN'].includes(code)
  ) {
    return _t('bill.export.failed.msg.later'); // 导出失败，请稍后重试或联系客服
  }

  if (['DEALER'].includes(code)) {
    return _t('bill.export.failed.msg.notSupport'); // 用户类型不支持，请联系客服
  }

  if (['MORE_SIZE'].includes(code)) {
    return _t('bill.export.failed.msg.overSize'); // 超过限定大小，请联系客服
  }

  if (code) {
    return _t('bill.export.failed.msg.err'); // 导出失败，请联系客服
  }

  return '';
};

// 这个categoryId要跟各个导出业务Owner确定。。。。 _t()
export const TYPE_MAP_OLD = {
  balance: _t('account.detail'),
  'trade-front': _t('trading.list'),
  'TRADE-FRONT': _t('trading.list'),
  withdrawal: _t('assets.transactionHistory.type.Withdrawal'),
  deposit: _t('assets.transactionHistory.type.Deposit'),
  // otc: '场外交易记录',
  'FLASH-TRADE': _t('ikxVCYNuxoCznbptcYsVmF'),
  // 税务发票
  'tax-invoice': _t('32b4551d538c4000a277'),
  // 账户结单
  'DAILY-OR-MONTHLY-STATEMENT-EXPORT': `${_t('e70dc57819d64000abf1')}/${_t(
    'cbbf380f265d4000a481',
  )}`,
};

const TYPE_MAP = { ...TYPE_MAP_OLD, ...ALL_TOP_CODES_MAP };

@withResponsive
@injectLocale
export default class DownloadTable extends React.Component {
  handleDownload = ({ fileUrl, categoryCodes }) => {
    trackClick(['DownloadTask', '1'], {
      Source: intersection(categoryCodes, ALL_TOP_CODES).length > 0 ? '账单导出' : '其他',
    });
    saveAs(fileUrl, 'poster');
  };

  createColumns = (sm, isRTL) => {
    return [
      {
        title: (val, item) => {
          return (
            <Tooltip
              title={
                <>
                  {item.categoryCodes.map((item) => (
                    <div key={item}>{TYPE_MAP[item] || item}</div>
                  ))}
                </>
              }
              trigger="click"
            >
              <CategoryCodesH5>
                {item.categoryCodes.map((item) => (
                  <Fragment key={item}>{TYPE_MAP[item] || item} </Fragment>
                ))}
              </CategoryCodesH5>
            </Tooltip>
          );
        },
        labelColorKey: 'text',
        dataIndex: 'h5',
        render: (value, item) => {
          return item.fileUrl ? (
            <DownloadBtn onClick={() => this.handleDownload(item)}>
              {_t('35wKhJTBZzrHWsu5spLTG6')}
            </DownloadBtn>
          ) : null;
        },
        hide: sm,
      },
      {
        title: _t('time'),
        dataIndex: 'createdAt',
        render(item) {
          return (
            <span>
              <DateTimeFormat>{item}</DateTimeFormat>
            </span>
          );
        },
        width: '20%',
      },
      {
        title: _t('type'), // 类型
        dataIndex: 'categoryCodes',
        ellipsis: true,
        render(value) {
          if (tenantConfig.download.showFixedType) {
            return <div>{_t('32b4551d538c4000a277')}</div>; // 渲染固定的类型
          }
          return (
            <Tooltip
              placement="top"
              title={
                <>
                  {value.map((item) => (
                    <div key={item}>{TYPE_MAP[item] || item}</div>
                  ))}
                </>
              }
            >
              <CategoryCodes>
                {value.map((item) => (
                  <Fragment key={item}>{TYPE_MAP[item] || item} </Fragment>
                ))}
              </CategoryCodes>
            </Tooltip>
          );
        },
        hide: !sm,
        width: '30%',
      },
      {
        title: _t('vote.coin-type'),
        dataIndex: 'currency',
        render(value) {
          return value ? (
            <CoinCodeToName coin={value} />
          ) : (
            <span>{_t('6FynGC3pMzEL5jiJ1VUEFm')}</span>
          );
        },
        width: '10%',
      },
      {
        title: _t('period'),
        key: 'begin',
        dataIndex: 'begin',
        render(value, { end }) {
          if (!value && !end) {
            return '-';
          }
          return (
            <>
              <DateTimeFormat hideTime>{value}</DateTimeFormat> -{' '}
              <DateTimeFormat hideTime>{end}</DateTimeFormat>
            </>
          );
        },
        width: '20%',
      },
      {
        title: _t('oHJraBWH5VLkDwciJsRvRD'),
        dataIndex: 'status',
        render(value, item) {
          switch (value) {
            case 0:
            case 1:
              return <Status status="pending">{tenantConfig.download.generateStatus(_t)}</Status>;
            case 2:
              return <Status status="success">{_t('eYLww7Sv1ErM7hVXXXowRq')}</Status>;
            case 4:
              return <Status status="faild">{_t('deleted')}</Status>;
            case 3:
            default:
              const msg = getFailedMsg(item.message);
              return (
                <Status status="faild">
                  {_t('cFpjnxjDzGSx9FPwaMn253')}

                  {msg ? (
                    <Tooltip placement="top" title={msg}>
                      <img src={errMsgIcon} alt="error-icon" />
                    </Tooltip>
                  ) : null}
                </Status>
              );
          }
        },
        width: '10%',
      },
      {
        title: _t('5chJ4yYnYR3jMcFVMzdcWk'), // 操作
        dataIndex: 'fileUrl',
        align: isRTL ? 'right' : 'left',
        render: (value, item) => {
          return value ? (
            <DownloadBtn onClick={() => this.handleDownload(item)}>
              {_t('35wKhJTBZzrHWsu5spLTG6')}
            </DownloadBtn>
          ) : (
            <span>-</span>
          );
        },
        hide: !sm,
        width: '10%',
      },
    ].filter((i) => !i.hide);
  };

  render() {
    const { data, pagination, onChange, loading, responsive, isRTL } = this.props;
    const { sm } = responsive;
    const columns = this.createColumns(sm, isRTL);
    if (!tenantConfig.download.showCoinType) {
      // 泰国站税单导出不需要显示币种
      columns.splice(2, 1);
    }

    return (
      <>
        <TableWrapper>
          {sm ? (
            <Table
              loading={loading}
              columns={columns}
              dataSource={data}
              rowKey="id"
              locale={{
                emptyText: _t('hoqk98pcivrSHjEds7SCJP'),
              }}
              bordered
              size="small"
            />
          ) : (
            <MiniTable loading={loading} columns={columns} dataSource={data} rowKey="id" />
          )}
        </TableWrapper>
        {pagination && pagination?.total > pagination?.pageSize ? (
          <KcPagination onChange={onChange} siblingCount={1} boundaryCount={1} {...pagination} />
        ) : null}
      </>
    );
  }
}
