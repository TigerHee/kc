/**
 * Owner: mike@kupotech.com
 */
import { siteCfg } from 'config';
import { pull, postJson } from 'utils/request';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import once from 'lodash/once';
import { _t, _tHTML } from 'Bot/utils/lang';
import { maxBots, routeToBotById } from 'Bot/config';
import { guideStrategyTemplateType } from 'Bot/Module/BotCreate/config';
import DialogRef from 'Bot/components/Common/DialogRef';
import { track, trackClick } from 'src/utils/ga';
import dvaApp from 'utils/createApp';

const prefix = siteCfg['API_HOST.ROBOT'];
// 接口地址前缀
const server = {
  scheduler: `${prefix}/cloudx-scheduler`,
  admin: `${prefix}/cloudx-admin`,
  promotion: `${prefix}/cloudx-promotion`,
  future: '/_api_kumex',
};

class ResponseCodeHandler {
  codeHandlerMap = new Map([
    [240001, () => this.throttleMessage(_t('statusChangeRetry'))], // 马丁加仓状态变化
    [
      370001, // 用户创建机器人最大数量
      () => {
        this.commonDialog({
          title: _t('limitReachedTitle'),
          content: _tHTML('limitReachedContent', { num: maxBots }),
        });
      },
    ], // 马丁加仓状态变化
    [4111, once(() => (window.location.href = `${siteCfg.MAINSITE_HOST}/freeze`))], // 当前账户资金冻结，自动跳转解冻页面
    [
      370003, // 用户清退弹窗
      (code, msg) => {
        this.commonDialog({
          title: _t('importantnotice'),
          content: msg,
        });
      },
    ],
    [
      370005, // IP限制弹窗
      () => {
        this.commonDialog({
          title: _t('3oPPedRHGH6d97TVjjEz81'),
          content: _t('bcRhdxvue5L7JiT3y9adYa'),
        });
      },
    ],
    [
      370004, // 用户没有KYC认证弹窗
      (code, msg) => {
        // 使用trade通用的弹窗
        this.dispatch({
          type: 'user/queryPassiveNotice',
          payload: {
            status: 'KYC_LIMIT',
          },
        }).then((data) => {
          const { content, title, buttonAgree, buttonAgreeWebUrl } = data;
          const tradeResultForSensors = {
            trade_pair: '',
            trade_currency: '',
            trade_type: 'tradingBot',
          };
          // 在交易页（APP对应币种详情，Web对应交易大厅），用户下单调用KYC校验接口时，如果校验未通过，即上报
          track('trade_KYC_intercept', tradeResultForSensors);
          // 打开弹窗
          this.dispatch({
            type: 'dialog/openDialog',
            payload: {
              // 一分钟解锁更多产品与服务
              content,
              // 请您完成身份认证
              title,
              // 立即认证
              buttonText: buttonAgree,
              buttonLink: buttonAgreeWebUrl,
              // 点击确认跳转时上报
              confirmAction: () => {
                track('trade_KYC_intercept_confirm', '1');
              },
              // 点击取消时上报（一般是在子账号情况下）
              cancelAction: () => {
                track('trade_KYC_intercept_cancel', '1');
              },
              // 点击关闭按钮时上报
              closeAction: () => {
                track('trade_KYC_intercept_close', '1');
              },
            },
          });
        });
      },
    ],
    [
      370007, // 交易对挂单太对, 限制了, 尝试其他交易对
      () => {
        this.commonDialog({
          title: _t('prompt'),
          content: _t('symbolusetoomuch'),
          okText: _t('gridwidget6'),
          cancelText: _t('machinecopydialog7'),
          onCancel: () => {
            trackClick(['symbol-use-too-much-cancel', '1']);
          },
          onOk: () => {
            trackClick(['symbol-use-too-much-confirm', '1']);
          },
        });
      },
    ],
    [
      600000, // 印度用户填写pan number
      () => {
        // 使用trade通用的弹窗
        this.dispatch({
          type: 'dialog/updateTaxInfoCollectDialogConfig',
          payload: {
            open: true,
            source: 'tradingbot',
          },
        });
      },
    ],
    [
      600001, // 印度用户税号校验, 引导合约创建
      (code, msg) => {
        this.commonDialog({
          title: _t('prompt'),
          content: msg,
          okText: _t('7Pd9zoX82SkvyHbD6HEaAU'),
          cancelText: _t('machinecopydialog7'),
          onCancel: () => {
            trackClick(['india-pan-number-check-to-future-cancel', '1']);
          },
          onOk: () => {
            trackClick(['india-pan-number-check-to-future-confirm', '1']);
            // 根据当前策略， 引导到合约类型策略创建
            const guideType = guideStrategyTemplateType();
            if (guideType) {
              this.dispatch(routeToBotById(guideType, 'XBTUSDTM'));
            }
          },
        });
      },
    ],
    [
      4001, // data not match given regex! 交易对和策略不匹配的情况， 切换创建到列表
      (code, msg) => {
        if (msg?.includes('data not match given regex')) {
          this.deBounceBackList();
        }
      },
    ],
  ]);
  dispatch = (arg) => {
    const dispatch = dvaApp._store?.dispatch;
    if (dispatch) {
      return dispatch(arg);
    }
  };
  deBounceBackList = debounce((message) => {
    this.dispatch({
      type: 'BotStatus/backList',
      payload: {
        hasToast: true,
      },
    });
  }, 1500);

