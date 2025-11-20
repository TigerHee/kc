/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { styled } from '@kux/mui';

import { ABC_TYPE_CROSS } from './constant';
import { useShowAbnormal } from './hooks';

const AbnormalWrapper = styled.span`
  color: ${(props) => props.theme.colors.text30};
`;

const AbnormalBack = ({
  value = '',
  requiredKeys,
  type = ABC_TYPE_CROSS,
  placeholder = '--',
  children,
}) => {
  const showAbnormal = useShowAbnormal();
  const result = showAbnormal({ value, requiredKeys, type, placeholder });
  if (result === placeholder) {
    return <AbnormalWrapper>{placeholder}</AbnormalWrapper>;
  }
  return children || value;
};

export default React.memo(AbnormalBack);
