import { kcsensorsManualTrack } from 'tools/sensors';
import clsx from 'clsx';
import { useTranslation } from 'tools/i18n';
import commonStyles from '../styles.module.scss';
import styles from './styles.module.scss';

export default function SDK({ categoryKey }: { categoryKey: string, key: any }) {
  const { t } = useTranslation('footer');

  const FOOTER_LINKS = [
    { title: t('ki1G2oroDz6ApKzLKEhZdU'), path: 'https://github.com/Kucoin/KuCoin-Java-SDK' },
    { title: t('wTSJR7jC6trVUqGSxUv9kJ'), path: 'https://github.com/Kucoin/KuCoin-PHP-SDK' },
    { title: t('dtKht8KhFtg6rS6dVpTq4M'), path: 'https://github.com/Kucoin/KuCoin-Go-SDK' },
    { title: t('9EvjyXs6gBGPqRfB98V5b2'), path: 'https://github.com/Kucoin/kucoin-python-sdk' },
    { title: t('6incfSnGLwkNzs1PrXhmMG'), path: 'https://github.com/Kucoin/kucoin-node-sdk' },
    { title: t('aHPZJRmsRsXU1pnA44i1Ek'), path: 'https://github.com/Kucoin/kucoin-level3-sdk' },
  ];

  return (
    <dd
      className={clsx(commonStyles.newFooterHover, 'newFooterHover')}
      data-inspector="inspector_footer_sdk"
    >
      {t('dD19jtYjENiz5oqVd8VYc6')}
      <ul
        className={clsx(commonStyles.newFooterHoverMenu, styles.newFooterSDK, 'newFooterHoverMenu', 'newFooterSDK')}
        data-inspector="inspector_footer_sdk_children"
      >
        {FOOTER_LINKS.map((item) => (
          <li key={item.path}>
            <a
              href={item.path}
              target="_blank"
              key={item.path}
              onClick={() => {
                kcsensorsManualTrack(
                  { spm: ['Footer', categoryKey], data: { url: item.path } },
                  'page_click',
                )
              }}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </dd>
  );
}
