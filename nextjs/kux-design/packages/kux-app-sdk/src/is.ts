/**
 * Check if a value is of a certain type.
 */
const toString = Object.prototype.toString;

export function is(value: any, type: 'string' | 'String'): value is string;
export function is(value: any, type: 'number' | 'Number'): value is number;
export function is(value: any, type: 'boolean' | 'Boolean'): value is boolean;
export function is(value: any, type: 'symbol'): value is symbol;
export function is(value: any, type: 'undefined'): value is undefined;
export function is(value: any, type: 'function'): value is Function;
export function is(value: any, type: 'object'): value is object;
export function is(value: any, type: 'bigint'): value is bigint;
export function is(value: any, type: 'null'): value is null;
export function is(value: any, type: 'nan' | 'NaN'): value is number;
/**
 * nullable means the value is null or undefined.
 */
export function is(value: any, type: 'nullable'): value is null | undefined;
export function is(value: any, type: 'array'): value is any[];
/**
 * iterable means the value has a Symbol.iterator function, like Array, Map, Set, and other array like types
 */
export function is(value: any, type: 'iterable'): value is Iterable<any>;
export function is(value: any, type: 'plainObject' | 'plainobject'): value is Record<string, any>;
export function is(value: any, type: 'Date' | 'date'): value is Date;

/**
 * Check if a value is of a certain type.
 */
export function is(value: any, type: string): boolean {
  const typeLower = type.toLowerCase();
  if (typeLower === 'nullable') {
    return value === null || value === undefined;
  }
  if (value === null) {
    return typeLower === 'null';
  }
  const valueType = typeof value;
  if (valueType === typeLower) return true;

  if (typeLower === 'nan') {
    return value !== value
  }
  if (typeLower === 'string') {
    return toString.call(value) === '[object String]';
  }
  if (typeLower === 'number') {
    return toString.call(value) === '[object Number]';
  }
  if (typeLower === 'boolean') {
    return toString.call(value) === '[object Boolean]';
  }
  if (typeLower === 'array') {
    return Array.isArray(value);
  }
  if (typeLower === 'iterable') {
    return valueType !== 'undefined' && typeof value[Symbol.iterator] === 'function';
  }
  if (typeLower === 'plainobject') {
    return toString.call(value) === '[object Object]'
      && Object.getPrototypeOf(value) === Object.prototype
      // 非 ReactElement
      && !value.$$typeof;
  }
  if (typeLower === 'date') {
    return toString.call(value) === '[object Date]';
  }
  return false;
}
