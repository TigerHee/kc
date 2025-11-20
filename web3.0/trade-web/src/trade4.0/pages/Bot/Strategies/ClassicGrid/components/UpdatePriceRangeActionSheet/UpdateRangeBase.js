/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { calcGridPriceLeval, calcGridProfitRange } from 'ClassicGrid/util';
import ActionSheetController from './ActionSheetController';
import { feeRate } from 'Bot/config';
import { getExtendAIParams, doPostAPI, defaultNormalData } from './RangeWidgets';
import { _ } from 'lodash';
import { _t, _tHTML } from 'Bot/utils/lang';

class UpdatePriceBase extends React.PureComponent {
  static contextType = ActionSheetController;
  constructor(props) {
    super(props);
    this.tipDialogRef = React.createRef();
    this.state = {
      info: {
        feeRate, // 交易手续费
        gridProfitRatio: 0, //
        isNotice: false, // 显示hot
        minimumInvestment: 5, // 最小投资额
      },
      balance: 0,
      lastTradedPrice: 0,
      addAmount: 0,
      loading: false,
      fetchStatus: 'none',
    };
  }
  fetchBasicInfo = () => {
    const controllerRef = this.context.current;
    const { rangeState, oldRange, taskId } = controllerRef;
    const { symbolCode, pricePrecision } = controllerRef.symbolInfo;
    const { dispatch } = this.props;
    return dispatch({
      type: 'classicgrid/getCreateInfo',
      payload: {
        symbolCode,
        taskId,
      },
    }).then((info) => {
      // 直接计算出ai参数 区间校验、填写ai需要用到
      this.aiRange = getExtendAIParams({
        oldRange,
        newRange: info,
        rangeState,
        pricePrecision,
      });
      this.setState(
        {
          info,
        },
        () => {
          this.onAISwitch(1);
        },
      );
    });
  };
  componentDidMount = () => {
    this.fetchBasicInfo();
  };
  componentDidUpdate = (prevProps, preState) => {
    this.fetchAddAmount();
  };
  setTickerSymbol = (lastTradedPrice) => {
    if (lastTradedPrice !== this.state.lastTradedPrice) {
      this.setState({
        lastTradedPrice,
      });
    }
  };
  setBalance = (e) => {
    if (+e !== this.state.balance) {
      this.setState({
        balance: +e,
      });
    }
  };
  showTip = (e, langKey) => {
    this.tipDialogRef.current.show(e, langKey);
  };
  fillParam = () => {};
  onAISwitch = (e) => {
    const { form } = this.props;
    if (e === 1) {
      // 设置计算出的ai参数
      this.fillParam();
    } else {
      // 清空
      form.resetFields();
    }
    // form.validateFields();
  };
  checkFormIsOk = () => {
    const { form } = this.props;
    const { max, min, placeGrid } = form.getFieldsValue();
    let errors = form.getFieldsError();
    errors = errors.filter((el) => el.errors?.length).length;
    const isOk = min && max && placeGrid && !errors;
    return isOk;
  };
  fetchAddAmount = () => {
    const { form } = this.props;
    const controllerRef = this.context.current;
    const {
      symbolInfo: { symbolCode },
      taskId,
    } = controllerRef;

    const isOk = this.checkFormIsOk();
    const { addAmount, loading, fetchStatus } = this.state;
    if (!isOk) {
      this.oldCoreParams = null;
      if (addAmount !== 0 || loading !== false || fetchStatus !== 'none') {
        return this.setState(defaultNormalData);
      }
      return;
    }
    const { max, min, placeGrid } = form.getFieldsValue();
    const nowCoreParam = `${min} ${max} ${placeGrid}`;
    if (nowCoreParam !== this.oldCoreParams) {
      this.oldCoreParams = nowCoreParam;
      this.setState({
        fetchStatus: 'fetching',
      });
      this.debounceFetch({
        max,
        min,
        placeGrid,
        taskId,
        symbolCode,
        setMergeState: this.setState.bind(this),
        checkFormIsOk: this.checkFormIsOk.bind(this),
      });
    }
  };
  createOptions = (type = this.ype) => {
    const { form } = this.props;
    const controllerRef = this.context.current;
    const { info, addAmount } = this.state;
    const { max, min, placeGrid } = form.getFieldsValue();
    const {
      symbolInfo: { symbolCode },
      taskId,
    } = controllerRef;

    return {
      type,
      info,
      aiRange: this.aiRange,
      max,
      min,
      placeGrid,
      addAmount,
      symbolCode,
      taskId,
      doPostAPI: () => doPostAPI({ type, min, max, placeGrid, taskId, addAmount }),
    };
  };
  calcParams = () => {
    const controllerRef = this.context.current;
    const { symbolInfo } = controllerRef;
    const { pricePrecision } = symbolInfo;
    const { form } = this.props;
    const { max, min, placeGrid } = form.getFieldsValue();
    const grid = placeGrid ? Number(placeGrid) + 1 : null;
    const { levelPrice } = calcGridPriceLeval(max, min, grid, pricePrecision);
    const gridProfit = calcGridProfitRange(min, max, levelPrice, this.state.info.feeRate);
    return {
      gridProfit,
      levelPrice,
    };
  };
  onCheckConfirm() {
    return new Promise((r, j) => {
      const { form } = this.props;
      form
        .validateFields()
        .then(() => {
          const { fetchStatus } = this.state;
          if (fetchStatus !== 'done' || this.isNotEnough) {
            j();
          } else {
            r();
          }
        })
        .catch((error) => {
          console.log(error);
          j();
        });
    });
  }
}

export default UpdatePriceBase;
