/**
 * Owner: kevyn.yu@kupotech.com
 */
import { Breadcrumb } from '@kux/mui-next';
import concatPath from '@/tools/concatPath';
import { useMemo } from 'react';
import useScreen from 'src/hooks/useScreen';
import styles from './styles.module.scss';
import useTranslation from '@/hooks/useTranslation';
import { addLangToPath } from '@/tools/i18n';
import { getSiteConfig } from "kc-next/boot";
import { useRouter } from 'kc-next/compat/router';
import { getTenantConfig } from '@/config/tenant';
import { useCategoriesStore } from '@/store/categories';
import dynamic from 'next/dynamic';
import { BreadcrumbLdJson } from 'gbiz-next/seo';
import CustomHead from '@/components/CustomHead';
import usePlatformSize from '@/hooks/usePlatformSize';

const BreadShare = dynamic(() => import('./BreadShare'), { ssr: false });

export default function (props: { coin: string }) {
  const { showDetailIndexBreadcrumb } = getTenantConfig();
  const siteConfig = getSiteConfig();
  const { isH5 } = usePlatformSize();

  const { coin } = props;
  const { isSm } = useScreen();
  const { t } = useTranslation()
  const router = useRouter();
  const coinDict = useCategoriesStore((state) => state.coinDict);
  const coinObj = coinDict[coin];

  const items = useMemo(() => {
    // 默认跳转来源
    const defaultSource = {
      name: t('qdG1e76kK1fkqrGucRooWG'),
      item: '/price',
    };

    // const coinObj = coinDict[coin];
    // seo需要面包屑的跳转路径是固定的：去掉url中的jumpSource参数；第二级固定跳转/price
    const secondItem = defaultSource;
    const secondPath = concatPath(siteConfig.KUCOIN_HOST || '', secondItem?.item);

    const defaultItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('coin.detail.bread.crumb.home'),
        route: addLangToPath(siteConfig.KUCOIN_HOST),
      },
      {
        '@type': 'ListItem',
        position: 2,
        ...secondItem,
        route: addLangToPath(secondPath),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: coinObj?.currencyName || coin,
      },
    ];
    if (!showDetailIndexBreadcrumb) {
      defaultItems.splice(1, 1);
    }

    return defaultItems;
  }, [coin, coinObj?.currencyName, showDetailIndexBreadcrumb, siteConfig.KUCOIN_HOST, t]);

  return (
    <div className={styles.wrapper} style={{ height: isH5 ? 40 : 20 }}>
      <CustomHead>
        <BreadcrumbLdJson items={items} />
      </CustomHead>
      <Breadcrumb className={styles.breadCrumbStyled}>
        {(items || []).map(({ name, route }, idx) => (
          <Breadcrumb.Item key={idx}>
            {route ? (
              <a href={route} >{name}</a>
            ) : (
              <span data-ssg="price-bread">{name}</span>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      {isSm && <BreadShare symbol={coinObj?.currencyName || coin} />}
    </div>
  );
}