/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import Cell from '../Cell/Cell';
import Row from '../Row';
import { TableExpandedRowContext, TableContext } from '../cts/cts';

const ExpandRowRoot = styled(Row)`
  display: ${(props) => (props.expanded ? null : 'none')};
`;

const ExpandRow = ({ expanded, children, isEmpty, colSpan, className, ...others }) => {
  const { scrollbarSize } = React.useContext(TableContext);
  const { fixHeader, fixColumn, componentWidth, horizonScroll } = React.useContext(
    TableExpandedRowContext,
  );

  const node = React.useMemo(() => {
    let contentNode = children;
    if (isEmpty ? horizonScroll : fixColumn) {
      contentNode = (
        <div
          style={{
            width: componentWidth - (fixHeader ? scrollbarSize : 0),
            position: 'sticky',
            left: 0,
            overflow: 'hidden',
            margin: '-12px -12px',
            padding: '12px 12px',
          }}
        >
          {contentNode}
        </div>
      );
    }
    return (
      <ExpandRowRoot expanded={expanded} className={className} {...others}>
        <Cell isEmpty={isEmpty} component="td" colSpan={colSpan}>
          {contentNode}
        </Cell>
      </ExpandRowRoot>
    );
  }, [
    children,
    className,
    colSpan,
    componentWidth,
    expanded,
    fixColumn,
    fixHeader,
    horizonScroll,
    isEmpty,
    others,
    scrollbarSize,
  ]);

  return node;
};

export default ExpandRow;
