/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { RightOutlined, DownOutlined } from '@kux/icons';

export const INTERNAL_KEY_PREFIX = 'KUFOX_TABLE_KEY';

export const EXPAND_COLUMN = {};

export const SELECTION_COLUMN = {};

export function toArray(arr) {
  if (arr === undefined || arr === null) {
    return [];
  }
  return Array.isArray(arr) ? arr : [arr];
}

export function getPathValue(record, path) {
  if (!path && typeof path !== 'number') {
    return record;
  }
  const pathList = toArray(path);

  let current = record;

  for (let i = 0; i < pathList.length; i += 1) {
    if (!current) {
      return null;
    }

    const prop = pathList[i];
    current = current[prop];
  }

  return current;
}

export function isRenderCell(data) {
  return data && typeof data === 'object' && !Array.isArray(data) && !React.isValidElement(data);
}

export function validateValue(val) {
  return val !== null && val !== undefined;
}

export function getColumnsKey(columns) {
  const columnKeys = [];
  const keys = {};

  columns.forEach((column) => {
    const { key, dataIndex } = column || {};

    let mergedKey = key || toArray(dataIndex).join('-') || INTERNAL_KEY_PREFIX;
    while (keys[mergedKey]) {
      mergedKey = `${mergedKey}_next`;
    }
    keys[mergedKey] = true;

    columnKeys.push(mergedKey);
  });

  return columnKeys;
}

export function findAllChildrenKeys(data, getRowKey) {
  const keys = [];

  function dig(list) {
    (list || []).forEach((item, index) => {
      keys.push(getRowKey(item, index));
    });
  }

  dig(data);
  return keys;
}

export const renderExpandIcon = ({ onExpand, record, expanded, expandable }) => {
  if (!expandable) {
    return <span />;
  }
  const onClick = (event) => {
    onExpand?.(record, event);
    event.stopPropagation();
  };
  return <span onClick={onClick}>{expanded ? <DownOutlined /> : <RightOutlined />}</span>;
};

let cached;

export function getScrollBarSize(fresh) {
  if (typeof document === 'undefined') {
    return 0;
  }

  if (fresh || cached === undefined) {
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    const outerStyle = outer.style;

    outerStyle.position = 'absolute';
    outerStyle.top = '0';
    outerStyle.left = '0';
    outerStyle.pointerEvents = 'none';
    outerStyle.visibility = 'hidden';
    outerStyle.width = '200px';
    outerStyle.height = '150px';
    outerStyle.overflow = 'hidden';

    outer.appendChild(inner);

    document.body.appendChild(outer);

    const widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let widthScroll = inner.offsetWidth;

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }

    document.body.removeChild(outer);

    cached = widthContained - widthScroll;
  }
  return cached;
}

function ensureSize(str) {
  const match = str.match(/^(.*)px$/);
  const value = Number(match?.[1]);
  return Number.isNaN(value) ? getScrollBarSize() : value;
}

export function getTargetScrollBarSize(target) {
  if (typeof document === 'undefined' || !target || !(target instanceof Element)) {
    return { width: 0, height: 0 };
  }

  const { width, height } = getComputedStyle(target, '::-webkit-scrollbar');
  return {
    width: ensureSize(width),
    height: ensureSize(height),
  };
}

export function getCellFixedInfo(colStart, colEnd, columns, stickyOffsets) {
  const startColumn = columns[colStart] || {};
  const endColumn = columns[colEnd] || {};

  let fixLeft;
  let fixRight;

  if (startColumn.fixed === 'left') {
    fixLeft = stickyOffsets.left[colStart];
  } else if (endColumn.fixed === 'right') {
    fixRight = stickyOffsets.right[colEnd];
  }

  let lastFixLeft = false;
  let firstFixRight = false;

  const nextColumn = columns[colEnd + 1];
  const prevColumn = columns[colStart - 1];

  if (fixLeft !== undefined) {
    const nextFixLeft = nextColumn && nextColumn.fixed === 'left';
    lastFixLeft = !nextFixLeft;
  } else if (fixRight !== undefined) {
    const prevFixRight = prevColumn && prevColumn.fixed === 'right';
    firstFixRight = !prevFixRight;
  }

  return {
    fixLeft,
    fixRight,
    lastFixLeft,
    firstFixRight,
    isSticky: stickyOffsets.isSticky,
  };
}

export function inHoverRange(cellStartRow, cellRowSpan, startRow, endRow) {
  const cellEndRow = cellStartRow + cellRowSpan - 1;
  return cellStartRow <= endRow && cellEndRow >= startRow;
}

export function addEventListener(target, eventType, cb, option) {
  const callback = ReactDOM.unstable_batchedUpdates
    ? function run(e) {
        ReactDOM.unstable_batchedUpdates(cb, e);
      }
    : cb;
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, option);
  }
  return {
    remove: () => {
      if (target.removeEventListener) {
        target.removeEventListener(eventType, callback);
      }
    },
  };
}

export function getOffset(node) {
  const box = node.getBoundingClientRect();
  const docElem = document.documentElement;

  return {
    left:
      box.left +
      (window.pageXOffset || docElem.scrollLeft) -
      (docElem.clientLeft || document.body.clientLeft || 0),
    top:
      box.top +
      (window.pageYOffset || docElem.scrollTop) -
      (docElem.clientTop || document.body.clientTop || 0),
  };
}

export function renderColumnTitle(title, props) {
  if (typeof title === 'function') {
    return title(props);
  }
  return title;
}
