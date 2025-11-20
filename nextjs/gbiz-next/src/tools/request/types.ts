/**
 * Owner: sean.shi@kupotech.com
 */
import type { AxiosStatic, CreateAxiosDefaults } from 'axios';

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

// 认证相关类型
export type AuthToken = string | undefined;

export interface Auth {
  /**
   * 使用请求的哪个部分发送认证信息
   *
   * @default 'header'
   */
  in?: 'header' | 'query' | 'cookie';
  /**
   * 头部或查询参数名称
   *
   * @default 'Authorization'
   */
  name?: string;
  scheme?: 'basic' | 'bearer';
  type: 'apiKey' | 'http';
}

// 请求体序列化器
type BodySerializer = (body: any) => any;

// 核心配置接口
export interface CoreConfig {
  /**
   * 认证令牌或返回认证令牌的函数。解析的值将根据其安全数组的定义添加到请求负载中。
   */
  auth?: ((auth: Auth) => Promise<AuthToken> | AuthToken) | AuthToken;
  /**
   * 用于序列化请求体参数的函数。默认情况下，将使用 JSON.stringify()。
   */
  bodySerializer?: BodySerializer | null;
  /**
   * 包含要预填充到 Headers 对象中的任何 HTTP 头部的对象。
   *
   * {@link https://developer.mozilla.org/docs/Web/API/Headers/Headers#init 查看更多}
   */
  headers?:
    | RequestInit['headers']
    | Record<
        string,
        string | number | boolean | (string | number | boolean)[] | null | undefined | unknown
      >;
  /**
   * 请求方法。
   *
   * {@link https://developer.mozilla.org/docs/Web/API/fetch#method 查看更多}
   */
  method?: 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';
  /**
   * 用于序列化请求查询参数的函数。默认情况下，数组将以表单样式展开，
   * 对象将以深对象样式展开，保留字符将进行百分比编码。
   *
   * 如果使用原生的 paramsSerializer() Axios API 函数，此方法将无效。
   *
   * {@link https://swagger.io/docs/specification/serialization/#query 查看示例}
   */
  querySerializer?: QuerySerializer | QuerySerializerOptions;
  /**
   * 在返回响应数据之前对其进行转换的函数。这对于后处理数据很有用，
   * 例如将 ISO 字符串转换为 Date 对象。
   */
  responseTransformer?: (data: unknown) => Promise<unknown>;
  /**
   * 验证响应数据的函数。如果您想确保响应符合所需的形状，
   * 以便可以安全地传递给转换器并返回给用户，这很有用。
   */
  responseValidator?: (data: unknown) => Promise<unknown>;
}

// 客户端选项
export interface ClientOptions {
  baseURL?: string;
}

// 配置接口
export interface Config<T extends ClientOptions = ClientOptions>
  extends Omit<CreateAxiosDefaults, 'auth' | 'baseURL' | 'headers' | 'method'>,
    CoreConfig {
  /**
   * Axios 实现。您可以使用此选项提供自定义 Axios 实例。
   *
   * @default axios
   */
  axios?: AxiosStatic;
  /**
   * 此客户端发出的所有请求的基础 URL。
   */
  baseURL?: T['baseURL'];
  /**
   * 包含要预填充到 Headers 对象中的任何 HTTP 头部的对象。
   *
   * {@link https://developer.mozilla.org/docs/Web/API/Headers/Headers#init 查看更多}
   */
  headers?:
    | CreateAxiosDefaults['headers']
    | Record<
        string,
        string | number | boolean | (string | number | boolean)[] | null | undefined | unknown
      >;
}

// 数据形状接口
export interface TDataShape {
  body?: unknown;
  headers?: unknown;
  path?: unknown;
  query?: unknown;
  url: string;
}

// 请求选项接口
export interface RequestOptions<Url extends string = string> extends Config {
  /**
   * 要添加到请求中的任何主体。
   *
   * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
   */
  body?: unknown;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  security?: ReadonlyArray<Auth>;
  /**
   * 请求使用的安全机制。
   */
  url: Url;
}

// 请求结果类型
export type RequestResult<TData = unknown> = Promise<
  // 如果接口响应 TData 有 data 属性，则返回 TData，否则返回 void
  TData extends { data?: any } ? TData : TData
>;

// 方法函数类型
type MethodFn = <TData = unknown>(options: Omit<RequestOptions, 'method'>) => RequestResult<TData>;

// 请求函数类型
export type RequestFn = <TData = unknown>(
  options: Omit<RequestOptions, 'method'> & Pick<Required<RequestOptions>, 'method'>,
) => RequestResult<TData>;

// 构建 URL 函数类型
type BuildUrlFn = <
  TData extends {
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    url: string;
  },
>(
  options: Pick<TData, 'url' | 'query' | 'body'> & Options<TData>,
) => string;

// 核心客户端接口
interface CoreClient<
  RequestFnType = never,
  ConfigType = unknown,
  MethodFnType = never,
  BuildUrlFn = never,
> {
  /**
   * 返回最终的请求 URL。
   */
  buildUrl: BuildUrlFn;
  connect: MethodFnType;
  delete: MethodFnType;
  get: MethodFnType;
  getConfig: () => ConfigType;
  head: MethodFnType;
  options: MethodFnType;
  patch: MethodFnType;
  post: MethodFnType;
  put: MethodFnType;
  request: RequestFnType;
}

// 客户端类型
export type Client = CoreClient<RequestFn, Config, MethodFn, BuildUrlFn>;

/**
 * createClientConfig() 函数将在客户端初始化时调用，
 * 返回的对象将成为客户端的初始配置。
 *
 * 您可能希望以这种方式初始化客户端，而不是调用 setConfig()。
 * 例如，如果您使用 Next.js 来确保客户端始终具有正确的值，这很有用。
 */
export type CreateClientConfig<T extends ClientOptions = ClientOptions> = (
  override?: Config<ClientOptions & T>,
) => Config<Required<ClientOptions> & T>;

// 工具类型：排除指定键
type OmitKeys<T, K> = Pick<T, Exclude<keyof T, K>>;

// 选项类型
export type Options<TData extends TDataShape = TDataShape> = OmitKeys<
  RequestOptions,
  'body' | 'path' | 'query' | 'url'
> &
  Omit<TData, 'url' | 'headers' | 'query' | 'body'> & { headers?: TData['headers'] };
