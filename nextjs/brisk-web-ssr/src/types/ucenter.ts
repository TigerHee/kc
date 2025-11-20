export interface IUser {
  isPhoneValidate?: boolean;
  honorLevel?: number;
  language?: string;
  csrf?: string;
  type?: number;
  emailValidate?: boolean;
  permissionTrades?: any[];
  uid?: number;
  createdAt?: number;
  isEmailValidate?: boolean;
  referralCode: string;
  currency?: string;
  subLevel?: number;
  tenant?: string;
  email?: string;
  tradeType?: number;
  isNeedDepositValidate?: boolean;
  siteType?: string;
  lastLoginCountry?: string;
  timeZone?: string;
  lastLoginAt?: number;
  needDepositValidate?: boolean;
  subType?: number;
  balanceCurrency?: string;
  phoneValidate?: boolean;
  status?: number;
}

export interface IUserViewData extends IUser {
  isSub?: boolean;
}
