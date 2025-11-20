/**
 * Owner: jesse.shao@kupotech.com
 */


import clsx from 'clsx';
import { useIsMobile } from 'components/Responsive';
import RenderCMS from '../RenderCMS';
import { _t } from 'utils/lang';

import style from './style.less';

export default () => {

  const isMobile = useIsMobile();

  return (
    <div className={clsx(style.part, 'motivation_wrapper', isMobile ? style.part_h5 : '')}>
        <div className={clsx(style.title, 'part_title')}>{_t('guardian.projectIncentive')}</div>
        <div className={clsx(style.content, 'part_content')}>
        <RenderCMS
          run="com.landing.guardian.motivation"
        />
        </div>
    </div>
  );
}
