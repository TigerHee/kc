import { useState, useRef } from 'react';
import { debounce } from 'lodash-es';
import { useResponsive } from '@kux/design';
import useObserver from '@/hooks/useObserver';
import useRTL from '@/hooks/useRTL';
import Pagination from '@/components/CommonComponents/Pagination';
import useTranslation from '@/hooks/useTranslation';
import { getSecurityContent } from '../config';
import styles from './styles.module.scss';

const PagerShow = () => {
  const { t } = useTranslation();
  const rs = useResponsive();
  const isRTL = useRTL();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(0);
  const [width, setWidth] = useState(0);
  const [showProgress, setShowProgress] = useState(0);

  const isSm = rs === 'sm';

  useObserver({
    elementRef: wrapperRef,
    callback: debounce(() => {
      setWidth(wrapperRef?.current?.offsetWidth || 0);
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
      <div ref={wrapperRef} className={styles.pager}>
        <div style={{ transform: `translateX(${translateX}px)` }} className={styles.PagerScroll}>
          {[0, 1, 2].map(step => {
            const data = getSecurityContent(step, t);
            const isShowInView = getisShowInView(step);

            return (
              <div key={step} className={styles.h5HighlightsContent} style={{ minWidth: listWidth }}>
                {isShowInView ? (
                  <>
                    <h3>{data.title}</h3>
                    {data.desc?.map(({ summary, detail }) => (
                      <div key={summary} className={styles.desc}>
                        <div>{summary}</div>
                        <div>{detail}</div>
                      </div>
                    ))}
                  </>
                ) : null}
              </div>
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
      </div>
    </>
  );
};

export default PagerShow;
