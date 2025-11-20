/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description FlexGrid component
 */
import { useMemo, Fragment } from 'react';
import { VStack, HStack } from '../stack';
import { Spacer } from '../spacer';
import { flattenReactChildren, clx } from '@/common';

import './style.scss'

export interface IFlexGridProps {
  /**
   * Number of columns in the grid
   */
  columns: number;
  /**
   * row alignment
   * @default 'center'
   */
  rowAlign?: React.CSSProperties['alignItems'];
  /**
   * Gap between rows and columns
   * @default 0
   */
  gap?: number | { row?: number; column?: number };
  /**
   * Children elements to be displayed in the grid
   */
  children: React.ReactNode
  /**
   * 自定义样式
   */
  className?: string;
}

export function FlexGrid(props: IFlexGridProps) {
  const allChildren = useMemo(() => {
    return flattenReactChildren(props.children);
  }, [props.children]);
  const gapInfo = useMemo(() => {
    if (app.is(props.gap, 'object')) {
      return {
        row: props.gap.row || 0,
        column: props.gap.column || 0,
      };
    }
    return {
      row: props.gap || 0,
      column: props.gap || 0,
    };
  }, [props.gap]);

  const rows = useMemo(() => {
    return calcRowItems(allChildren, props.columns);
  }, [allChildren, props.columns]);


  return (
    <VStack spacing={gapInfo.row} className={clx('kux-flex-grid', props.className)}>
      {rows.map((row, rowIndex) => (
        <Fragment key={rowIndex}>
          <HStack spacing={gapInfo.column} align={props.rowAlign} className='kux-flex-grid-row'>{row}</HStack>
          {rowIndex < rows.length - 1 && (
            <Spacer />
          )}
        </Fragment>
      ))}
    </VStack>
  );
};

function calcRowItems(children: React.ReactNode[], columns: number) {
  const rows: React.ReactNode[][] = [];

  for (let i = 0; i < children.length; i += columns) {
    const rowItems = children.slice(i, i + columns);

    while (rowItems.length < columns) {
      rowItems.push(null);
    }

    const rowWithSpacing: React.ReactNode[] = [];
    rowItems.forEach((item, index) => {
      rowWithSpacing.push(
        <div key={`item-${i + index}`} className='kux-flex-grid-item'>
          {item}
        </div>
      );
      if (index < rowItems.length - 1) {
        rowWithSpacing.push(<Spacer key={`gap-${i + index}`}/>);
      }
    });

    rows.push(rowWithSpacing);
  }
  return rows;
}