/**
 * Owner: kevyn.yu@kupotech.com
 */
import moment from 'moment';
import { useEffect, useState } from 'react';
// import { IS_TR_SITE } from 'src/utils/env';
// import { trackClick } from 'src/utils/ga';
// import storage from 'src/utils/storage';
// import { push } from 'utils/router';
import AdItem from './components/AdItem';
import styles from './style.module.scss';
import { useCoinDetailStore } from '@/store/coinDetail';
import storage from 'gbiz-next/storage';
import { trackClick } from 'gbiz-next/sensors';
import clsx from 'clsx';
import { bootConfig } from 'kc-next/boot';


const useAdList = () => {
  const [adList, setAdList] = useState<{
    id: string;
    startTime: number;
    endTime: number;
    link: string;
  }[]>([]);
  const { activities = [], topics = [] } = useCoinDetailStore(s => s.coinInfo)

  useEffect(() => {
    if (activities || topics) {
      const nowTime = moment.now();
      const filteredList = [...activities, ...topics].filter(
        (item) =>
          moment(item.startTime).valueOf() <= nowTime &&
          moment(item.endTime).valueOf() >= nowTime &&
          !(storage.getItem('price_ad_close') || []).includes(item.id),
      );
      setAdList(filteredList);
    }
  }, [activities, topics]);

  return [adList, setAdList] as const;
};

const Advertisement = () => {
  const [adList, setAdList] = useAdList();

  const handleRemove = (id: string) => {
    trackClick(['Spots', '2']);
    const closedAds = storage.getItem('price_ad_close') || [];
    storage.setItem('price_ad_close', [...closedAds.filter((item) => item !== id), id].slice(-2));
    setAdList((prevList) => prevList.filter((item) => item.id !== id));
  };

  const handleClick = ({ id, link }) => {
    trackClick(['Spots', '1']);
    const readAds = storage.getItem('price_ad_read') || [];
    storage.setItem('price_ad_read', [...readAds.filter((item) => item !== id), id].slice(-2));
    // 土耳其站不跳转
    if (bootConfig._BRAND_SITE_ !== 'TR') {
      window.location.href = link;
    }
  };

  return (
    <ul className={clsx(styles.wrapper, {
      [styles.hasItem]: !!(adList || []).length
    })} >
      {adList.map((item) => {
        return (
          <li key={item.id}>
            <AdItem
              key={item.id}
              {...item}
              full={adList.length === 1}
              onRemove={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemove(item.id);
              }}
              onClick={() => handleClick(item)}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default Advertisement;