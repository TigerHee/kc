/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { Pagination } from 'antd';
import AssetTransformPop from 'components/AssetTransformPop';
// import requireProps from 'hocs/requireProps';
import ConvertPanel from './ConvertPanel';
import RecordPanel from './RecordPanel';
import RulesPanel from './RulesPanel';
import RewardPanel from './RewardPanel';
import style from './style.less';

@connect((state) => {
  const { tradeMap = {} } = state.user_assets;
  const {
    totalBalance,
    records = [],
    rewards = [],
    fundPagination,
    rewardPagination,
  } = state.airdropTRC;
  const balance = tradeMap.USDT ? tradeMap.USDT.availableBalance : 0;
  return {
    isLogin: state.user.isLogin,
    user: state.user,
    balance,
    totalBalance,
    records,
    rewards,
    fundPagination,
    rewardPagination,
  };
})
export default class AirdopUSDt extends React.Component {
  state = {
    showAssetTransformPop: false,
  };

  componentDidMount() {
    const { dispatch, isLogin } = this.props;
    if (isLogin) {
      dispatch({
        type: 'airdropTRC/pullOperation',
      });
      dispatch({
        type: 'airdropTRC/pullReward',
      });
      dispatch({
        type: 'airdropTRC/pullBalance',
      });
    }
  }

  // componentDidUpdate(prevProps) {}

  componentWillUnmount() {}

  renderPagination = (type) => {
    const { fundPagination, rewardPagination } = this.props;
    const props = type === 'funds' ? fundPagination : rewardPagination;
    console.log(props);
    return (
      <div className={style.paginate}>
        <Pagination
          current={props.current}
          total={props.total}
          pageSize={props.pageSize}
          onChange={(page) => this.handlePaginationChange(type, page, props)}
        />
        ;
      </div>
    );
  };

  handlePaginationChange = (type, page) => {
    const { dispatch } = this.props;
    const params = {
      currentPage: page,
      pageSize: 5,
    };
    let path = '';
    if (type === 'funds') {
      path = 'airdropTRC/pullOperation';
    } else {
      path = 'airdropTRC/pullReward';
    }
    dispatch({ type: path, payload: params });
  };

  onCancelCallback = () => {
    this.setState({ showAssetTransformPop: false });
  };

  afterSubmitCallback = () => {
    this.setState({ showAssetTransformPop: false });
  };

  handleWithdraw = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'airdropTRC/withdraw', payload: { id } });
  };

  render() {
    const { balance, totalBalance, records, rewards, dispatch, isLogin } = this.props;
    const { showAssetTransformPop } = this.state;
    return (
      <React.Fragment>
        <ConvertPanel
          dispatch={dispatch}
          isLogin={isLogin}
          onTransClick={() => this.setState({ showAssetTransformPop: true })}
          balance={balance}
          totalBalance={totalBalance}
        />
        <RulesPanel />
        <RecordPanel
          dispatch={dispatch}
          data={records}
          handleWithdraw={this.handleWithdraw}
          pagination={this.renderPagination('funds')}
        />
        <RewardPanel
          dispatch={dispatch}
          data={rewards}
          pagination={this.renderPagination('rewards')}
        />
        <AssetTransformPop
          allowClear={false}
          accountType="MAIN"
          currency="USDT"
          visible={showAssetTransformPop}
          onCancelCallback={this.onCancelCallback}
          afterSubmitCallback={this.afterSubmitCallback}
        />
      </React.Fragment>
    );
  }
}
