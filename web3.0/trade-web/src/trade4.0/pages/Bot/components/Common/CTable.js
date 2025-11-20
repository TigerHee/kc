/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { styled } from '@/style/emotion';
import { Flex, Text } from '../Widgets';
import { showDateTimeByZone } from 'Bot/helper';
import { _t } from 'Bot/utils/lang';

const screenTDWidth = {
  lg2: {
    tr: 'grid-template-columns: repeat(6, 1fr);',
    td: `&:last-of-type {
      text-align: right;
      align-items: flex-end;
    }`,
  },
  lg1: {
    tr: 'grid-template-columns: repeat(4, 1fr);  grid-row-gap: 12px;',
    td: `&:nth-of-type(4) {
      text-align: right;
      align-items: flex-end;
    }`,
  },
  lg: {
    tr: 'grid-template-columns: repeat(3, 1fr);  grid-row-gap: 12px;',
    td: `&:nth-of-type(3),&:last-of-type {
      text-align: right;
      align-items: flex-end;
    }`,
  },
};
const middleScreen = Object.keys(screenTDWidth);
const CTable = styled.div`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;

  [dir='rtl'] & {
    .middle-row {
      .bot-future-tag,
      .bot-price {
        unicode-bidi: isolate;
      }
    }
  }
  
  > div {
    border-bottom: 0.5px solid ${({ theme }) => theme.colors.divider4};
    transition: background-color 0.3s linear;
    &:hover {
      background-color: ${({ theme }) => theme.colors.cover2};
    }
    &:last-of-type {
      border: none;
    }
  }
  ${({ theme, screen }) => {
    if (screen === 'lg3') {
      return `.bot-RUNNING .running-dot {
        position: relative;
        &:before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: -11px;
          margin: auto;
          width: 5px;
          height: 5px;
          transform: rotate(45deg);
          flex-shrink: 0;
          border-radius: 1px;
          background-color: ${theme.colors.primary}
        }
      }`;
    }
    if (middleScreen.includes(screen)) {
      return `.bot-RUNNING .running-middle-dot {
        position: relative;
        padding-left: 11px;
        &:before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          width: 5px;
          height: 5px;
          transform: rotate(45deg);
          flex-shrink: 0;
          border-radius: 1px;
          background-color: ${theme.colors.primary}
        }
      }`;
    }
  }}
`;

