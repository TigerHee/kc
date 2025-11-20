/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

function ColGroup(props) {
  const { colWidths, columns, columCount } = props;
  const cols = [];
  const len = columCount || columns.length;

  let mustInsert = false;
  for (let i = len - 1; i >= 0; i -= 1) {
    const width = colWidths[i];
    if (width || mustInsert) {
      cols.unshift(<col key={i} style={{ width }} />);
      mustInsert = true;
    }
  }

  return <colgroup>{cols}</colgroup>;
}

export default ColGroup;
