/**
 * Owner: corki@kupotech.com
 */
import styled from '@emotion/styled';
import { injectLocale } from '@kucoin-base/i18n';
import { ICReceivedOutlined } from '@kux/icons';
import { Button, withResponsive, withTheme } from '@kux/mui';
import AccountHeader from 'components/Account/AccountHeader';
import ExportDrawer from 'components/V3ExportDrawer';
import { tenantConfig } from 'config/tenant';
import React from 'react';
import { connect } from 'react-redux';
import Table from 'src/components/Account/Download/Table';
import exportBlackICON from 'static/download/doc-black.svg';
import exportWhiteICON from 'static/download/doc-white.svg';
import { _t } from 'tools/i18n';
import { saTrackForBiz } from 'utils/ga';

const DownloadIcon = styled(ICReceivedOutlined)`
  margin-right: 6px;
`;
const Content = styled.div`
  padding: 32px 64px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 32px 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 24px 16px;
  }
`;
const Icon = styled.img`
  margin-right: 6px;
  width: 16px;
  height: 16px;
`;

@withTheme
@withResponsive
@connect((state) => {
  return {
    records: state.download.records || [],
    pagination: state.download.pagination,
    loading: state.loading.effects['download/query'],
  };
})
@injectLocale
export default class AccountDownloadPage extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'download/query@polling',
      payload: {
        current: 1,
        pageSize: 10,
      },
    });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'download/query@polling:cancel' });
  }

  onTableChange = (current) => {
    this.props.dispatch({
      type: 'download/query@polling',
      payload: { current },
    });
  };

  handleTaxInvoiceClick = () => {
    saTrackForBiz({}, ['DownloadBill', '1']);
    this.props.dispatch({
      type: 'order_meta/update',
      payload: {
        taxInvoiceDrawerOpen: true,
      },
    });
  };

  handleClick = () => {
    saTrackForBiz({}, ['DownloadBill', '1']);
    this.props.dispatch({
      type: 'order_meta/update',
      payload: {
        exportDrawerOpen: true,
      },
    });
  };

  render() {
    const { records, pagination, loading, responsive, theme, kycStatusDisplayInfo, kycLoading } =
      this.props;
    const { sm } = responsive;

    return (
      <>
        <AccountHeader title={_t('menu.download')}>
          {tenantConfig.download.showTaxInvoiceDrawer ? (
            <Button
              onClick={this.handleTaxInvoiceClick}
              variant="contained"
              style={{ marginRight: tenantConfig.download.showNormalDrawer ? '8px' : 0 }}
              size={sm ? 'basic' : 'mini'}
              data-inspector="bill_export_btn"
              disabled={kycStatusDisplayInfo?.kycLimit || kycLoading ? true : false}
            >
              <Icon
                src={theme.currentTheme === 'dark' ? exportBlackICON : exportWhiteICON}
                alt="export-icon"
              />
              {_t('a5c0b1eca5384000ad75')}
            </Button>
          ) : null}

          {tenantConfig.download.showNormalDrawer ? (
            <Button
              onClick={this.handleClick}
              variant="contained"
              size={sm ? 'basic' : 'mini'}
              data-inspector="bill_export_btn"
            >
              <DownloadIcon />
              {_t('k3maPi5RVhYU7UA3C7pyY8')}
            </Button>
          ) : null}
        </AccountHeader>
        <Content data-inspector="account_download_page">
          <Table
            data={records}
            loading={loading}
            pagination={pagination}
            onChange={this.onTableChange}
          />
        </Content>
        <ExportDrawer showRecord={false} />
      </>
    );
  }
}
