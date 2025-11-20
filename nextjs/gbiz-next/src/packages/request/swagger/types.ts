/**
 * Owner: sean.shi@kupotech.com
 */
import { AxiosHeaders } from 'axios';
import type { RequestConfig } from '../types'

// 查询序列化器类型
export type QuerySerializer = (query: Record<string, unknown>) => string;

// 序列化选项接口
interface SerializerOptions<T> {
  /**
   * @default true
   */
  explode: boolean;
  style: T;
}

// 查询序列化器选项
export interface QuerySerializerOptions {
  allowReserved?: boolean;
  array?: SerializerOptions<ArrayStyle>;
  object?: SerializerOptions<ObjectStyle>;
}

// 样式类型定义
type ArrayStyle = 'form' | 'spaceDelimited' | 'pipeDelimited';
type ObjectStyle = 'form' | 'deepObject';
type MatrixStyle = 'label' | 'matrix' | 'simple';

export type ArraySeparatorStyle = ArrayStyle | MatrixStyle;
export type ObjectSeparatorStyle = ObjectStyle | MatrixStyle;

// 序列化原始选项
interface SerializePrimitiveOptions {
  allowReserved?: boolean;
  name: string;
}

export interface SerializePrimitiveParam extends SerializePrimitiveOptions {
  value: string;
}

export interface SerializeOptions<T> extends SerializePrimitiveOptions, SerializerOptions<T> {}

// 路径序列化器
export interface PathSerializer {
  path: Record<string, unknown>;
  url: string;
}


// 配置接口
export interface Config extends RequestConfig {
  /**
   * 用于序列化请求查询参数的函数。默认情况下，数组将以表单样式展开，
   * 对象将以深对象样式展开，保留字符将进行百分比编码。
   *
   * 如果使用原生的 paramsSerializer() Axios API 函数，此方法将无效。
   *
   * {@link https://swagger.io/docs/specification/serialization/#query 查看示例}
  */
  querySerializer?: QuerySerializer | QuerySerializerOptions;
}

// 数据形状接口
export interface TDataShape {
  data?: unknown;
  headers?: unknown;
  path?: unknown;
  params?: unknown;
  url?: string;
}

// 请求选项接口
export interface RequestOptions<Url extends string = string> extends Config {
  url: Url;
}

// 请求结果类型
export type RequestResult<TData = unknown> = Promise<
  // 如果接口响应 TData 有 data 属性，则返回 TData，否则返回 void
  TData extends { data?: any } ? TData : TData
>;

// 请求函数类型
export type RequestFn = <TData = unknown>(
  options: Omit<RequestOptions, 'method'> & Pick<Required<RequestOptions>, 'method'>,
) => RequestResult<TData>;

// 构建 URL 函数类型
export type BuildUrlFn = <
  TData extends {
    data?: unknown;
    path?: Record<string, unknown>;
    params?: Record<string, unknown>;
    url?: string;
    querySerializer?: QuerySerializer | QuerySerializerOptions,
  },
>(
  options: Pick<TData, 'url' | 'params' | 'data'> & Partial<Pick<TData, 'querySerializer' | 'path'>>,
) => string;

// 工具类型：排除指定键
type OmitKeys<T, K> = Pick<T, Exclude<keyof T, K>>;

// 选项类型
export type Options<TData extends TDataShape = TDataShape> = OmitKeys<
  RequestOptions,
  'data' | 'path' | 'params' | 'url'
> &
  Omit<TData, 'url' | 'headers' | 'params' | 'data'> & { headers?: TData['headers'] | AxiosHeaders | any };
