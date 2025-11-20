/**
 * Owner: sean.shi@kupotech.com
 */
export type QuerySerializer = (query: Record<string, unknown>) => string;

interface SerializerOptions<T> {
  /**
   * @default true
   */
  explode: boolean;
  style: T;
}
export interface QuerySerializerOptions {
  allowReserved?: boolean;
  array?: SerializerOptions<ArrayStyle>;
  object?: SerializerOptions<ObjectStyle>;
}

type ArrayStyle = 'form' | 'spaceDelimited' | 'pipeDelimited';
type ObjectStyle = 'form' | 'deepObject';
type MatrixStyle = 'label' | 'matrix' | 'simple';
export type ArraySeparatorStyle = ArrayStyle | MatrixStyle;
export type ObjectSeparatorStyle = ObjectStyle | MatrixStyle;
interface SerializePrimitiveOptions {
  allowReserved?: boolean;
  name: string;
}
export interface SerializePrimitiveParam extends SerializePrimitiveOptions {
  value: string;
}
export interface SerializeOptions<T> extends SerializePrimitiveOptions, SerializerOptions<T> {}

export interface PathSerializer {
  path: Record<string, unknown>;
  url: string;
}

type BodySerializer = (body: any) => any;

export interface CoreConfig {
  /**
   * A function for serializing request body parameter. By default,
   * {@link JSON.stringify()} will be used.
   */
  bodySerializer?: BodySerializer | null;
  /**
   * An object containing any HTTP headers that you want to pre-populate your
   * `Headers` object with.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/Headers/Headers#init See more}
   */
  headers?:
    | RequestInit['headers']
    | Record<
        string,
        string | number | boolean | (string | number | boolean)[] | null | undefined | unknown
      >;
  /**
   * The request method.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/fetch#method See more}
   */
  method?: 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';
  /**
   * A function for serializing request query parameters. By default, arrays
   * will be exploded in form style, objects will be exploded in deepObject
   * style, and reserved characters are percent-encoded.
   *
   * This method will have no effect if the native `paramsSerializer()` Axios
   * API function is used.
   *
   * {@link https://swagger.io/docs/specification/serialization/#query View examples}
   */
  querySerializer?: QuerySerializer | QuerySerializerOptions;
  /**
   * A function transforming response data before it's returned. This is useful
   * for post-processing data, e.g. converting ISO strings into Date objects.
   */
  responseTransformer?: (data: unknown) => Promise<unknown>;
  /**
   * A function validating response data. This is useful if you want to ensure
   * the response conforms to the desired shape, so it can be safely passed to
   * the transformers and returned to the user.
   */
  responseValidator?: (data: unknown) => Promise<unknown>;
}

export interface Config<T extends ClientOptions = ClientOptions>
  extends Omit<RequestInit, 'body' | 'headers' | 'method'>,
    CoreConfig {
  /**
   * Base URL for all requests made by this client.
   */
  baseUrl?: T['baseUrl'];
  /**
   * Fetch API implementation. You can use this option to provide a custom
   * fetch instance.
   *
   * @default globalThis.fetch
   */
  fetch?: (request: RequestOptions) => ReturnType<typeof fetch>;
  /**
   * Return the response data parsed in a specified format. By default, `auto`
   * will infer the appropriate method from the `Content-Type` response header.
   * You can override this behavior with any of the {@link Body} methods.
   * Select `stream` if you don't want to parse response data at all.
   *
   * @default 'auto'
   */
  parseAs?: Exclude<keyof Body, 'body' | 'bodyUsed'> | 'auto' | 'stream';
}

export interface RequestOptions<Url extends string = string> extends Config {
  /**
   * Any body that you want to add to your request.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
   */
  body?: unknown;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  /**
   * Security mechanism(s) to use for the request.
   */
  url: Url;
}

export type RequestResult<TData = unknown> = Promise<
  TData extends { data?: any } ? TData['data'] : void
>;

export interface ClientOptions {
  baseUrl?: string;
}

export interface TDataShape {
  body?: unknown;
  headers?: unknown;
  path?: unknown;
  query?: unknown;
  url: string;
}

type MethodFn = <TData = unknown>(options: Omit<RequestOptions, 'method'>) => RequestResult<TData>;

export type RequestFn = <TData = unknown>(
  options: Omit<RequestOptions, 'method'> & Pick<Required<RequestOptions>, 'method'>,
) => RequestResult<TData>;

interface CoreClient<
  RequestFnType = never,
  ConfigType = unknown,
  MethodFnType = never,
  BuildUrlFn = never,
> {
  /**
   * Returns the final request URL.
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

type BuildUrlFn = <
  TData extends {
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    url: string;
  },
>(
  options: Pick<TData, 'url'> & Options<TData>,
) => string;

export type Client = CoreClient<RequestFn, Config, MethodFn, BuildUrlFn>;

/**
 * The `createClientConfig()` function will be called on client initialization
 * and the returned object will become the client's initial configuration.
 *
 * You may want to initialize your client this way instead of calling
 * `setConfig()`. This is useful for example if you're using Next.js
 * to ensure your client always has the correct values.
 */
export type CreateClientConfig<T extends ClientOptions = ClientOptions> = (
  override?: Config<ClientOptions & T>,
) => Config<Required<ClientOptions> & T>;

export interface TDataShRequestFnape {
  body?: unknown;
  headers?: unknown;
  path?: unknown;
  query?: unknown;
  url: string;
}

type OmitKeys<T, K> = Pick<T, Exclude<keyof T, K>>;

export type Options<TData extends TDataShape = TDataShape> = OmitKeys<
  RequestOptions,
  'body' | 'path' | 'query' | 'url'
> &
  Omit<TData, 'url' | 'headers'> & { headers?: TData['headers'] };
