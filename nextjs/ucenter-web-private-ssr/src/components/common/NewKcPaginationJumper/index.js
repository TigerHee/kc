/**
 * Owner: willen@kupotech.com
 */
import { Pagination } from '@kux/mui';
import useObserver from 'hooks/useResizeObserver';
import { useState } from 'react';
import { Jumper } from './styled';

export default (props) => {
  const { total, current, pageSize, onChange, ...otherProps } = props;
  const [screenSize, setScreenSize] = useState('large');
  const measuredRef = {
    current: document.body,
  };
  useObserver({
    elementRef: measuredRef,
    callback: () => {
      const clientWidth = window.innerWidth;
      if (clientWidth <= 1024 && clientWidth > 768) {
        setScreenSize('middle');
      } else if (clientWidth <= 768) {
        setScreenSize('small');
      } else {
        setScreenSize('large');
      }
    },
  });

  return (
    <Jumper>
      <Pagination
        simple={screenSize === 'small'}
        showJumpQuick
        total={total}
        current={current}
        pageSize={pageSize}
        onChange={(e, v) => {
          if (onChange) {
            onChange(Number(v));
          }
        }}
        {...otherProps}
      />
    </Jumper>
  );
};