  throttleMessage = throttle((message) => {
    this.dispatch({
      type: 'notice/feed',
      payload: {
        type: 'message.error',
        message,
      },
    });
  }, 500);

  commonDialog = throttle(({ title, content, ...rest }) => {
    DialogRef.info({
      title,
      content,
      okText: _t('gridform24'),
      cancelText: null,
      ...rest,
    });
  }, 500);
  excludeCodes = [401]
  routeAction = (err) => {
    const code = +err?.status || +err?.code;
    const msg = err?.msg || err?.message || code;
    if (this.excludeCodes.includes(code)) {
      return;
    }
    const handler = this.codeHandlerMap.get(code);
    if (handler) {
      handler(code, msg);
    } else {
      this.throttleMessage(msg);
    }
  };
}
const responseCodeHandler = new ResponseCodeHandler();
export const T = responseCodeHandler;

const fetchFactory = (serverType) => {
  const catchHandler = (err) => {
    // 针对状态码做特殊提示
    responseCodeHandler.routeAction(err);
  };

  const before = (url, rest = [], fetchTypeFunc) => {
    // 0: 可能是对象/数组, 1可能是TOAST_NO
    let _params = {};
    let isNotShowToast = false;
    if (!Array.isArray(rest[0])) {
      // 对象
      _params = { ...rest[0] };
      isNotShowToast = _params?.TOAST_NO === true;
      if (isNotShowToast) {
        delete _params?.TOAST_NO;
      }
    } else {
      // 数组
      _params = rest[0];
      isNotShowToast = rest[1] === 'TOAST_NO';
    }

    return fetchTypeFunc(`${serverType}${url}`, _params, ...rest.slice(1))
      .then((res) => {
        // 测试代码
        // if (url.includes('/task/user/query')) {
        //   return Promise.reject({
        //     code: 600001,
        //     data: {},
        //     msg: 'test dialog',
        //   });
        // }
        return res;
      })
      .catch((err) => {
        !isNotShowToast && catchHandler(err);
        return Promise.reject(err);
      });
  };
  return {
    get: (url, ...rest) => {
      return before(url, rest, pull);
    },
    post: (url, ...rest) => {
      return before(url, rest, postJson);
    },
  };
};

export const RobotHttp = fetchFactory(server.scheduler);
export const RobotAdminHttp = fetchFactory(server.admin);
export const RobotPromotionHttp = fetchFactory(server.promotion);
export const FuturesHttp = fetchFactory(server.future);
