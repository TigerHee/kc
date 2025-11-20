/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
import { Table, Pagination } from '@kux/mui';
import InlineCoin from 'components/common/InlineCoin';
import CoinPrecision from 'components/common/CoinPrecision';
import CoinCurrency from 'components/common/CoinCurrency';
import { showDatetime } from 'helper';
import { injectLocale } from '@kucoin-base/i18n';
import { withResponsive, withTheme } from '@kux/mui';
import { useHtmlToReact } from 'hooks';
import style from './style.less';

@withResponsive
@injectLocale
@withTheme
class RewardsTable extends React.Component {
  createColumns = () => {
    const { isRTL, theme } = this.props;
    const colAlign = { align: isRTL ? 'right' : 'left' };
    return [
      {
        title: _t('assets.categories'),
        dataIndex: 'coin',
        width: 200,
        render(coin) {
          return (
            <div className={'categoriesCol'}>
              <InlineCoin size={18} {...coin} isAssets />
            </div>
          );
        },
      },
      {
        title: _t('arrival.time'),
        key: 'transferFinishTime',
        dataIndex: 'transferFinishTime',
        width: 200,
        render(item) {
          return showDatetime(item);
        },
      },
      {
        title: _t('donate.amount'),
        dataIndex: 'amount',
        width: 100,
        render(item, { currency }) {
          return (
            <span>
              <CoinPrecision coin={currency} value={item} /> <br />
              <CoinCurrency
                coin={currency} // 数字货币币种
                showType="1"
                className={`${
                  theme.currentTheme === 'light' ? 'color-gray' : 'color-pro-gray'
                } font-size-12`}
                value={item}
              />
            </span>
          );
        },
      },
      {
        title: _t('donate.reason'),
        dataIndex: 'reason',
        key: 'reason',
        width: 160,
        render(value) {
          return <RenderReason value={value} />;
        },
      },
    ].map((col) => ({
      ...col,
      ...colAlign,
    }));
  };

  render() {
    const { data, pagination, onChange, responsive } = this.props;
    const { sm, lg } = responsive;
    const isSm = sm && !lg;

    return (
      <React.Fragment>
        <Table
          rowKey="index"
          columns={this.createColumns()}
          // scroll={{ x: 660 }}
          dataSource={data}
          pagination={false}
        />
        {pagination?.total > 0 && pagination?.total > pagination?.pageSize && (
          <div className={style.pagination}>
            <Pagination {...pagination} onChange={onChange} simple={isSm} showJumpQuick />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default RewardsTable;

const RenderReason = ({ value }) => {
  const { eles } = useHtmlToReact({
    html: value,
  });
  return <span>{eles}</span>;
};
