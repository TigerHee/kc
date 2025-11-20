/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import { isNull } from 'Bot/helper';
import SideTag, { MarketType } from 'Bot/components/Common/SideTag';
import { Div, Text, Flex } from 'Bot/components/Widgets';
import { MIcons } from 'Bot/components/Common/Icon';
import { _t, _tHTML } from 'Bot/utils/lang';
import FutureTag from 'Bot/components/Common/FutureTag';

const Table = styled.table`
  margin-top: 16px;
  border-collapse: collapse;
  color: ${({ theme }) => theme.colors.text60};
  font-size: 12px;
  width: 100%;
  thead {
    td {
      padding: 0 2px 12px;
      color: ${(props) => props.theme.colors.text30};
    }
  }
`;
const TR = styled('tr')`
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  &:last-of-type {
    border: none;
  }
  ${({ hasHover, theme }) => {
    if (hasHover) {
      return {
        cursor: 'pointer',
        '&: hover': {
          backgroundColor: theme.colors.cover2,
        },
      };
    }
  }}
  > td {
    padding: 16px 2px 16px;
    line-height: 130%;
    &:first-of-type {
      padding-left: 0;
    }
    &:last-of-type {
      padding-right: 0;
    }
  }
`;
const TD = styled.td`
  ${({ isLastOne }) => {
    if (isLastOne) {
      return `
      text-align: right;
      svg {
          vertical-align: middle;
      }`;
    }
  }}
`;
const Span = styled.span`
  display: inline-block;
  vertical-align: middle;
`;

/**
 * @description: 合并inSameColumn同类项
 * @param {*} lists
 * @return {*}
 */
const group = (lists) => {
  const results = [];

  // 先将同组要的分离成map
  const inSameColumnMap = {};
  lists.forEach((list) => {
    const sameId = list.inSameColumn;
    if (sameId) {
      if (!inSameColumnMap[sameId]) {
        inSameColumnMap[sameId] = [];
      }
      inSameColumnMap[sameId].push(list);
    }
  });
  // 再重新组装数据
  lists.forEach((el) => {
    if (el.inSameColumn === undefined) {
      results.push(el);
    } else {
      const sameId = el.inSameColumn;
      const sameColumn = inSameColumnMap[sameId];
      if (sameColumn) {
        results.push(sameColumn);
        delete inSameColumnMap[sameId];
      }
    }
  });
  return results;
};
/**
 * @description: 一个td显示两列的td head
 * @param {*} list
 * @return {*}
 */
const inSameLabel = (list) => {
  return (
    <>
      <div>{list[0].label}/</div>
      <div>{list[1].label}</div>
    </>
  );
};
/**
 * @description:
 * @return {*}
 */
const DashEmpty = () => <Text color="text">--</Text>;
/**
 * @description: 单个td展示的内容
 * @param {*} column
 * @return {*}
 */
const showContent = (column) => {
  if (isNull(column.value)) {
    return <DashEmpty />;
  }
  return (
    <>
      <Div color="text">{column.value}</Div>
      <Text color="text40">{column.unit}</Text>
    </>
  );
};
/**
 * @description: 一个td显示两列数据的内容
 * @param {*} column
 * @return {*}
 */
const inSameValue = (column) => {
  return (
    <>
      <div>
        <Text color="text">{column[0].value ?? <DashEmpty />}</Text>
        &nbsp;
        <Text color="text40" >
          {column[0].unit}
        </Text>
      </div>
      <div>
        <Text color="text">{column[1].value ?? <DashEmpty />}</Text>
        &nbsp;
        <Text color="text40">
          {column[1].unit}
        </Text>
      </div>
    </>
  );
};
const THead = ({ lists }) => {
  lists = group(lists);
  return (
    <thead>
      <tr>
        <td>{_t('smart.finishtime')}</td>
        {lists.map((list, index) => {
          return (
            <TD key={index} isLastOne={lists.length === index + 1}>
              {Array.isArray(list) ? inSameLabel(list) : list.label}
            </TD>
          );
        })}
      </tr>
    </thead>
  );
};
const RowTd = ({ hasArrow, isLastOne, children }) => {
  let content = children;
  if (hasArrow && isLastOne) {
    content = (
      <>
        <Span>{children}</Span>
        <MIcons.ArrowRight color="icon" size={16} className="ml-4" />
      </>
    );
  }
  return <TD isLastOne={isLastOne}>{content}</TD>;
};
const Gap = styled(Flex)`
  flex-wrap: wrap;
  grid-row-gap: 4px;
`;
const TRow = ({ item }) => {
  const lists = group(item.lists);
  return (
    <TR hasHover={item.hasArrow} onClick={item.onClick} className="lh-22">
      <td>
        <Div fs={14} fw={500} color="text">
          {item.symbolNameText}
        </Div>
        <Gap className="mt-4 mb-4">
          <SideTag side={item.side} />
          <MarketType type={item.type} className="mr-4" />
          {item.Tag || <FutureTag direction={item.direction} leverage={item.leverage} />}
        </Gap>
        <div>{item.time}</div>
      </td>
      {lists.map((column, index) => {
        let content = '';
        if (Array.isArray(column)) {
          content = inSameValue(column);
        } else {
          content = showContent(column);
        }
        return (
          <RowTd hasArrow={item.hasArrow} isLastOne={lists.length === index + 1}>
            {content}
          </RowTd>
        );
      })}
    </TR>
  );
};

const StopTable = React.memo(({ items }) => {
  return (
    <Table>
      <THead lists={items[0].lists} />
      <tbody>
        {items.map((item, index) => {
          return <TRow item={item} key={`${item.id}-${index}`} />;
        })}
      </tbody>
    </Table>
  );
});

export default StopTable;
