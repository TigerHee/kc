/**
 * Owner: willen@kupotech.com
 */
import { styled, Tabs } from '@kux/mui';
import React, { Fragment } from 'react';
import CustomTable from './CustomTable';
import Filters from './Filters';

const { Tab } = Tabs;

const NewFilterTable = styled.div`
  min-height: 680px;
`;

export default class FilterTable extends React.Component {
  constructor(props) {
    super(props);
    const tabList = Object.keys(props.cards);
    this.firstFetch = {};
    Object.keys(props.cards).forEach((key) => {
      this.firstFetch[key] = true;
    });
    this.state = {
      activeTab: tabList[0],
      loading: false,
    };
  }

  static defaultProps = {
    hasPaginate: true,
    requestEnable: true,
  };

  onTabChange = (e, value) => {
    const { onActiveTabChage } = this.props;
    if (onActiveTabChage) {
      onActiveTabChage(value);
    }
    this.setState(
      {
        activeTab: value,
      },
      () => {
        this.startQuery(this.initFetch);
      },
    );
  };

  startQuery = async (queryHandler) => {
    const { requestEnable } = this.props;

    if (requestEnable) {
      this.setState({ loading: true });
      try {
        await queryHandler();
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  initFetch = () => {
    const { queryRecords, cards, updateFilters } = this.props;
    const { activeTab } = this.state;
    if (this.firstFetch[activeTab] && cards[activeTab].initialFilters) {
      updateFilters(cards[activeTab].initialFilters, activeTab);
      this.firstFetch[activeTab] = false;
    }
    return queryRecords(activeTab);
  };

  updateFiltersFetch = (changedValues) => {
    const { onFilterChange } = this.props;
    const { activeTab } = this.state;
    onFilterChange(changedValues, activeTab);
  };

  componentDidMount() {
    this.startQuery(this.initFetch);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.requestEnable && this.props.requestEnable) {
      this.startQuery(this.initFetch);
    }
  }

  handleFiltersChange = (changedValues) => {
    this.startQuery(() => this.updateFiltersFetch({ ...changedValues, currentPage: 1 }));
  };

  handlePageChange = (page) => {
    this.startQuery(() => this.updateFiltersFetch({ currentPage: page }));
  };

  componentWillUnmount() {
    const { cancelPolling } = this.props;
    const { activeTab } = this.state;
    cancelPolling(activeTab);
  }

  render() {
    // customContainer是否自定义外层容器
    const {
      tips,
      cards,
      extra,
      theme,
      ExportCsvButton,
      hasPaginate = true,
      showTab = false,
      jumperPage = false,
      ...otherProps
    } = this.props;
    const { activeTab } = this.state;
    const filterValues = this.props[activeTab].filters;
    const tableData = (this.props[activeTab].records || []).map((item, index) => {
      return {
        ...item,
        key: `record${index}`,
      };
    });
    const { pagination } = this.props[activeTab];
    const cardsCfg = cards;
    const tabList = Object.keys(cardsCfg).map((key) => ({
      key,
      tab: cardsCfg[key].title,
    }));

    const isSingle = tabList.length === 1;
    const filterFields = cardsCfg[activeTab].filters;
    const tableColumns = cardsCfg[activeTab].columns;
    let scrollX = 0;
    tableColumns.forEach((item) => {
      scrollX = scrollX + (item.width || 100);
    });

    const main = (
      <Fragment>
        {/* XHPT-1678 屏蔽掉现货下历史交易数据入口 */}
        {/* {tips && <Fragment>{tips}</Fragment>} */}
        {filterFields && (
          <Filters
            ExportCsvButton={ExportCsvButton || null}
            extra={extra ? extra && React.cloneElement(extra, { currentKey: activeTab }) : null}
            fields={filterFields}
            onFilterChange={this.handleFiltersChange}
            values={filterValues}
          />
        )}
        <CustomTable
          {...otherProps}
          columns={tableColumns}
          dataSource={tableData}
          loading={this.state.loading}
          needPagination={hasPaginate}
          scrollX={scrollX}
          pagination={
            pagination && {
              ...pagination,
              onChange: this.handlePageChange,
              jumperPage,
            }
          }
        />
      </Fragment>
    );
    return (
      <NewFilterTable>
        {showTab ? (
          <>
            {isSingle ? (
              <div>{tabList[0].tab}</div>
            ) : (
              <Tabs value={activeTab} onChange={this.onTabChange}>
                {tabList.map((item) => {
                  const { tab, key } = item;
                  return <Tab label={tab} value={key} key={key} />;
                })}
              </Tabs>
            )}
          </>
        ) : null}
        {main}
      </NewFilterTable>
    );
  }
}
