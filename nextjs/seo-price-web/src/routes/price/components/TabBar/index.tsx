/**
 * Owner: will.wang@kupotech.com
 */
import { Input, Tabs } from '@kux/mui-next';
import { useCallback, useMemo, useRef, useState } from 'react';
import JsBridge from "gbiz-next/bridge";
import { addLangToPath } from 'src/tools/i18n';
import { useRouter } from 'kc-next/compat/router';
import { Label2Key, TAB_LIST } from './constant';
import styles from './styles.module.scss';
import clsx from 'clsx';
import { usePriceStore } from '@/store/price';
import searchIconPath from '@/assets/markets/Search.svg';
import useTranslation from '@/hooks/useTranslation';
import { useDebounceFn, useEventListener } from 'ahooks';
import { trackClick } from 'gbiz-next/sensors';

const { Tab } = Tabs;

const TabBar = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const getListByKeyword = usePriceStore(s => s.getListByKeyword);
  const keywords = usePriceStore((state) => state.keywords);

  const pathname = router?.pathname || '';
  const page = router?.query.page || 1;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState(keywords);
  const [sticky, setSticky] = useState(false);
  const isInApp = JsBridge.isApp();

  const totalHeaderHeight = usePriceStore(s => s.totalHeaderHeight);

  const tabActiveHandle = useCallback((e, label) => {
    trackClick(['BScoinPrice', ['FilterTab', `${Label2Key[label]}`]]);
  }, []);

  const filterInNo1 = useDebounceFn(
    (value: string) => {
      getListByKeyword({ keywords: value, currentPage: value ? 1 : Number(page) });
    },
    { wait: 1000 }
  );

  const seachChangeHandle = useCallback(
    (e: any) => {
      setSearch(e.target.value);
      filterInNo1.run(e.target.value);
    },
    [filterInNo1],
  );

  const searchEnterHandle = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      getListByKeyword({ keywords: e.currentTarget.value, currentPage: e.currentTarget.value ? 1 : Number(page) });
    },
    [getListByKeyword, page],
  );

   const handleScroll = useDebounceFn(() => {
      if (wrapperRef?.current) {
        const { top } = wrapperRef.current.getBoundingClientRect();
        if (top <= totalHeaderHeight && !sticky) {
          setSticky(true);
        }
        if (top > totalHeaderHeight && sticky) {
          setSticky(false);
        }
      }
    }, { wait: 6 });

  useEventListener('scroll', handleScroll.run);

  const currentValue = useMemo(() => {
    if (pathname.startsWith('/price/page')) {
      return '/price'
    }

    return pathname;
  }, [pathname]);

  const isSticky = isInApp ? false : sticky;

  return (
    <div ref={wrapperRef}>
      <div className={clsx(styles.tabBarWrap, isSticky && styles.sticky)} style={{ top: sticky ? totalHeaderHeight : '0' }}>
        <div className={styles.tabWrap}>
          <Tabs
            value={currentValue}
            onChange={tabActiveHandle}
            bordered={false}
          >
            {TAB_LIST.map((item) => {
              let isActive = currentValue === item.value;

              if (item.value === TAB_LIST[0].value) {
                isActive = currentValue === '/price';
              }
              
              return (
                <Tab
                  data-inspector={item.inspector}
                  key={item.value}
                  value={item.value}
                  label={
                    <a
                      className={clsx(styles.tabTitle, isActive && styles.isActive)}
                      href={`${addLangToPath(item.value)}`}
                    >{t(item.label)}</a>
                  }
                />
              )
            })}
          </Tabs>
        </div>
        <div className={styles.searchBox} >
          <div className={styles.searchInput}>
            <Input
              data-inspector="price-list-search"
              allowClear
              value={search}
              onChange={seachChangeHandle}
              onEnterPress={searchEnterHandle}
              placeholder={t('nKoD2AJqBbnpQDDQpJsa3v')}
              prefix={<img src={searchIconPath} className={styles.searchIconNormal} alt='search icon' />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabBar;