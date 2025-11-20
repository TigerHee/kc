/**
 * Owner: sean.shi@kupotech.com
 */
import type {
  BuildUrlFn,
  ArraySeparatorStyle,
  ObjectSeparatorStyle,
  SerializePrimitiveParam,
  SerializeOptions,
  PathSerializer,
  QuerySerializerOptions,
  QuerySerializer,
} from './types';

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
  path,
  query,
  querySerializer,
}: {
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  querySerializer: QuerySerializer;
  url?: string;
}) => {
  let pathUrl = '';
  if (path) {
    pathUrl = defaultPathSerializer({ path, url: pathUrl });
  }
  let search = query ? querySerializer(query) : '';
  if (search.startsWith('?')) {
    search = search.substring(1);
  }
  if (search) {
    pathUrl += `?${search}`;
  }
  return pathUrl;
};

export const buildUrl: BuildUrlFn = (options) => {
  const url = getUrl({
    path: options.path,
    // let `querySerializer()` handle query params if it exists
    query: !options.querySerializer ? options.params : undefined,
    querySerializer:
      typeof options.querySerializer === 'function'
        ? options.querySerializer
        : createQuerySerializer(options.querySerializer),
  });
  return url;
};

