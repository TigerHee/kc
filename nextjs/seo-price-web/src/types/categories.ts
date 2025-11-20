interface Decimal {
  length: number;
  group: number;
}

interface Currency {
  currencyType: string;
  innerWithdrawMinFee: string;
  isDebitEnabled: boolean;
  withdrawRemark?: string;
  withdrawDisabledTip: null | string;
  precision: number;
  contractAddress: string;
  orgAddress: string;
  makerFeeCoefficient: string;
  type: number;
  isDepositEnabled: boolean;
  withdrawMinSize: string;
  txUrl: string;
  userAddressName: string;
  createdAt: number;
  feeCategory: number;
  currencyName: string;
  isDisplayDeposit: boolean;
  currency: string;
  depositMinSize: string;
  preConfirmationCount: string;
  takerFeeCoefficient: string;
  iconUrl: string | null;
  isDisplayWithdraw: boolean;
  preDepositTip: string;
  preWithdrawTip: string;
  withdrawMinFee: string;
  chainName: string;
  isChainEnabled?: string;
  isDigital: boolean;
  walletPrecision: string;
  chainFullName: string;
  depositDisabledTip: null | string;
  showDepositRemark: string;
  confirmationCount: string;
  withdrawFeeRate: string;
  name: string;
  depositRemark: string;
  showWithdrawRemark: string;
  isWithdrawEnabled: boolean;
  isMarginEnabled: boolean;
  status: string;
  key: string;
  coin: string;
  step: string;
  decimals: Decimal[];
  isContractEnabled: boolean;
  isPoolEnabled: boolean;
}

export interface Categories {
  coinDict: {
    [key: string]: Partial<Currency>; // 键为币种简称，值为币种信息
  }
}