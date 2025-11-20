import { useState } from 'react';
import { debounce } from 'lodash-es';
import { useResponsive } from '@kux/design';
import useObserver from '@/hooks/useObserver';
import useRTL from '@/hooks/useRTL';
import Pagination from '@/components/CommonComponents/Pagination';
import CoinList from '../CoinList';
import styles from './styles.module.scss';
import { calculateDelayTime } from '@/components/CommonComponents/Animations/AnimatedContent/utils';
import AnimatedContent from '@/components/CommonComponents/Animations/AnimatedContent';

const PagerShow = ({ renderList, wrapperRef, viewMoreEl }) => {
  const rs = useResponsive();
  const isRTL = useRTL();

  const [page, setPage] = useState(0);
  const [width, setWidth] = useState(0);
  const [showProgress, setShowProgress] = useState(0);

  const isSm = rs === 'sm';

  useObserver({
    elementRef: wrapperRef,
    callback: debounce(() => {
      setWidth(wrapperRef.current?.offsetWidth);
    }, 100),
  });

  const gap = isSm ? 16 : 32;
  const listWidth = isSm ? width : (width - gap) / 2;
  const direction = isRTL ? 1 : -1;
  const translateX = page ? direction * (page * (listWidth + gap)) : 0;
  const maxPage = isSm ? 2 : 1;

  const getisShowInView = index => {
    if (index === 0) {
      return true;
    }
    if (index === 1) {
      return isSm ? showProgress >= 1 : true;
    }
    if (index === 2) {
      return showProgress >= maxPage;
    }
  };

  return (
    <>
      <div ref={wrapperRef} data-inspector="inspector_home_top_coins_list" className={styles.pager}>
        <div style={{ transform: `translateX(${translateX}px)` }} className={styles.PagerScroll}>
          {renderList.map(({ title, list, track }, index) => {
            const delay = calculateDelayTime(index, 0.2);
            return (
              <AnimatedContent key={track} delay={delay}>
                <CoinList
                  key={track}
                  track={track}
                  title={title}
                  list={list}
                  style={{ minWidth: listWidth }}
                  isShowInView={getisShowInView(index)}
                />
              </AnimatedContent>
            );
          })}
        </div>
      </div>
      <div className={styles.ListController}>
        <Pagination
          onLeft={() => {
            if (page === 0) {
              return;
            }
            setPage(page - 1);
          }}
          onRight={() => {
            if (page === maxPage) {
              return;
            }
            setPage(page + 1);
            setShowProgress(Math.max(page + 1, showProgress));
          }}
          leftDisabled={page === 0}
          rightDisabled={page === maxPage}
        />

        {viewMoreEl}
      </div>
    </>
  );
};

export default PagerShow;
