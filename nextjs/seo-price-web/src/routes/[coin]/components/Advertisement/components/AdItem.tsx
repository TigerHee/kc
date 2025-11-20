/**
 * Owner: kevyn.yu@kupotech.com
 */
import Link from '@/components/common/Router/link';

import ActivityIcon from '@/assets/coinDetail/ad-activity-icon.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import { ReactComponent as CloseIcon } from '@/assets/coinDetail/ad-close-icon.svg';
import CloseIcon from '@/assets/coinDetail/ad-close-icon.svg';  
import TopicIcon from '@/assets/coinDetail/ad-topic-icon.svg';
import { BIZ_TYPE } from '../config';

import styles from './style.module.scss';
import clsx from 'clsx';
import storage from 'gbiz-next/storage';

const AdItem = (props) => {
  const { id, bizType: type, title, link, onRemove, onClick, full } = props;

  return (
    <Link
      type={type}
      onClick={onClick}
      to={link}
      dontGoWithHref={true}
      className={clsx(styles.wrapperLink, {
        [styles.bizActivity]: type === BIZ_TYPE.ACTIVITY
      })}>
      <div
        className={clsx(styles.styledIcon, {
          [styles.unread]: !(storage.getItem('price_ad_read') || []).includes(id),
        })}
        style={{
          background: `url(${type === BIZ_TYPE.ACTIVITY ? ActivityIcon : TopicIcon})`,
        }}
      />
      <span
        className={clsx(styles.title, {
          [styles.typeActivity]: type === BIZ_TYPE.ACTIVITY,
          [styles.full]: full,
        })}>
        {title}
      </span>
      <img src={CloseIcon} onClick={onRemove} className={styles.closeIcon} />
    </Link>
  );
};

export default AdItem;