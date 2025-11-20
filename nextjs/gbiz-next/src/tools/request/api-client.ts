/**
 * Owner: sean.shi@kupotech.com
 */
import type { RawAxiosRequestHeaders } from 'axios';
import { requestForApi as httpLib } from './request';
import type {
  ClientOptions,
  Config,
  Client,
  Auth,
  AuthToken,
  RequestOptions,
  ArraySeparatorStyle,
  ObjectSeparatorStyle,
  SerializePrimitiveParam,
  SerializeOptions,
  PathSerializer,
  QuerySerializerOptions,
  QuerySerializer,
} from './types';

export const createConfig = <T extends ClientOptions = ClientOptions>(
  override: Config<Omit<ClientOptions, keyof T> & T> = {},
): Config<Omit<ClientOptions, keyof T> & T> => ({
  ...override,
});

const separatorArrayExplode = (style: ArraySeparatorStyle) => {
  switch (style) {
    case 'label':
      return '.';
    case 'matrix':
      return ';';
    case 'simple':
      return ',';
    default:
      return '&';
  }
};

const separatorArrayNoExplode = (style: ArraySeparatorStyle) => {
  switch (style) {
    case 'form':
      return ',';
    case 'pipeDelimited':
      return '|';
    case 'spaceDelimited':
      return '%20';
    default:
      return ',';
  }
};
const serializePrimitiveParam = ({ allowReserved, name, value }: SerializePrimitiveParam) => {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'object') {
    throw new Error(
      'Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.',
    );
  }

  return `${name}=${allowReserved ? value : encodeURIComponent(value)}`;
};
const serializeArrayParam = ({
  allowReserved,
  explode,
  name,
  style,
  value,
}: SerializeOptions<ArraySeparatorStyle> & {
  value: unknown[];
}) => {
  if (!explode) {
    const joinedValues = (
      allowReserved ? value : value.map((v) => encodeURIComponent(v as string))
    ).join(separatorArrayNoExplode(style));
    switch (style) {
      case 'label':
        return `.${joinedValues}`;
      case 'matrix':
        return `;${name}=${joinedValues}`;
      case 'simple':
        return joinedValues;
      default:
        return `${name}=${joinedValues}`;
    }
  }

  const separator = separatorArrayExplode(style);
  const joinedValues = value
    .map((v) => {
      if (style === 'label' || style === 'simple') {
        return allowReserved ? v : encodeURIComponent(v as string);
      }

      return serializePrimitiveParam({
        allowReserved,
        name,
        value: v as string,
      });
    })
    .join(separator);
  return style === 'label' || style === 'matrix' ? separator + joinedValues : joinedValues;
};
const separatorObjectExplode = (style: ObjectSeparatorStyle) => {
  switch (style) {
    case 'label':
      return '.';
    case 'matrix':
      return ';';
    case 'simple':
      return ',';
    default:
      return '&';
  }
};
const serializeObjectParam = ({
  allowReserved,
  explode,
  name,
  style,
  value,
}: SerializeOptions<ObjectSeparatorStyle> & {
  value: Record<string, unknown> | Date;
}) => {
  if (value instanceof Date) {
    return `${name}=${value.toISOString()}`;
  }

  if (style !== 'deepObject' && !explode) {
    let values: string[] = [];
    Object.entries(value).forEach(([key, v]) => {
      values = [...values, key, allowReserved ? (v as string) : encodeURIComponent(v as string)];
    });
    const joinedValues = values.join(',');
    switch (style) {
      case 'form':
        return `${name}=${joinedValues}`;
      case 'label':
        return `.${joinedValues}`;
      case 'matrix':
        return `;${name}=${joinedValues}`;
      default:
        return joinedValues;
    }
  }

  const separator = separatorObjectExplode(style);
  const joinedValues = Object.entries(value)
    .map(([key, v]) =>
      serializePrimitiveParam({
        allowReserved,
        name: style === 'deepObject' ? `${name}[${key}]` : key,
        value: v as string,
      }),
    )
    .join(separator);
  return style === 'label' || style === 'matrix' ? separator + joinedValues : joinedValues;
};

const createQuerySerializer = <T = unknown>({
  allowReserved,
  array,
  object,
}: QuerySerializerOptions = {}) => {
  const querySerializer = (queryParams: T) => {
    let search: string[] = [];
    if (queryParams && typeof queryParams === 'object') {
      for (const name in queryParams) {
        // eslint-disable-next-line prototype-pollution/no-bracket-notation-property-accessor
        const value = queryParams[name];

        if (value === undefined || value === null) {
          continue;
        }

        if (Array.isArray(value)) {
          search = [
            ...search,
            serializeArrayParam({
              allowReserved,
              explode: true,
              name,
              style: 'form',
              value,
              ...array,
            }),
          ];
          continue;
        }

        if (typeof value === 'object') {
          search = [
            ...search,
            serializeObjectParam({
              allowReserved,
              explode: true,
              name,
              style: 'deepObject',
              value: value as Record<string, unknown>,
              ...object,
            }),
          ];
          continue;
        }

        search = [
          ...search,
          serializePrimitiveParam({
            allowReserved,
            name,
            value: value as string,
          }),
        ];
      }
    }
    return search.join('&');
  };
  return querySerializer;
};

const PATH_PARAM_RE = /\{[^{}]+\}/g;
const defaultPathSerializer = ({ path, url: _url }: PathSerializer) => {
  let url = _url;
  const matches = _url.match(PATH_PARAM_RE);
  if (matches) {
    for (const match of matches) {
      let explode = false;
      let name = match.substring(1, match.length - 1);
      let style: ArraySeparatorStyle = 'simple';

      if (name.endsWith('*')) {
        explode = true;
        name = name.substring(0, name.length - 1);
      }

      if (name.startsWith('.')) {
        name = name.substring(1);
        style = 'label';
      } else if (name.startsWith(';')) {
        name = name.substring(1);
        style = 'matrix';
      }

      const value = path[name];

      if (value === undefined || value === null) {
        continue;
      }

      if (Array.isArray(value)) {
        url = url.replace(match, serializeArrayParam({ explode, name, style, value }));
        continue;
      }

      if (typeof value === 'object') {
        url = url.replace(
          match,
          serializeObjectParam({
            explode,
            name,
            style,
            value: value as Record<string, unknown>,
          }),
        );
        continue;
      }

      if (style === 'matrix') {
        url = url.replace(
          match,
          `;${serializePrimitiveParam({
            name,
            value: value as string,
          })}`,
        );
        continue;
      }

      const replaceValue = encodeURIComponent(
        style === 'label' ? `.${value as string}` : (value as string),
      );
      url = url.replace(match, replaceValue);
    }
  }
  return url;
};

const getUrl = ({
  baseUrl,
  path,
  query,
  querySerializer,
  url: _url,
}: {
  baseUrl?: string;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  querySerializer: QuerySerializer;
  url: string;
}) => {
  const pathUrl = _url.startsWith('/') ? _url : `/${_url}`;
  let url = (baseUrl ?? '') + pathUrl;
  if (path) {
    url = defaultPathSerializer({ path, url });
  }
  let search = query ? querySerializer(query) : '';
  if (search.startsWith('?')) {
    search = search.substring(1);
  }
  if (search) {
    url += `?${search}`;
  }
  return url;
};

export const buildUrl: Client['buildUrl'] = (options) => {
  const url = getUrl({
    baseUrl: options.baseURL as string,
    path: options.path,
    // let `paramsSerializer()` handle query params if it exists
    query: !options.paramsSerializer ? options.query : undefined,
    querySerializer:
      typeof options.querySerializer === 'function'
        ? options.querySerializer
        : createQuerySerializer(options.querySerializer),
    url: options.url,
  });
  return url;
};

export const getAuthToken = async (
  auth: Auth,
  callback: ((auth: Auth) => Promise<AuthToken> | AuthToken) | AuthToken,
): Promise<string | undefined> => {
  const token = typeof callback === 'function' ? await callback(auth) : callback;

  if (!token) {
    return;
  }

  if (auth.scheme === 'bearer') {
    return `Bearer ${token}`;
  }

  if (auth.scheme === 'basic') {
    return `Basic ${btoa(token)}`;
  }

  return token;
};

