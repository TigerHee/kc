/**
 * Owner: will.wang@kupotech.com
 */
import { useEffect, useRef, useState } from 'react';
import { trackClick } from 'gbiz-next/sensors';
import styles from './style.module.scss';
import { saTrackForBiz } from '@/tools/ga';

const Link = ({ info, position, onClick }) => {
  const elRef = useRef<HTMLDivElement>(null);

  const [storageIdList, setStorageIdList] = useState<string[]>([]);
  const reg = new RegExp(`.+kucoin.+\/kucoins`);
  
  useEffect(() => {
    let observer;
    if (elRef.current) {
      //曝光埋点
      observer = new IntersectionObserver(
        (entries) => {
          (entries || []).map((e) => {
            if (e.intersectionRatio > 0) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const key = e.target?.dataset?.key;
              if (storageIdList.some((item) => item === key)) return;

              try {
                // TODO check参数
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                saTrackForBiz({}, ['currencyMoreInformation', '2'], {
                  position: position === 'currency' ? 'What is currency' : 'FAQ',
                  url: key,
                  pagecate: 'url',
                  yesOrNo: reg.test(key) ? 1 : 0,
                });
                
                let newList: string[] = storageIdList;
                newList.push(key);
                setStorageIdList(newList);
              } catch (e) {
                console.log('e', e);
              }
            }
          });
        },
        { threshold: [0.1] },
      );

      // TODO 调查这里是否能执行。。
      // (elRef.current || []).map((item) => {
      //   if (item) observer.observe(item);
      // });
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);
  
  return (
    <div className={styles.wrapper} ref={elRef} data-key={info.href}>
      <a
        className={styles.link}
        href={info.href}
        rel="noopener noreferrer nofollow"
        target="_blank"
        onClick={(event) => {
          try {
            if (onClick) {
              onClick(event);
            }
            trackClick(['currencyMoreInformation', '2'], {
              position: position === 'currency' ? 'What is currency' : 'FAQ',
              url: info.href,
              pagecate: 'url',
              yesOrNo: reg.test(info.href) ? 1 : 0,
            });
          } catch (e) {
            console.log('e', e);
          }
        }}
      >
        {info.text}
      </a>
    </div>
  );
};

export default Link;
