/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

function useStickyOffsets(colWidths, columnCount) {
  const stickyOffsets = React.useMemo(() => {
    const leftOffsets = [];
    const rightOffsets = [];
    let left = 0;
    let right = 0;

    for (let start = 0; start < columnCount; start += 1) {
      leftOffsets[start] = left;
      left += colWidths[start] || 0;

      const end = columnCount - start - 1;
      rightOffsets[end] = right;
      right += colWidths[end] || 0;
    }

    return {
      left: leftOffsets,
      right: rightOffsets,
    };
  }, [colWidths, columnCount]);

  return stickyOffsets;
}

export default useStickyOffsets;
