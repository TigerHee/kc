/**
 * Owner: borden@kupotech.com
 */
import { pull } from 'utils/request';

const riskPrefix = '/trade-front';

/**
 * 获取交易所所有交易对
 *
 * @param base    string 基础币种，如果market不为空，此参数将无效
 * @param market  string 交易区
 */
export async function pullSymbols({ base, market }) {
  return pull('/currency/site/symbols', { base, market });
}

/**
 * 获取某个交易对信息
 *
 * @param code    string 交易对
 * @param symbol  string 交易对 如：KCS-BTC
 */
export async function pullSymbol({ code, symbol }) {
  return pull('/currency/site/symbol/get', { code, symbol });
}

/**
 * 获取某个币种的风险提示
 *
 * @param symbol 币种
 */

export async function pullSymbolsRiskTip(params) {
  return pull(`${riskPrefix}/risk/tips/${params?.currentSymbol}`);
}

/*
 * 获取币种信息（V2）
 * @param {{
 *  coin: string, [币种]
 *  symbol: string, [BTC-USDT]
 *  legalCurrency: string, [法币:如USD]
 *  source: 'H5' | 'WEB', [移动端还是WEB端]
 * }} params
 */
export const getCoinInfo = (params) => {
  return pull(
    `/quicksilver/universe-currency/symbols/info/${params.coin}`,
    params,
  );
};

/**
 * 获取0.1U 币种字典
 *
 * @param  无入参
 */
export async function pullUnitDic() {
  return pull('/trade/v1/order/minimum-funds');
}

/**
 * 获得币种基础信息
 *  * @param {{
 *  symbol: string, [BTC-USDT]
 * }} params
 */
export function getTradeBasicInfo(params) {
  return pull('/trade-front/trade-basic-info', params);
}
