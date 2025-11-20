/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useContext } from 'react';
import { RowWrapper, ColWrapper } from '../../style';
import { WrapperContext } from '../../config';

/**
 * Row
 */
const Row = (props) => {
  const { children, ...restProps } = props;
  const screen = useContext(WrapperContext);

  const isMd = screen === 'md';
  return (
    <RowWrapper md={isMd} {...restProps}>
      {children}
    </RowWrapper>
  );
};

export default memo(Row);

export { ColWrapper as Col };
