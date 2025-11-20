/**
 * Owner: willen@kupotech.com
 */
import { ICArrowDownOutlined, ICArrowUpOutlined, ICQuestionOutlined } from '@kux/icons';
import { Empty, Popconfirm, Table, Tooltip, withResponsive } from '@kux/mui';
import MiniTable from 'components/Account/MiniTable';
import DateTimeFormat from 'components/common/DateTimeFormat';
import React from 'react';
import { connect } from 'react-redux';
import { injectLocale } from 'src/components/LoadLocale';
import { _t } from 'tools/i18n';
import getPlatformIcon from './loginPlatformIcon';
import {
  Cell_icon,
  ExpandIconWrapper,
  ExpandTable,
  MiniTableWrapper,
  NoneContentTip,
  Opt,
  RemoveBtn,
  TableWrapper,
  Title,
  TitleWrapper,
} from './styled';

@withResponsive
@connect((state) => {
  const isRemovingDevice = state.loading.effects['homepage/removeDevice'];
  const { securtyStatus } = state.user;
  return {
    isRemovingDevice,
    securtyStatus,
  };
})
@injectLocale
class OverViewTableDevice extends React.Component {
  state = {
    expandedRowKeys: [],
  };

  switchRowOpen = (isOpen, item) => {
    const { expandedRowKeys } = this.state;
    let newExpandedRowKeys = [];
    if (isOpen) {
      newExpandedRowKeys = expandedRowKeys.filter((v) => v !== item.deviceId);
    } else {
      newExpandedRowKeys = [...expandedRowKeys, item.deviceId];
    }
    this.setState({
      expandedRowKeys: newExpandedRowKeys,
    });
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'api_key/getEnabledApi',
    });
  }

  onRowClick = (item) => {
    const { expandedRowKeys } = this.state;
    const isOpen = expandedRowKeys.some((v) => v === item.deviceId);
    const isRecordsLg2 = item && item.ipRecords && item.ipRecords.length > 0;
    if (isRecordsLg2) {
      this.switchRowOpen(isOpen, item);
    }
  };

  onMiniRowClick = (item) => {
    const { expandedRowKeys } = this.state;
    const isOpen = expandedRowKeys.some((v) => v === item.deviceId);
    const isRecordsLg2 = item && item.ipRecords && item.ipRecords.length > 0;
    if (isRecordsLg2) {
      this.switchRowOpen(isOpen, item);
    }
  };

  render() {
    const {
      dataSource,
      dispatch,
      securtyStatus,
      isRemovingDevice,
      responsive,
      isRTL,
      ...tableProps
    } = this.props;
    const { expandedRowKeys } = this.state;
    const ICON = (platform, icons = null) => {
      return getPlatformIcon(platform, icons);
    };
    const { lg } = responsive;

    const createColumns = (noExpd) => {
      return [
        {
          title: _t('trust.device'),
          key: 'platform',
          width: '28%',
          render(value, item) {
            const { platform, device, system } = item;
            return (
              <Cell_icon>
                {ICON(platform)}
                <span className="ml-8">{system}</span>
                <span className="ml-2">{device}</span>
              </Cell_icon>
            );
          },
          reverse: true,
          expandedIcon(value, item) {
            const { deviceId, ipRecords } = item;
            if (!ipRecords || !ipRecords.length) {
              return null;
            }
            const expanded = expandedRowKeys.some((v) => v === deviceId);
            return (
              <ExpandIconWrapper>
                {expanded ? <ICArrowUpOutlined size="16" /> : <ICArrowDownOutlined size="16" />}
              </ExpandIconWrapper>
            );
          },
        },
        {
          title: _t('login.region'),
          key: 'area',
          width: '27%',
          render(value, item) {
            return <span>{`${item.area}(${item.ip})`}</span>;
          },
        },
        {
          title: _t('recent.activity'),
          dataIndex: 'time',
          key: 'date',
          width: '25%',
          render(time) {
            return (
              <div>
                <DateTimeFormat>{time}</DateTimeFormat>
              </div>
            );
          },
        },
        {
          title: (
            <Opt>
              {_t('remove.device')}&nbsp;
              <Tooltip placement="top" title={_t('remove.device.help')}>
                <div className="deviceIcon">
                  <ICQuestionOutlined size="12" />
                </div>
              </Tooltip>
            </Opt>
          ),
          key: 'opt',
          align: isRTL ? 'right' : 'left',
          render(value, item) {
            const toRemove = () => {
              if (!item.deviceId) return;
              dispatch({
                type: 'homepage/removeDevice',
                payload: {
                  deviceId: item.deviceId,
                },
              });
            };
            return (
              <div
                onClick={(e) => e?.stopPropagation()}
                style={{ textAlign: isRTL ? 'left' : 'right' }}
              >
                {noExpd ? (
                  <RemoveBtn disabled={noExpd}>{_t('paymnet_bankcard_remove')}</RemoveBtn>
                ) : (
                  <Popconfirm
                    trigger="hover"
                    placement="top-start"
                    title={_t('remove.device.confirm')}
                    onConfirm={toRemove}
                    cancelText={_t('cancel')}
                    okText={_t('confirm')}
                  >
                    <RemoveBtn disabled={noExpd}>{_t('paymnet_bankcard_remove')}</RemoveBtn>
                  </Popconfirm>
                )}
              </div>
            );
          },
        },
      ];
    };

    const expandedRowRender = (record) => {
      if (!record.ipRecords || !record.ipRecords.length) {
        return null;
      }
      const _col = createColumns(true).slice();

      return (
        <ExpandTable>
          {!lg ? (
            // <MiniTableWrapper>
            <MiniTable
              loading={false}
              columns={_col}
              dataSource={record.ipRecords}
              pagination={false}
              rowKey="deviceId"
            />
          ) : (
            // </MiniTableWrapper>
            <Table
              showHeader={false}
              columns={_col}
              rowKey="deviceId"
              dataSource={record.ipRecords}
              pagination={false}
              expandable={{
                expandedRowRender: () => {},
                rowExpandable: () => false,
              }}
              size="small"
              bordered
            />
          )}
        </ExpandTable>
      );
    };

    const _render = () => {
      const columns = createColumns();

      if (!securtyStatus.GOOGLE2FA && !securtyStatus.SMS) {
        return (
          <NoneContentTip>
            <div className="text-center">
              <Empty
                size={responsive.sm ? 'large' : 'small'}
                description={_t('hoqk98pcivrSHjEds7SCJP')}
              />
            </div>
            <div className="text-center">{_t('device.requirement')}</div>
          </NoneContentTip>
        );
      }
      return (
        <TableWrapper>
          {!lg ? (
            <MiniTableWrapper>
              <MiniTable
                loading={false}
                columns={columns}
                dataSource={dataSource}
                onRowClick={this.onRowClick}
                pagination={false}
                rowKey="deviceId"
                expandedRowKeys={expandedRowKeys}
                expandedRowRender={expandedRowRender}
              />
            </MiniTableWrapper>
          ) : (
            <Table
              {...tableProps}
              columns={columns}
              onRowClick={this.onRowClick}
              dataSource={dataSource}
              pagination={false}
              expandable={{
                expandedRowRender,
                expandRowByClick: true,
                rowExpandable: (record) => {
                  return record.ipRecords.length;
                },
              }}
              rowKey="deviceId"
              loading={false}
              size="small"
              bordered
            />
          )}
        </TableWrapper>
      );
    };

    return (
      <React.Fragment>
        <TitleWrapper>
          <Title>{_t('device.management')}</Title>
        </TitleWrapper>
        {_render(dataSource)}
      </React.Fragment>
    );
  }
}

export default OverViewTableDevice;
