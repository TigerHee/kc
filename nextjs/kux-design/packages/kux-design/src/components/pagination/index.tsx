/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description Pagination component
 */
import { type MouseEvent } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@kux/iconpack';
import { clx } from '@/common';
import { useViewModel, type IPaginationProps, type IPageItem } from './use-viewmodel';
import './style.scss'

export type { IPaginationProps, IPageItem } from './use-viewmodel';

/**
 * Pagination component
 */
export function Pagination(props: IPaginationProps) {
  const { pageItems, onClickPageItem, currentValue, totalPage } = useViewModel(props);
  return (
    <div className="kux-pagination">

      <ul className="kux-pagination-items">
        {pageItems.map((item) => {
          const key = `${item.type}-${item.value || '0'}`;
          return (
            <PagerItem
              key={key}
              currentValue={currentValue}
              totalPage={totalPage}
              item={item}
              onClick={onClickPageItem}
              renderItem={props.renderItem}
            />
          )
        })}
      </ul>
    </div>
  )
}

interface IPagerItemProps {
  item: IPageItem
  currentValue: number
  totalPage: number
  onClick: (e: MouseEvent) => void
  renderItem?: IPaginationProps['renderItem']
}

function PagerItem(props: IPagerItemProps) {
  const isActive = props.item.value === props.currentValue
    || (props.item.type === 'jump' && (props.item.value === 'prev' && props.currentValue === 1) || (props.item.value === 'next' && props.currentValue === props.totalPage));
  const defaultItem = getDefaultPageContent(props.item, isActive);
  const renderedItem = props.renderItem?.(props.item, defaultItem) || defaultItem;

  return (
    <li
      className={clx('kux-pagination-item', 'is-' + props.item.type, {
      'is-disabled': isActive,
      })}
      data-value={props.item.value}
      data-type={props.item.type}
      aria-disabled={isActive}
      onClick={props.onClick}>
      {renderedItem}
    </li>
  )
}

function getDefaultPageContent(item: IPageItem, disabled?: boolean) {
  if (item.type === 'omit') {
    return <span>...</span>
  }
  if (item.type === 'jump') {
    if (item.value === 'prev') {
      return <button disabled={disabled}>
        <ArrowLeftIcon size={16} rtl />
      </button>
    } else if (item.value === 'next') {
      return <button disabled={disabled}>
        <ArrowRightIcon size={16} rtl />
      </button>
    }
  }
  if (item.type === 'page') {
    return <button disabled={disabled}>{item.value}</button>
  }
  return null;
}
