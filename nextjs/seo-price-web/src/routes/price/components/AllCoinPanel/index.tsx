/**
 * Owner: mage.tai@kupotech.com
 */
import { ICArrowRightOutlined } from '@kux/icons';
import { Spin } from '@kux/mui-next';
import NameBox from '../NameBox';
import { addLangToPath } from "@/tools/i18n";
import { trackClick } from 'gbiz-next/sensors';
import styles from './styles.module.scss';
import PaginationWidthUrl from '@/components/common/PaginationWithUrl';
import Image from 'next/image';
import useTranslation from '@/hooks/useTranslation';
import { usePriceStore } from '@/store/price';
import { useEventListener, useRequest } from 'ahooks';
import TradeIcon from '@/assets/price/trade.svg';
import { getSiteConfig } from 'kc-next/boot';
import { saveSpm2NextUrl } from '@/tools/ga';
import clsx from 'clsx';
import useRTL from '@/hooks/useRTL';


const AllCoinPanel = () => {
  const isRTL = useRTL();
  const { t } = useTranslation();
  const records= usePriceStore((state) => state.records);
  const keywords= usePriceStore((state) => state.keywords);
  const pagination= usePriceStore((state) => state.pagination);
  const getListByKeyword = usePriceStore(s => s.getListByKeyword);

  const { loading, run: runGetAll } = useRequest(getListByKeyword, { manual: true});


  useEventListener('pagechange', () => {
    const url = new URL(window.location.href);
    const match = url.pathname.match(/\/price\/page\/(\d+)/);
    const page = match ? match[1] : null;
    getListByKeyword({ keywords, currentPage: page ? Number(page) : 1 })
  });


  return (
    <Spin spinning={loading} type="normal">
      <section>
        {/* theme={theme} */}
        <ul className={styles.allCoinPanelWrap}  data-inspector="inspector_allPanel">
          {records.map((item, index) => {
            const hrefPros: { href?: string; } = {};
            if (item.symbol) {
              hrefPros.href = addLangToPath(`${getSiteConfig().KUCOIN_HOST}/trade/${item.symbol.toUpperCase()}`)
            }
            const priceUrl = addLangToPath(`${getSiteConfig().KUCOIN_HOST}/price/${item.code.toUpperCase()}`)
            return (
              <li className={clsx(styles.item, {
                [styles.isLeft]: isRTL ? index % 2 : !(index % 2),
              })}
                onClick={(e) => {
                  trackClick(['B5CoinsPriceHomePage', ['coinsDetail', '1']], {
                    symble: item.code,
                    currency: item.code,
                    after_page_id: 'B5CoinPriceDetails',
                    type: 'all',
                    norm_version: 1,
                    sortPosition: index + 1,
                  });
                  // 进入price详情界面存储pre_spm_id;
                  saveSpm2NextUrl(priceUrl, "kcWeb.B5CoinsPriceHomePage.coinsDetail.1");
                }}
                key={item.code}
                
              >
                <div className={styles.itemContent}>
                  <span className={styles.itemOrder}>
                    {pagination.current === 1 && index < 9
                      ? `0${index + 1}`
                      : (pagination.current - 1) * 100 + index + 1}
                  </span>

                  <NameBox
                    iconUrl={item.logo}
                    fullName={item.coinName}
                    code={item.code}
                    href={priceUrl}
                    target="_blank"
                    rel="opener"
                  />
                </div>
                <div className={styles.action}>
                  <a className={clsx(styles.iconWrapper, {
                    [styles.traded]: !!item.symbol
                  })}
                    {...hrefPros}
                    data-inspector="trade-link"
                    target="_blank"
                  >
                    <Image width={20} height={20} src={TradeIcon} alt="icon" />
                    <span>{t('57TsvnskfMw8iRLL1Asf55')}</span>
                  </a>
                  <a
                    href={priceUrl}
                    data-inspector="detail-link"
                  >
                    <ICArrowRightOutlined size={16} color="rgba(115, 126, 141, 1)" className={styles.arrowIcon}/>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
        <div className={styles.paginationWrap}>
          <PaginationWidthUrl
            basePath="/price"
            firstPage="/price"
            pagination={pagination}
            shouldNotJump={!!keywords}
          />
        </div>
      </section>
    </Spin>
  );
};

export default AllCoinPanel;