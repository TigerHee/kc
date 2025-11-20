/**
 * Owner: garuda@kupotech.com
 * 按值的长度来设置不同的 fontSize 大小, 是一个二维数组, [ 数值长度, style ]
 */
import React, { useMemo } from 'react';
import clsx from 'clsx';

import { styled } from '@/style/emotion';

const FormatBox = styled.div`
  font-size: 14px;
  line-height: 1.3;
`;

const FormatValue = styled.div`
  font-size: 14px;
  line-height: 1.3;
`;

const BASE_CONFIG = [
  ['4', { fontSize: '28px' }],
  ['6', { fontSize: '20px' }],
  ['9', { fontSize: '14px' }],
  ['x', { fontSize: '12px' }],
];

const FormatFontSize = ({ className, value, config, children }) => {
  const matchStyle = useMemo(() => {
    const baseConfig = config || BASE_CONFIG;
    const valueLength = String(value)?.replace('.', '')?.length || 1;
    let currentStyle = {};
    for (let i = 0; i < baseConfig.length; ++i) {
      const [matchLength, styles] = baseConfig[i];
      if (valueLength <= matchLength || matchLength === 'x') {
        currentStyle = styles;
        break;
      }
    }
    return currentStyle;
  }, [config, value]);

  return (
    <FormatBox className={clsx('format-box', className)}>
      <FormatValue className="format-value" style={matchStyle}>
        {value}
      </FormatValue>
      {children}
    </FormatBox>
  );
};

export default React.memo(FormatFontSize);
