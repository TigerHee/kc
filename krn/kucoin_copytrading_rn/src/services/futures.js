import {API_HOST_CONFIGS} from 'config';
import {pull} from 'utils/request';

const futuresHost = API_HOST_CONFIGS.apiFuturesHost;

const KM_CONTRACT = `${futuresHost}/kumex-contract`;
const KM_CURRENCY = `${futuresHost}/currency`;

// 所有合约默认采用 includeNotFirstOpened = true
export const getFuturesSymbolsAll = ({includeNotFirstOpened = true} = {}) => {
  return pull(`${KM_CONTRACT}/contracts`, {includeNotFirstOpened});
};

// 合约结算价格 精度相关信息
export const getContractCurrencies = ({includeNotFirstOpened = true} = {}) => {
  return pull(`${KM_CURRENCY}/currencies`, {includeNotFirstOpened});
};