// 小屏幕
const smScreen = ['sm', 'md'];
const CTR = styled.div`
  padding: 8px 12px 8px 20px;
  ${({ screen }) => {
    if (screen === 'lg3') {
      return `
      padding-left: 0;
      .CTable-TD {
        &:first-of-type {
          padding-left: 20px;
        }
      }
      `;
    }
  }}

  ${({ screen, theme }) => {
    if (smScreen.includes(screen)) {
      return `
      padding: 16px 12px 16px 12px;
      .CTable-TD {
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 10px;
        &:first-of-type {
          flex-direction: column;
          >div {
            margin-bottom: 4px
          }
        }
        &:last-of-type {
          justify-content: flex-end;
        }
        >div.TD-value {
          text-align: right;
        }

      }
      .sm-split {
        display: none
      }
      .sm-two-label {
        display: flex;
        flex-direction: column;
        >span {
          &:first-of-type {
            margin-bottom: 10px
          }
        }
      }
      .sm-two-value {
        flex-direction: column;
        display: flex;
        align-items: flex-end;
        >div {
          &:first-of-type {
            margin-bottom: 10px
          }
        }
      }
      .sm-row {
        >span, >div {
          display: inline-flex;
        }
      }
      .sm-row-sb {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      `;
    }
    if (middleScreen.includes(screen)) {
      return `
      >div:last-of-type {
        .CTable-TD {
          >div:first-of-type {
            margin-bottom: 6px;
          }
        }
      }

      .middle-row {
        display: flex;
        align-items: center;
      }
      .middle-arbitrage {
        margin-left: 16px;
      }
      `;
    }
    if (screen === 'lg3') {
      return `
      .CTable-TD {
        >div:first-of-type {
          margin-bottom: 2px;
        }
        &:last-of-type {
          align-items: flex-end;
        }
      }
      `;
    }
  }}
  .history-lists & {
    .only-show-sm {
      ${({ screen }) => {
        if (!smScreen.includes(screen)) {
          return 'display: none';
        }
      }}
    }
    .only-show-not-sm {
      ${({ screen }) => {
        if (smScreen.includes(screen)) {
          return 'display: none';
        }
      }}
    }
    ${({ screen }) => {
      if (smScreen.includes(screen)) {
        return `.CTable-TD {
      &:last-of-type {
        .history-operation {
          width: 100%;
          > div {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
      }
    }`;
      }
    }}
  }
`;
const CTD = styled(Flex)`
  padding: 0 2px;
  overflow: hidden;
  flex-direction: column;
  word-wrap: break-word;
  word-break: break-word;
  ${({ screen }) => {
    if (middleScreen.includes(screen)) {
      return `
      justify-content: flex-start;
      ${screenTDWidth[screen].td}
      `;
    }
    return 'justify-content: center;';
  }}
`;
const Grid = styled.div`
  display: grid;
  ${({ screen }) => {
    return screenTDWidth[screen].tr;
  }}
`;

const runningColumn = [18, 10, 10, 10, 10, 11, 10, 12];
const historyColumn = [18, 10, 10, 10, 10, 11, 10, 8];
const TableContext = React.createContext();
/**
 * @description:
 * @params {string} type (history, running)
 * @return {*}
 */
const Table = ({ columnRatio, children, screen, className, type }) => {
  const contextValue = React.useMemo(() => {
    columnRatio = columnRatio || (type === 'running' ? runningColumn : historyColumn);
    const total = columnRatio.reduce((p, n) => p + n, 0);
    return {
      columnRatio: columnRatio.map((el) => `${((el / total) * 100).toFixed(2)}%`),
      screen,
    };
  }, [columnRatio, screen, type]);
  return (
    <TableContext.Provider value={contextValue}>
      <CTable className={`CTable ${className}`} screen={screen}>
        {children}
      </CTable>
    </TableContext.Provider>
  );
};

/**
 * @description: tr 具有自适应能力
 * @param {*} children
 * @param {*} className
 * @param {array} rest
 * @return {*}
 */
const TR = ({ children, className, ...rest }) => {
  const { columnRatio: cRatio, screen } = React.useContext(TableContext);
  let newChildren = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child?.type?.displayName === 'CTableTD',
  );
  // 给第一个和最后一个 增加className方便响应式 控制
  newChildren = newChildren.map((child, index) => {
    const props = child.props || {};
    if (index === 0) {
      return React.cloneElement(child, {
        ...props,
        className: `${props.className} CTableTD-first`,
      });
    } else if (index === newChildren.length - 1) {
      return React.cloneElement(child, {
        ...props,
        className: `${props.className} CTableTD-last`,
      });
    }
    return child;
  });

  let finalNode = newChildren;

  let trStyle = {};
  if (screen === 'lg3') {
    finalNode = newChildren.map((child, index) => {
      return React.cloneElement(child, {
        style: { width: cRatio[index], ...child.props.style },
      });
    });
    trStyle = { display: 'flex' };
  } else if (middleScreen.includes(screen)) {
    // 这几个尺寸下需要 将第一个TD 最后第一个TD放到一行
    const first = newChildren.shift();
    const last = newChildren.pop();
    const newRow = [];
    newRow.push(first, last);
    finalNode = (
      <React.Fragment>
        <Flex vc sb mb={10}>
          {newRow}
        </Flex>
        <Grid screen={screen}>{newChildren}</Grid>
      </React.Fragment>
    );
  }

  return (
    <CTR className={`CTable-TR ${className}`} {...rest} style={trStyle} screen={screen}>
      {finalNode}
    </CTR>
  );
};
const tdChildClassName = ['TD-label', 'TD-value'];
const TD = ({ children, className, ...rest }) => {
  const { screen } = React.useContext(TableContext);
  let finalNode = children;
  // 给只有两个child 的,添加className, 方便响应式控制
  // 排除第一个CTableTD-first 和最后一个CTableTD-last
  const newChildren = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child),
  );
  //  不是第一个 和最后一个
  const notFirstAndLastTD =
    !className?.includes('CTableTD-first') && !className?.includes('CTableTD-last');
  if (newChildren.length === 2 && notFirstAndLastTD) {
    finalNode = newChildren.map((child, index) => {
      const props = child.props || {};
      return React.cloneElement(child, {
        ...props,
        className: `${props.className ?? ''} ${tdChildClassName[index]}`,
      });
    });
  }

  return (
    <CTD screen={screen} className={`CTable-TD ${className ?? ''}`} {...rest}>
      {finalNode}
    </CTD>
  );
};
TD.displayName = 'CTableTD';

const TimeBox = styled.div`
  ${({ screen }) => {
    if (screen === 'lg3') {
      return 'text-align: right';
    } else if (screen === 'lg2' || screen === 'lg1') {
      return `
    display: flex;
    >div:first-of-type {
      margin-right: 4px
    }
    `;
    } else if (screen === 'lg') {
      return 'text-align: right';
    }
    return '';
  }}
`;
/**
 * @description: 历史记录里面的结束时间用
 * @param {*} endTime
 * @return {*}
 */
const EndTime = React.memo(({ endTime }) => {
  const { screen } = React.useContext(TableContext);
  let time = showDateTimeByZone(endTime);
  if (screen === 'lg3') {
    time = time.replace(/\s+/, '<br/>');
  }
  return (
    <TimeBox screen={screen}>
      <Text as="div" color="text30">
        {_t('card3')}
      </Text>
      <Text as="div" color="text60" dangerouslySetInnerHTML={{ __html: time }} />
    </TimeBox>
  );
});

export { Table, TR, TD, EndTime };
