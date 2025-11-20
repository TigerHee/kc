/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { ICTriangleBottomOutlined } from '@kux/icons';
import { useTheme } from '@emotion/react';

export default () => {
  const { colors } = useTheme();
  return <ICTriangleBottomOutlined size={12} color={colors.icon} />;
};
