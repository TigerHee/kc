/**
 * Owner: victor.ren@kupotech.com
 */
/**
 * 通过size获取选项的高度
 * @param {*} size
 * @returns
 */
export function getOptionHeightFromSize(size) {
  switch (size) {
    case 'small':
      return 32;
    case 'large':
      return 48;
    case 'xlarge':
      return 56;
    default:
      return 40;
  }
}

/**
 * 通过size获取文字大小
 * @param {*} size
 * @returns
 */
export function getFontSizeFromSize(size) {
  switch (size) {
    case 'small':
      return 12;
    case 'large':
      return 16;
    case 'xlarge':
      return 16;
    default:
      return 14;
  }
}

/**
 * 通过size获取搜索图标大小
 * @param {*} size
 * @returns
 */
export function getSearchIconSizeFromSize(size) {
  switch (size) {
    case 'medium':
      return 12;
    case 'small':
      return 12;
    default:
      return 16;
  }
}

/**
 * 通过size获取搜索图标间距
 * @param {*} size
 * @returns
 */
export function getSearchIconSpaceSizeFromSize(size) {
  switch (size) {
    case 'small':
      return 40;
    case 'large':
      return 46;
    case 'xlarge':
      return 48;
    default:
      return 42;
  }
}

export function fillFieldNames() {
  return {
    label: 'label',
    title: 'title',
    value: 'value',
    options: 'options',
  };
}

export function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}

export function getKey(data, index) {
  const { key } = data;
  let value;

  if ('value' in data) {
    ({ value } = data);
  }

  if (key !== null && key !== undefined) {
    return key;
  }
  if (value !== undefined) {
    return value;
  }
  return `kux-index-key-${index}`;
}
