import React, {memo} from 'react';
import styled from '@emotion/native';

import {getEnhanceColorByType} from 'utils/color-helper';

const TableContainer = styled.View`
  border-width: 1px;
  border-color: ${({theme}) => theme.colorV2.divider8};
  overflow: hidden;
  ${props => props.containerStyle}
`;

const HeaderRow = styled.View`
  flex-direction: row;
  background-color: ${({theme}) =>
    getEnhanceColorByType(theme.type, 'tableRowBg')};
  ${props => props.headerStyle}
`;

const DataRow = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-color: ${({theme}) => theme.colorV2.divider8};
  ${props => props.rowStyle}
`;

const Cell = styled.View`
  padding: 12px;
  min-height: 32px;
  justify-content: center;
  ${props => props.cellStyle}
  ${props =>
    props.hasBorder &&
    `border-right-width: 1px; border-color: ${props.theme.colorV2.divider8};`}
`;

const HeaderText = styled.Text`
  font-weight: 400;
  font-size: 12px;
  line-height: 15.6px;
  color: ${({theme}) => theme.colorV2.text};
`;

const CellText = styled.Text`
  font-weight: 400;
  font-size: 12px;
  line-height: 15.6px;
  color: ${({theme}) => theme.colorV2.text};
`;

const Table = ({
  columns,
  dataSource,
  containerStyle,
  headerStyle,
  rowStyle,
  cellStyle,
}) => {
  // 计算列宽（简单等分）
  const columnWidths = columns.map(
    col => col.width || `${100 / columns.length}%`,
  );

  return (
    <TableContainer containerStyle={containerStyle}>
      {/* 表头 */}
      <HeaderRow headerStyle={headerStyle}>
        {columns.map((column, index) => (
          <Cell
            key={column.dataIndex || index}
            cellStyle={cellStyle}
            hasBorder={index !== columns.length - 1}
            style={{width: columnWidths[index]}}>
            <HeaderText>{column.title}</HeaderText>
          </Cell>
        ))}
      </HeaderRow>

      {/* 数据行 */}
      {dataSource.map((record, rowIndex) => (
        <DataRow key={record.key || rowIndex} rowStyle={rowStyle}>
          {columns.map((column, colIndex) => {
            const text = record[column.dataIndex];
            const content = column.render ? (
              column.render(text, record, rowIndex)
            ) : (
              <CellText>{text}</CellText>
            );

            return (
              <Cell
                key={`${rowIndex}-${column.dataIndex}`}
                cellStyle={cellStyle}
                hasBorder={colIndex !== columns.length - 1}
                style={{width: columnWidths[colIndex]}}>
                {content}
              </Cell>
            );
          })}
        </DataRow>
      ))}
    </TableContainer>
  );
};

export default memo(Table);
