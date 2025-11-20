/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import KCSvgIcon from 'components/common/KCSvgIcon';
import { useTheme } from '@kux/mui';

export default ({ size, ...others }) => {
  const theme = useTheme();
  return (
    <div {...others}>
      <KCSvgIcon
        iconId="rocket"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          color:
            theme.currentTheme === 'light' ? `${theme.colors.cover20}` : `${theme.colors.text}`,
        }}
      />
    </div>
  );
};
