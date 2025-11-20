/**
 * Owner: tiger@kupotech.com
 * 个人中心 h5 table
 */
import styled from '@emotion/styled';
import { Empty, Spin } from '@kux/mui';
import { isFunction } from 'lodash';
import { useCallback } from 'react';
import { _t } from 'tools/i18n';

const MiniTable = styled.div`
  width: 100%;
`;
const Item = styled.div`
  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider4};
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 24px 0;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 0;
  }
`;
const ItemUnit = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:not(:last-child) {
    ${(props) => props.theme.breakpoints.down('lg')} {
      margin-bottom: 8px;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-bottom: 8px;
    }
  }
`;
const TitleItemUnit = styled(ItemUnit)`
  &:not(:last-child) {
    ${(props) => props.theme.breakpoints.down('lg')} {
      margin-bottom: 20px;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-bottom: 16px;
    }
  }
`;
const UnitLabel = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme, labelColorKey }) => theme.colors[labelColorKey || 'text40']};
`;
const UnitValue = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  flex: 1;
  text-align: right;
  color: ${({ theme, valueColorKey }) => theme.colors[valueColorKey || 'text']};
`;
const TitleUnitValue = styled(UnitValue)`
  font-size: 16px;
`;
const EmptyBox = styled.div`
  display: flex;
  justify-content: center;
`;

const ItemWrapper = styled.div`
  background: ${({ theme, expanded }) => (expanded ? theme.colors.cover2 : 'transparent')};
  position: relative;
  :before {
    position: absolute;
    top: 0px;
    left: -16px;
    width: 16px;
    height: 100%;
    background: ${({ theme, expanded }) => (expanded ? theme.colors.cover2 : 'transparent')};
    border-radius: 12px 0px 0px 12px;
    content: ' ';
  }
  :after {
    position: absolute;
    top: 0px;
    right: -16px;
    width: 16px;
    height: 100%;
    background: ${({ theme, expanded }) => (expanded ? theme.colors.cover2 : 'transparent')};
    border-radius: 0px 12px 12px 0px;
    content: ' ';
  }
`;
export default ({
  dataSource,
  loading,
  columns,
  rowKey,
  onRowClick,
  expandedRowKeys = [],
  expandedRowRender,
  locale = {},
}) => {
  const rowClick = useCallback(
    (item) => {
      if (onRowClick) {
        onRowClick(item);
      }
    },
    [onRowClick],
  );
  return (
    <Spin spinning={loading}>
      <MiniTable>
        {dataSource.length > 0 ? (
          dataSource.map((dataItem) => {
            const expanded = expandedRowKeys.some((v) => v === dataItem[rowKey]);
            return (
              <ItemWrapper key={dataItem[rowKey]} expanded={expanded}>
                <Item
                  className="miniTableItem"
                  key={dataItem[rowKey]}
                  onClick={() => rowClick(dataItem)}
                >
                  {columns.map((column, columnIndex) => {
                    const {
                      dataIndex,
                      title,
                      render,
                      labelColorKey,
                      valueColorKey,
                      reverse,
                      expandedIcon,
                    } = column;

                    const getLabel = () => {
                      if (title && isFunction(title)) {
                        return title(dataItem[dataIndex], dataItem, columnIndex);
                      }
                      return title;
                    };

                    const getValue = () => {
                      if (render && isFunction(render)) {
                        return render(dataItem[dataIndex], dataItem, columnIndex);
                      }
                      return dataItem[dataIndex];
                    };

                    const getExpandedIcon = () => {
                      if (expandedIcon && isFunction(expandedIcon)) {
                        return expandedIcon(dataItem[dataIndex], dataItem, columnIndex);
                      }
                      return expandedIcon;
                    };

                    return reverse ? (
                      <TitleItemUnit key={dataIndex}>
                        <TitleUnitValue className="titleUnitValue" valueColorKey={valueColorKey}>
                          {getValue()}
                        </TitleUnitValue>
                        <UnitLabel labelColorKey={labelColorKey}>
                          {expandedIcon ? getExpandedIcon() : getLabel()}
                        </UnitLabel>
                      </TitleItemUnit>
                    ) : (
                      <ItemUnit key={dataIndex}>
                        <UnitLabel labelColorKey={labelColorKey}>{getLabel()}</UnitLabel>
                        <UnitValue valueColorKey={valueColorKey}>{getValue()}</UnitValue>
                      </ItemUnit>
                    );
                  })}
                </Item>
                {expanded ? expandedRowRender(dataItem) : null}
              </ItemWrapper>
            );
          })
        ) : (
          <EmptyBox>
            <Empty size="small" description={locale?.emptyText || _t('hoqk98pcivrSHjEds7SCJP')} />
          </EmptyBox>
        )}
      </MiniTable>
    </Spin>
  );
};
