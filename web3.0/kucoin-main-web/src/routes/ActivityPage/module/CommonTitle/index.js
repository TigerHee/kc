/**
 * Owner: willen@kupotech.com
 */
// i18n todo
import React from 'react';
import style from './style.less';
import { _t } from 'tools/i18n';
import { showDatetime } from 'helper';
import { ActivityStatus } from 'config/base';
import { useLocale } from '@kucoin-base/i18n';
import SpanForA from 'src/components/common/SpanForA';
const formate = 'YYYY-MM-DD HH:mm:ss';
const statusConfig = {
  [ActivityStatus.WAIT_START]: {
    value: 'wait_start',
    label: 'will.start',
  },
  [ActivityStatus.PROCESSING]: {
    value: 'processing',
    label: 'ongoing',
  },
  [ActivityStatus.WAIT_REWARD]: {
    value: 'pending_award',
    label: 'releasing',
  },
  [ActivityStatus.OVER]: {
    value: 'over',
    label: 'ended',
  },
};

export default (props) => {
  useLocale();
  const { title, startTime, endTime, status } = props;
  const { value, label } = statusConfig[status] || {};
  return (
    <div className={style.CommonTitle}>
      <h2>{title}</h2>
      <article>
        {startTime && endTime ? (
          <span>
            {showDatetime(startTime, formate)} ~ {showDatetime(endTime, formate)}
          </span>
        ) : null}
        {label ? (
          <SpanForA className={`${style[value]} ${style.link}`}>{_t(label)}</SpanForA>
        ) : null}
      </article>
    </div>
  );
};
