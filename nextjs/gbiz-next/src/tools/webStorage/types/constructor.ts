/**
 * Owner: garuda@kupotech.com
 */
export interface Serializer {
  serialize: (value: any, callback: any) => void;
  deserialize: (value: string) => any;
  stringToBuffer: (serializedString: string | any[]) => ArrayBuffer;
  bufferToString: (buffer: any) => string;
}

export interface DbInfo {
  maxItemSize?: number | undefined;
  timeout?: number;
  name: string;
  db: any;
  version?: string;
  storeName: string;
  serializer: Serializer;
  keyPrefix: string;
}

export interface DriverFuncType {
  _initDriver: boolean;
  _ready: null;
  _driverSet: any;
  _dbInfo: DbInfo;
  _initReady: any;
  _defaultConfig: any;
  _driver: string;
  _initStorage: () => Promise<any>;
  _support: boolean;
  ready: any;
  config: any;
  iterate: (iterator: any, callback: any) => Promise<any>;
  getItem: (getKey: any, callback: any) => Promise<any>;
  setItem: (setKey: any, value: any, callback: any) => Promise<any>;
  removeItem: (rmKey: any, callback: any) => Promise<any>;
  clear: (callback: any) => Promise<any>;
  length: (callback: any) => Promise<any>;
  key: (n: any, callback: any) => Promise<any>;
  keys: (callback?: any) => Promise<any>;
  dropInstance: (options: any, callback: any) => Promise<any>;
}

export interface Config {
  description?: string;
  driver?: Array<any>;
  name: string;
  size?: string | number;
  storeName: string;
  version?: number;
  [key: string]: any;
}
