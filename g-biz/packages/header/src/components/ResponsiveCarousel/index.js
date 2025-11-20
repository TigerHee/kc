/**
 * Owner: solar@kupotech.com
 */
import { Carousel } from '@kux/mui';
import { memo } from 'react';
// import useUpdateKey from 'src/hooks/useUpdateKey';

const ResponsiveCarousel = ({ children, ...config }) => {
  //   const updateKey = useUpdateKey();
  return (
    <Carousel
      // key={updateKey}
      {...config}
    >
      {children}
    </Carousel>
  );
};

export default memo(ResponsiveCarousel);
