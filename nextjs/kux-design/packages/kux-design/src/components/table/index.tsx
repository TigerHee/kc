/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description Table component
 */
import type { ReactNode } from 'react';
import { clx } from '@/common'
import './style.scss'

export type ITableColumn<R extends Record<string, any> = Record<string, any>> = {
  /**
   * 表头标题 
   */
  title: ReactNode;
  /**
   * 字段名, 若为空则必须有 render 函数
   */
  dataIndex?: keyof R;
  /**
   * 表头对齐方式
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
  width?: number;
  render?: (value: any, record: R) => React.ReactNode;
};

export interface ITableProps<R extends Record<string, any>  = Record<string, any>> {
  /**
   * 表格列配置
   */
  columns: ITableColumn<R>[];
  /**
   * 可以标记行id 的字段名, 或者可以返回唯一key的函数
   */
  rowKey: (keyof R) | ((item: Record<string, any>) => string);
  /**
   * 表格数据
   */
  dataSource: R[];
  /**
   * 首位固定列数
   */
  fixedStartCount?: number;
  /**
   * 末位固定列数
   */
  fixedEndCount?: number;
  /**
   * 是否显示边框
   */
  bordered?: boolean;
  /**
   * 是否显示斑马纹
   */
  striped?: boolean;
};


export function Table<R extends Record<string, any> = Record<string, any>>({
  columns,
  dataSource,
  bordered,
  striped,
  rowKey,
  fixedStartCount = 0,
  fixedEndCount = 0
}: ITableProps<R>) {

  const startCols = columns.slice(0, fixedStartCount);
  const endCols = columns.slice(columns.length - fixedEndCount);
  const middleCols = columns.slice(fixedStartCount, columns.length - fixedEndCount);

  return (
    <div className={clx('kux-table', { 'is-bordered': bordered, 'is-striped': striped })}>
      {!!startCols.length && <div className="kux-table-item is-start">{renderTable(startCols, dataSource, rowKey)}</div>}
      <div className="kux-table-item is-middle">
        {renderTable(middleCols, dataSource, rowKey)}
      </div>
      {!!endCols.length && <div className="kux-table-item is-end">{renderTable(endCols, dataSource, rowKey)}</div>}
    </div>
  );
}


function renderTable<R extends Record<string, any>> (cols: ITableColumn<R>[], data: R[], rowKey: keyof R | ((item: R) => string)) {
  return (<table className="kux-table-inner">
    {renderColGroup(cols)}
    <thead>
      <tr>
        {cols.map((col, i) => (
          <th key={i} className={'kux-text-' + (col.align || 'start')}>{col.title}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIdx) => (
        <tr key={getRowKey(row, rowKey) || rowIdx}>
          {cols.map((col, colIdx) => (
            <td key={colIdx} className={'kux-text-' + (col.align || 'start')}>
              {renderTableItem(col, row)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>)
}

function getRowKey<R extends Record<string, any>>(row: R, rowKey: keyof R | ((item: R) => string)) {
  if (app.is(rowKey, 'function')) {
    return rowKey(row);
  }
  return row[rowKey];
}

function renderTableItem<R extends Record<string, any>> (col: ITableColumn<R>, row: R) {
  if (col.render) {
    return col.render(app.is(col.dataIndex, 'nullable') || row[col.dataIndex], row);
  }
  return app.is(col.dataIndex, 'nullable') || row[col.dataIndex];
}

function renderColGroup<R extends Record<string, any>>(cols: ITableColumn<R>[]) {
  return (
    <colgroup>
      {cols.map((col, i) => (
        <col key={i} style={{ width: col.width || 'auto' }}/>
      ))}
    </colgroup>
  )
}