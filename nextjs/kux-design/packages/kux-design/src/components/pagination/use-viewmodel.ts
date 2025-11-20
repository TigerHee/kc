import { useState, useEffect, useMemo, useCallback, type MouseEvent, type ReactNode } from 'react';

// margin on each side of the current page
const MAX_MARGIN = 2;
// max number of pages to show
const MAX_SHOWN_PAGE = MAX_MARGIN * 2 + 1 + 2;
// max number of continuous pages to show
const MAX_CONTINUOUS_PAGE = MAX_MARGIN * 2 + 1;



export type IPageItem = {
  /**
   * 按钮类型
   * - page: 页码
   * - jump: 跳页按钮(前一页/下一页)
   * - omit: 省略号
   */
  type: 'page' | 'omit' | 'jump';
  value: number | string
}

export interface IPaginationProps {
  /**
   * 当前页码, 受控模式使用
   * 页码从1开始
   */
  value?: number
  /**
   * 当前页码的初始值, 非受控模式使用
   * 页码从1开始
   */
  defaultValue?: number
  /**
   * 每页显示的条数
   */
  pageSize?: number
  /**
   * 总条数
   */
  total: number
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否简化显示
   */
  simple?: boolean
  /**
   * 页码改变时的回调函数
   */
  onChange?: (page: number) => Promise<void> | void
  /**
   * 自定义渲染页码
   * @param item 当前页码信息
   * @param defaultItem 当前页码默认渲染
   * @returns 自定义渲染的页码, 如果返回null, 则使用默认渲染
   */
  renderItem?: (item: IPageItem, defaultItem: ReactNode) => ReactNode
}

export function useViewModel(props: IPaginationProps) {
  const [currentValue, setCurrentValue] = useState(props.value || props.defaultValue || 1);
  useEffect(() => {
    if (props.value) {
      setCurrentValue(props.value)
    }
  }, [props.value]);

  const totalPage = useMemo(() => {
    const pageSize = props.pageSize || 10;
    const total = props.total || 0;
    return Math.ceil(total / pageSize) || 1;
  }, [props.total, props.pageSize]);
  
  const pageItems = useMemo(() => {
    return calcPageItems(currentValue, totalPage, props.simple);
  }, [totalPage, currentValue, props.simple]);

  const onClickPageItem = useCallback((e: MouseEvent) => {
    const target = e.currentTarget;
    if (!target || !props.onChange) return;
    const isDisabled = target.getAttribute('aria-disabled');
    if (isDisabled === 'true') return;
    const type = target.getAttribute('data-type') as IPageItem['type'];
    const value = target.getAttribute('data-value') as string;
    setCurrentValue((prev) => {
      const nextPage = getNextPage({ type, value }, prev, totalPage);
      if (nextPage !== prev) {
        setTimeout(() => {
          props.onChange?.(nextPage);
        }, 0);
      }
      return nextPage;
    });
  }, [totalPage, props.onChange]);

  return {
    currentValue,
    totalPage,
    pageItems,
    onClickPageItem,
  }
}


function calcPageItems(page: number, totalPage: number, simple?: boolean): IPageItem[] {
  let result: IPageItem[] = [{ type: 'jump', value: 'prev' }];
  if (simple) {
    return result.concat([{ type: 'jump', value: 'next' }]);
  }
  if (totalPage <= MAX_SHOWN_PAGE) {
    return Array.from({ length: totalPage }, (_, i) => ({value: i + 1, type: 'page'}));
  }
  // in the first MAX_MARGIN + 1
  if (page <= (MAX_MARGIN + 1)) {
    result = result.concat(
      Array.from({ length: MAX_CONTINUOUS_PAGE }, (_, i) => ({value: i + 1, type: 'page'}))
    );
    result.push({ type: 'omit', value: 'next' });
    result.push({ value: totalPage, type: 'page' });
    // in the last MAX_MARGIN + 1
  } else if ((page + MAX_MARGIN + 1) >= totalPage) {
    result.push({ value: 1, type: 'page' });
    result.push({ type: 'omit', value: 'prev' });
    result = result.concat(Array.from({ length: MAX_CONTINUOUS_PAGE }, (_, i) => ({value: totalPage - MAX_CONTINUOUS_PAGE + i + 1, type: 'page'})));
    // in the middle
  } else {
    result.push({ value: 1, type: 'page' });
    result.push({ type: 'omit', value: 'prev' });
    result = result.concat(Array.from({ length: MAX_CONTINUOUS_PAGE }, (_, i) => ({value: page - MAX_MARGIN + i, type: 'page'})));
    result.push({ type: 'omit', value: 'next' });
    result.push({ value: totalPage, type: 'page' });
  }
  result.push({ type: 'jump', value: 'next' });
  return result;
}

function getNextPage(pageItem: IPageItem, currentPage: number, totalPage: number) {
  let page = 1;
  if (pageItem.type === 'page') {
    page = Number(pageItem.value);
  } else if (pageItem.type === 'jump') {
    if (pageItem.value === 'prev') {
        page = currentPage - 1
    } else if (pageItem.value === 'next') {
      page = currentPage + 1
    }
  }
  return Math.min(Math.max(page || 1, 1), totalPage);
}