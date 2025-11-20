import React from 'react';
import {CustomerServiceIcon} from '@kux/iconpack';
import { addLangToPath } from '@/tools/i18n';
import { trackClick } from 'gbiz-next/sensors';
import { Tooltip } from '@kux/design';
import useTranslation from '@/hooks/useTranslation';
import { saTrackForBiz } from '@/tools/ga';
import FixedItem from '../FixedItem';
import styles from './styles.module.scss';

let timePre = 0; // 时间记录
const downGa = (visible: boolean) => {
  if (visible && !timePre) {
    timePre = Date.now();
  }
  if (!visible && timePre) {
    const stay = Date.now() - timePre;
    timePre = 0;
    if (stay > 2000) {
      // 停留超过2s，上报
      saTrackForBiz({}, ['floatingMenu', '1'], {
        postTitle: 'help',
      });
    }
  }
};

const Support = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.supportBox}>
      <Tooltip
        placement="left"
        // leaveDelay={50}
        content={t('newhomepage.faq.tooltip')}
        onShow={() => downGa(true)}
        onHide={() => downGa(false)}
        trigger="hover"
        mobileTransform={false}
      >
        <FixedItem
          className={styles.support}
          href={addLangToPath('/support')}
          aria-label="support"
          target="_blank"
          rel="noopener noreferrer"
          data-inspector="inspector_fixed_support"
          onClick={() =>{
            trackClick(['floatingMenu', '1'], {
              postTitle: 'help',
              clickPosition: 'click',
            });
          }
          }
        >
          <CustomerServiceIcon />
        </FixedItem>
      </Tooltip>
    </div>
  );
};

export default Support;
