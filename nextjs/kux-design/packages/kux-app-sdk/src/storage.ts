import { globalObject } from './utils';
import { is } from './is';
/**
 * 存储命名空间
 */
const defaultNamespace = 'kucoinv2';

/**
 * 为key添加命名空间前缀
 * @param key 存储key
 */
function prefixKey(key: string, { namespace = defaultNamespace, isPublic = false }: IStorageOptions) {
  const sitePrefix = isPublic ? '' : `!_${globalObject._BRAND_SITE_ ||''}_`;
  return `${sitePrefix}${namespace}_${key}`;
}

/**
 * 内存存储
 **/
const localMemory: Record<string, any> = {};
const memoryStorage = {
  getItem(key: string) {
    return localMemory[key];
  },
  setItem(key: string, value: any) {
    localMemory[key] = value;
  },
  removeItem(key: string) {
    delete localMemory[key];
  },
};

interface IStorageObject  {
  getItem: (key: string) => any,
  setItem: (key: string, value: any) => void,
  removeItem: (key: string) => void,
}

/**
 * 获取全局存储对象, 兼容不同的浏览器环境, 使用内存存储作为备选
 * @param storeName 存储对象名称, 如 localStorage, sessionStorage
 */
export function getStorage(storeName: string): IStorageObject {
  // 若浏览器不允许使用localStorage或sessionStorage, 比如隐身模式的iframe 中, 则会抛出异常
  //  若用户使用了特殊插件禁用了localStorage或sessionStorage, 则会返回null 或 undefined
  try {
    const storage = globalObject[storeName]
    if (storage && is(storage, 'object')) {
      return storage as IStorageObject
    }
    console.warn(`[storage]${storeName} is null or undefined`)
    return memoryStorage
  } catch (error) {
    console.warn(`[storage]${storeName} not available`, error)
    return memoryStorage
  }
}

/**
 * 存储对象map, localStorage 或 sessionStorage 不可用时使用内存存储替代
 */
const storageObjectMap: Record<IStorageArea, IStorageObject> = {
  local: getStorage('localStorage'),
  session: getStorage('sessionStorage'),
  memory: memoryStorage,
}

export type IStorageArea = 'local' | 'session' | 'memory';

export interface IStorageOptions {
  /**
   * 存储的区域
   * * local: localStorage, 若不可用则回退至 sessionStorage 或 memory
   * * session: sessionStorage, 若不可用则回退至 memory
   * * memory: 内存
   */
  area: IStorageArea
  /**
   * 命名空间, 及底层存储key的前缀, 默认 'kucoinv2'
   */
  namespace?: string
  /**
   * 是否公开存储, 即不使用站点前缀, 默认为 false
   * 仅在共享站中需要共享的信息(如kc_theme) 才需要将该值设置为true
   * @default false
   */
  isPublic?: boolean
}

const defaultStorageOptions: IStorageOptions = {
  area: 'local',
  namespace: defaultNamespace,
}

/**
 * 从指定的存储区域中操作
 * @param options 存储设置, 可选, 默认为localStorage, ns 为 kucoinv2
 * @param key 存储key
 * @param value 值, 为空时获取,  为null | undefined 时删除, 否则设置
 */
export function storage(key: string, value?: any): any
export function storage(options: IStorageOptions, key: string, value?: any): any
export function storage(options: IStorageOptions | string, key: string | any, value?: any): any {
  let opt: IStorageOptions
  let storeKey: string
  let storeValue: any = undefined
  let hasValue = true
  if (is(options, 'object')) {
    opt = Object.assign({}, defaultStorageOptions, options); 
    storeKey = key
    storeValue = value
    hasValue = arguments.length >= 3
  } else {
    opt = defaultStorageOptions
    storeKey = options
    storeValue = key
    hasValue = arguments.length >= 2
  }
  if (hasValue) {
    if (is(storeValue, 'nullable')) {
      return removeItem(storeKey, opt)
    }
    setItem(storeKey, storeValue, opt)
  } else {
    return getItem(storeKey, opt)
  }
}

/** 内部获取操作 */
function getItem(key: string, options: IStorageOptions) {
  const val = storageObjectMap[options.area].getItem(prefixKey(key, options));
  if (is(val, 'nullable')) return val
  try {
    return JSON.parse(val)
  } catch (error) {
    // 若解析失败, 则直接返回原始值
    return val
  }
}

/** 内部设置操作 */
function setItem(key: string, value: any, options: IStorageOptions) {
  try {
    // 为了保持一致性, 存储的值统一使用JSON字符串化
    storageObjectMap[options.area].setItem(
      prefixKey(key, options),
      JSON.stringify(value)
    );
  } catch (error) {
    // 序列化/保存失败, 打印日志, 不影响整体流程
    console.warn(`[storage]setItem error`, error)
  }
}

/** 内部移除操作 */
function removeItem(key: string, options: IStorageOptions) {
  storageObjectMap[options.area].removeItem(prefixKey(key, options));
}


