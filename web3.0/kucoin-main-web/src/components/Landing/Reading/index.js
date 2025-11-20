/**
 * Owner: ella.wang@kupotech.com
 */
import React, { useCallback } from 'react';
import { useResponsive } from '@kux/mui';
import { trackClick } from 'utils/ga';
import ReadCard from './components/ReadCard';
import { CardWrapper } from './index.style';

export default ({ list }) => {
  const responsive = useResponsive();

  const handleClick = useCallback((item) => {
    if (item.blokid) {
      trackClick([item.blokid, '1']);
    }
  }, []);

  return (
    <CardWrapper>
      {list.map((item) => {
        return (
          <ReadCard
            icon={responsive.sm ? item.lgIcon : item.smIcon}
            title={item.title}
            description={item.description}
            key={item.id}
            url={item.url}
            onClick={(item) => handleClick(item)}
          />
        );
      })}
    </CardWrapper>
  );
};
