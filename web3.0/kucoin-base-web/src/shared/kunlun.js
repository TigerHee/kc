import * as kunlun from '@kc/web-kunlun';
import { getProject } from '@utils/project';
import { futuresKunlun } from './kunlunCfg/futures';
import { unifiedKunlun } from './kunlunCfg/unified';

kunlun.init({
  // 需要在 kunlun 上重点关注的接口
  apis: [
    // ================== 合约 start ==================
    ...futuresKunlun,
    // ================== 合约 end ==================
    // ================== 统一账户 start ==================
    ...unifiedKunlun,
    // ================== 统一账户 end ==================
    // cashback-referral-web 重点关注api start
    '/_api/campaign-center/invitation-support-v2/open-reward', // 免费赚币-用户抽奖
    '/_api/campaign-center/invitation-support-v2/appoint', // 免费赚币-用户预约下一次新活动
    '/_api/campaign-center/invitation-support-v2/obtain-reward', // 免费赚币-用户提现
    '/_api/growth-campaign/user/prize/distribution/result', // gemslot-查询发奖结果
    '/_api/growth-campaign/project/reserve', // gemslot-活动预约
    '/_api/growth-campaign/project/enroll', // gemslot-活动报名
    '/_api/growth-campaign/award-pool', // gemslot-活动详情
    '/_api/growth-campaign/api/campaign/list', // 活动中心
    // cashback-referral-web 重点关注api end

    // =============================== Broker start ===============================
    '/_api/broker/broker/my/commission/download', // 导出佣金记录
    '/_api/broker/broker/invite/code/add', // 新建邀请码
    '/_api/broker/broker/invite/code/edit/default', // 设置为默认邀请码
    // =============================== Broker end ===============================

    // 现金礼包接口
    '/_api/campaign-center/fission/reward/open/reward', // 裁开礼包
    '/_api/campaign-center/fission/reward/v2/obtain/reward', // 领取礼包
    '/_api/campaign-center/fission/reward/withdraw', // 礼包提现

    // 福利中心接口
    '/_api/platform-markting/v2/quest/prize/draw', // 老客-领取奖励
    '/_api/platform-reward/newcomer/user/limit-and-financial/prize-draw', // 新客-限时任务领取奖励
    '/_api/platform-reward/newcomer/user/prize/draw', // 新客-成长任务领取奖励
    '/_api/platform-markting/quest/signUp', // 老客-任务报名
    '/_api/platform-markting/rewardWindow/getUserNoPopupReward', // 新老客奖励弹窗
    '/_api/platform-reward/newcomer/user/prize/popup-list', // 新老客奖励弹窗
    '/_api/platform-markting/v2/quest/withdraw/apply', // 老客申请-提现
    '/_api/platform-reward/newcommer/user/withdraw/apply', // 新客申请-提现

    // 交易赛活动接口
    '/_api/platform-new-activity/trade-competition/sign-up', //立即报名

    '/_api/ucenter/sign-up-phone', // 手机号注册
    '/_api/ucenter/sign-up-email', // 邮箱注册
    '/_api/ucenter/sign-up-phone-email', // 手机号注册必须绑定邮箱
    '/_api/ucenter/v2/aggregate-login', // 登录
    '/_api/ucenter/v2/login-validation', // 登陆校验V2版本
    '/_api/ucenter/v2/external-login', // 三方账号 第一步登陆
    '/_api/ucenter/send-validation-code', // 发送验证码
    '/_api/ucenter/login-validation', // 二次校验
    '/_api/ucenter/user/password', // 设置密码
    '/_api/cyber-truck-vault/v2/api-key', // 创建 API Key
    '/_api/ucenter/v2/sub/user/create', // 新建子账号 - 普通子账号
    '/_api/ucenter/v2/kyc/sub/user/create', // 新建子账号 - 托管子账号
    '/_api/kyc/web/kyc/finish/jumio', // 完成 Jumio KYC 验证
    '/_api/kyc/web/kyc/finish/sumsub', // 完成 Sumsub KYC 验证
    '/_api/kyc/web/kyc/ng/finish', // 完成 NG KYC 验证
    '/_api/kyc/web/kyc/finish/lego', // 完成 Lego KYC 验证
    '/_api/compliance-center-flow/compliance/flow/render', // KYC 中台获取流程配置
    '/_api/compliance-center-flow/compliance/flow/after', // KYC 中台完成流程
    '/_api/kyc/web/kyc/submit/pan', // KYC 提交pan码和panCard


    // 合规相关接口
    '/_api/compliance-biz/web/compliance/rule', // 获取展业中台接口
    '/_api/universal-core/ip/country', // 获取国家IP接口
    '/_api/growth-config/get/client/config/codes', // 获取营销配置的接口主要是关注这个query的接口 businessLine=ucenter&codes=web202312homepagePop
    '/_api/ucenter/compliance/rules', // 后端对接的展业中台获取营销相关的规则

    // marketing-growth-web 重点关注api start
    '/_api/promotion/invitation/affiliateInfo', // 合伙人信息
    '/_api/promotion/affiliate/apply', // 提交合伙人申请
    '/_api/growth-affiliate/v2/affiliate/rebate/daily-stat', // 合伙人系统-每日统计
    '/_api/growth-affiliate/my/rebate/send/record', // 合伙人系统-我的佣金-佣金发放记录
    '/_api/growth-affiliate/invitation/code/list', // 合伙人系统-邀请码列表
    '/_api/growth-affiliate/invitation/code/add', // 合伙人系统-创建邀请码
    '/_api/growth-affiliate/invitation/url/list', // 合伙人系统-邀请链接列表
    '/_api/growth-affiliate/invitation/url/add', // 合伙人系统-创建邀请链接
    '/_api/growth-affiliate/campaign/invitation/lego/list', // 合伙人系统-Lego活动列表
    '/_api/growth-affiliate/campaign/invitation/ads/list', // 合伙人系统-非Lego活动列表
    '/_api/growth-affiliate/affiliate-multi/invitation/overview', // 合伙人系统-多级返佣信息
    '/_api/growth-affiliate/affiliate-multi/invitation', // 多级返佣-邀请成为多级返佣合伙人详情
    '/_api/growth-affiliate/affiliate-multi/accept', // 多级返佣-接受成为多级返佣合伙人邀请
    '/_api/growth-affiliate/affiliate-multi/reject', // 多级返佣-拒绝成为多级返佣合伙人邀请
    // marketing-growth-web 重点关注api end

    '/_api/seo-support/tdk/queryTdk', // tdk接口

    // =============================== 资产中心 start ===============================
    '/_api/account-front/query/main-account', // 用户储蓄账户所有币种的余额
    '/_api/asset-front/v3/query/trade-account', // 查询用户交易账户所有币种的余额
    '/_api/asset-front/currency/chain-info', // 币链列表
    '/_api/payment/deposit-address/add', // 添加充值地址
    '/_api/payment/deposit-address/get', // 获取充值地址
    '/_api/payment/withdraw-address/validate/v3', // 检查提现地址
    '/_api/payment/withdraw/quota', // 获取用户提现配额
    '/_api/payment/withdraw/info-confirm', // 获取提币二次确认弹窗内容,
    '/_api/payment/withdraw/apply', // 通过地址提起提现
    '/_api/payment/v2/withdraw/apply', // 通过地址提起提现(新验证)
    '/_api/payment/inner/withdraw/apply', // 站内发起提现
    '/_api/payment-invoice/withdraw/apply', // 通过发票提起提现
    '/_api/pool-staking/spot-trade/earn-balance', // 查询用户理财余额
    '/_api/payment/withdraw/fee-and-amount/get', // 获取反算后的金额
    '/_api/currency/site/transfer-currencies', // 获取所有币种
    '/_api/payment/query/currency-balance', // 查询用户单个currency指定accountType、tag的账户信息
    '/_api/asset-front/assets/detail-in-currency', // 币种维度资产列表
    '/_api/account-biz-front/self-transfer', // 账户间划转
    '/_api/account-biz-front/v2/transfer/query-balance', // 查询可划转余额
    '/_api/account-biz-front/account/imputation', // 资金归集
    '/_api/account-biz-front/sub-transfer', // 子母账号划转
    '/_api/payment/apply/withdraw/fee', // 获取币种下所有链的提现手续费
    '/_api/payment/simple/withdraw/quota', // 用户获取提现配额
    '/_api/account-biz-front/transfer/currencies', // 查询账户支持币种列表
    '/_api/kucoin-web-front/v3/asset/overview', // 资产概览(旧，先观察，11月下线)
    '/_api/mobile-api-asset/v3/asset/overview', // 资产概览（新，最近迁移）
    '/_api/kucoin-web-front/v3/sub/asset/overview', // 子账户概览(旧，先观察，11月下线)
    '/_api/kucoin-web-front/v3/sub/asset/overview', // 子账户概览（新，最近迁移）
    '/_api/account-biz-front/v2/transfer/currencies', // 获取划转可用币种余额(主要使用账户开通功能)
    '/_api/account-biz-front/combine/transfer/currencies', // 获取账户支持的划转币种及信息
    '/_api/account-biz-front/combine/transfer', // 账户顺序组合划转
    // =============================== 资产中心 end ===============================

    // =============================== 现货/杠杆 start ===============================
    '/_api/trade/orders/cancel', // 撤销全部订单
    '/_api/advanced-order/stoporder/cancel', // 撤销止盈止损单
    '/_api/trade/orders', // 发布委托
    '/_api/advanced-order/oco/order', // OCO 下单
    '/_api/advanced-order/tso/order', // 跟踪委托下单
    '/_api/margin-polymerize/orders', // 发布委托（杠杆风险限额）
    '/_api/advanced-order/stoporder', // 止损单
    '/_api/margin-polymerize/margin/stop-order', // 杠杆借币下单
    '/_api/margin-polymerize/auto/borrow/order', // 杠杆非止损自动借币单
    '/_api/margin-polymerize/margin/oco-order', // 杠杆 OCO 下单
    '/_api/margin-polymerize/margin/tso-order', // 杠杆跟踪委托下单
    '/_api/advanced-order/saving/order', // 使用理财资产 下单
    // =============================== 现货/杠杆 end ===============================

    // =============================== 订单 start ===============================
    '/_api/trade-front/order/getUserOrders', // 查询当前委托
    '/_api/advanced-order/stoporder/getUserStopOrders', // 查询止损委托
    '/_api/advanced-order/twap/order', // 查询 twap订单
    '/_api/trade-front/orders', // 查询历史委托记录
    '/_api/trade-front/fills', // 查询成交明细
    // =============================== 订单 end ===============================

    // =============================== 杠杆 start ===============================
    '/_api/margin-position/position', // 开通杠杆
    '/_api/margin-position/borrow/loan', // 全仓手动借币
    '/_api/margin-position/borrow/repay', // 全仓手动还币
    '/_api/margin-position/position/one-click-liquidation', // 全仓一键平仓
    '/_api/margin-isolated-position/borrow/loan', // 逐仓手动借币
    '/_api/margin-isolated-position/borrow/repay', // 逐仓手动还币
    '/_api/margin-isolated-position/position/one-click-liquidation', // 逐仓一键平仓
    '/_api/speedy/order/quote', // 闪兑市价下单
    '/_api/flash-convert/limit/order', // 闪兑限价下单
    '/_api/flash-convert/limit/cancel', // 闪兑限价撤单
    '/_api/margin-option/outer/option/user/agreement/open', // 开通期权
    '/_api/margin-option/outer/option/order/place', // 期权下单
    '/_api/margin-option/outer/option/order/close', // 期权平仓
    '/_api/margin-option/outer/option/position/list', // 期权持仓列表
    '/_api/speedy/activity/order', // 闪兑USDD下单
    '/_api/margin-position/position/detail', // 全仓资产查询接口
    '/_api/margin-isolated-position/position/position-by-tag', // 逐仓资产查询接口
    // =============================== 杠杆 end ===============================

    // =============================== Alpha start ===============================
    '/alpha-config/user/alpha/symbols', // 根据base查询所有quote币种
    '/alpha-trade/alpha/orders', // 获取alpha订单
    '/alpha-trade/alpha-account/currency-pair-balance', // 查询用户交易Base/quote交易对币种余额
    '/alpha-trade/alpha/sign-term', // 签署协议
    '/alpha-trade/alpha/route/swap', // 市价下单
    // =============================== Alpha end ===============================

    // =============================== public-web start ===============================
    '/_api/gem-staking/gempool/staking/campaign/rewards', // gempool - 收益领取接口
    '/_api/gem-staking/gempool/staking/campaign/pool/claim', // gempool - 收益领取接口-矿池维度
    '/_api/gem-staking/gempool/staking/campaign/order', // gempool - 质押接口
    '/_api/gem-staking/gempool/staking/campaign/redeem', // gempool - 赎回接口
    '/_api/gem-staking-front/gempool/staking/campaign/examSubmit', // gempool - 答题校验接口

    '/_api/grey-market-trade/grey/market/orderBook', // preMarket - 根据币种查询订单
    '/_api/grey-market-trade/grey/market/history', // preMarket - 根据币种查询已完成订单
    '/_api/grey-market-trade/grey/market/order/create', // preMarket - 挂单
    '/_api/grey-market-trade/grey/market/order/take', // preMarket - 吃单
    '/_api/grey-market-trade/grey/market/split/order/create', // preMarket - 挂单
    '/_api/grey-market-trade/grey/market/order/cancel', // preMarket - 撤单
    '/_api/grey-market-trade/grey/market/order', // preMarket - 查询用户订单
    '/_api/grey-market-trade/grey/market/split/config', // preMarket - 查询用户订单
    '/_api/grey-market-trade/grey/market/break/apply', // preMarket - 主动违约申请/申请取消订单
    '/_api/grey-market-trade/grey/market/break/agree', // preMarket - 违约agree
    '/_api/grey-market-trade/grey/market/break/reject', // preMarket - 违约拒绝

    '/_api/currency-front/gem/customer/banner', // gemspace - 查询banner

    '/_api/activity-rank/v1/currency_vote_project/create', // gemvote - 用户发起项目提名
    '/_api/activity-rank/v1/currency_vote/vote', // gemvote - 用户投票
    '/_api/activity-rank/v1/currency_vote/get_available_votes', // gemvote - 获取用户可用票数 (登陆下调用)
    '/_api/activity-rank/v1/currency_vote/claim_kcs_hold_reward', // gemvote - 领取KCS持仓奖励 (登陆下调用)

    '/_api/spotlight/spotlight6', // spotlight6 - 领取KCS持仓奖励 (登陆下调用)

    '/_api/spotlight/spotlight7/formal/sub', // spotlight7 - 认购期申购
    '/_api/spotlight/spotlight7/presale/sub', // spotlight7 - 预售期申购
    '/_api/spotlight/spotlight7/agreement', // spotlight7 - 签署协议
    '/_api/spotlight/spotlight7/countryAgreement', // spotlight7 - 签署国家确认协议
    // =============================== public-web end ===============================
    // =============================== 机器人 start ===============================
    '/_api_robot/cloudx-scheduler/v1/task/cancel', // 关闭
    '/_api_robot/cloudx-scheduler/v1/task/update/run_param', // 修改
    '/_api_robot/cloudx-scheduler/v1/task/user/query', // 运行中
    '/_api_robot/cloudx-scheduler/v1/profit/own/web-page', // 历史记录
    '/_api_robot/cloudx-scheduler/v1/task/run', // 创建
    '/_api_robot/cloudx-scheduler/v1/task/run_params', // 运行策略详情参数
    '/_api_robot/cloudx-scheduler/v1/user/info', // 用户信息
    // =============================== 机器人 end ===============================

    // =============================== 币服优化 start ===============================
    '/_api/kucoin-web-front/v2/transfer-currencies',
    '/_api/currency/v3/symbols',
    // =============================== 币服优化 end ===============================

    // =============================== 风控验证中心 start ===============================
    '/_api/risk-validation-center/v1/available/verify', // 检查风控组件是否可用
    '/_api/risk-validation-center/v1/security/validation/combine', // 获取验证方案
    '/_api/risk-validation-center/v1/security/validation/risk/verify', // 验证
    // =============================== 风控验证中心 end ===============================

    // =============================== 理财 start ===============================
    '/_pxapi/pool-staking/v3/locks', // 固收锁仓/赎回
    '/_pxapi/struct-main/v1/orders', // 结构化锁仓
    '/_pxapi/struct-main/v2/order/early-redemption', // 结构化赎回
    '/_pxapi/struct-main/v1/orders/detail', // 结构化订单详情
    '/_pxapi/pool-account/v3/hold-asset-detail', // 固收持有详情
    '/_pxapi/pool-aggs/v1/hold-currencies/assets', // 持有列表，币种维度
    '/_pxapi/pool-aggs/v2/hold-assets', // 持有列表
    // =============================== 理财 end ===============================

    // =============================== 支付 start ===============================
    '/_api/otc/order/buy', // P2P买币下单
    '/_api/otc/order/sell', // P2P卖币下单
    '/_api/payment-api/api/v3/payinOrder/create', // 法币充值下单
    '/_api/payment-api/api/v3/create_payout_transaction', // 法币提现下单
    '/_api/payment-thirdparty/channels/trade/order', // 三方买币下单
    '/_api/payment-api/pmtapi/v2/fastBuy/bankcard/trade', // 卡买币下单
    '/_api/payment-api/api/v2/balance/trade/buy', // 余额买币下单
    '/_api/payment-api/api/v2/crypto/balance/trade', // 余额卖币下单
    '/_api/payment-api/pmtapi/v2/orders/trade', // Popular Pay下单
    '/_api/kucoinpay-api/user/pay', // KuCoin Pay收银台付款
    '/_api/kucoinpay-api/user/payAuth', // KuCoin Pay收银台付款新版
    // =============================== 支付 end ===============================
  ],
  site: window._BRAND_SITE_ || 'KC',
  project: getProject,
});

export default kunlun;