export const setAuthParams = async ({
  security,
  ...options
}: Pick<Required<RequestOptions>, 'security'> &
  Pick<RequestOptions, 'auth' | 'query'> & {
    headers: Record<any, unknown>;
  }) => {
  for (const auth of security) {
    const token = await getAuthToken(auth, options.auth);

    if (!token) {
      continue;
    }

    const name = auth.name ?? 'Authorization';

    switch (auth.in) {
      case 'query':
        if (!options.query) {
          options.query = {};
        }
        options.query[name] = token;
        break;
      case 'cookie': {
        const value = `${name}=${token}`;
        if ('Cookie' in options.headers && options.headers['Cookie']) {
          options.headers['Cookie'] = `${options.headers['Cookie']}; ${value}`;
        } else {
          options.headers['Cookie'] = value;
        }
        break;
      }
      case 'header':
      default:
        options.headers[name] = token;
        break;
    }

    return;
  }
};

/**
 * Special Axios headers keywords allowing to set headers by request method.
 */
export const axiosHeadersKeywords = [
  'common',
  'delete',
  'get',
  'head',
  'patch',
  'post',
  'put',
] as const;

export const mergeHeaders = (
  ...headers: Array<Required<Config>['headers'] | undefined>
): Record<any, unknown> => {
  const mergedHeaders: Record<any, unknown> = {};
  for (const header of headers) {
    if (!header || typeof header !== 'object') {
      continue;
    }

    const iterator = Object.entries(header);

    for (const [key, value] of iterator) {
      if (
        axiosHeadersKeywords.includes(key as (typeof axiosHeadersKeywords)[number]) &&
        typeof value === 'object'
      ) {
        mergedHeaders[key] = {
          ...(mergedHeaders[key] as Record<any, unknown>),
          ...value,
        };
      } else if (value === null) {
        delete mergedHeaders[key];
      } else if (Array.isArray(value)) {
        for (const v of value) {
          // @ts-expect-error ignore
          mergedHeaders[key] = [...(mergedHeaders[key] ?? []), v as string];
        }
      } else if (value !== undefined) {
        // assume object headers are meant to be JSON stringified, i.e. their
        // content value in OpenAPI specification is 'application/json'
        mergedHeaders[key] = typeof value === 'object' ? JSON.stringify(value) : (value as string);
      }
    }
  }
  return mergedHeaders;
};

export const mergeConfigs = (a: Config, b: Config): Config => {
  const config = { ...a, ...b };
  config.headers = mergeHeaders(a.headers, b.headers);
  return config;
};

export const createClient = (config: Config = {}): Client => {
  const _config = mergeConfigs(createConfig(), config);

  const getConfig = (): Config => ({ ..._config });

  const request: Client['request'] = async (options: any) => {
    const opts = {
      ..._config,
      ...options,
      axios: options.axios ?? _config.axios ?? httpLib,
      headers: mergeHeaders(_config.headers, options.headers),
    };

    if (opts.security) {
      await setAuthParams({
        ...opts,
        security: opts.security,
      });
    }

    if (opts.body && opts.bodySerializer) {
      opts.body = opts.bodySerializer(opts.body);
    }

    opts.url = buildUrl(opts);

    const _axios = opts.axios!;

    // if baseURL is set and the URL starts with it, remove baseURL from the URL
    // else the request url will be double-prefixed with baseURL
    if (opts.baseURL && opts.url.startsWith(opts.baseURL)) {
      delete opts.baseURL;
    }

    const response = await _axios({
      ...opts,
      data: opts.body,
      headers: opts.headers as RawAxiosRequestHeaders,
      // let `paramsSerializer()` handle query params if it exists
      params: opts.paramsSerializer ? opts.query : undefined,
    });

    return response;
  };

  return {
    buildUrl,
    connect: (options) => request({ ...options, method: 'CONNECT' }),
    delete: (options) => request({ ...options, method: 'DELETE' }),
    get: (options) => request({ ...options, method: 'GET' }),
    getConfig,
    head: (options) => request({ ...options, method: 'HEAD' }),
    instance: httpLib,
    options: (options) => request({ ...options, method: 'OPTIONS' }),
    patch: (options) => request({ ...options, method: 'PATCH' }),
    post: (options) => request({ ...options, method: 'POST' }),
    put: (options) => request({ ...options, method: 'PUT' }),
    request,
  } as Client;
};
