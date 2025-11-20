/**
 * Owner: jesse.shao@kupotech.com
 */


import { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import RenderCMS from '../RenderCMS';
import { useIsMobile } from 'components/Responsive';

import style from './style.less';

export default () => {

  const isMobile = useIsMobile();

  return (
    <div className={clsx(style.going_wrapper, isMobile ? style.going_wrapper_h5 : '')}>
      <RenderCMS
        run="com.landing.guardian.project"
      />
    </div>
  );
}
