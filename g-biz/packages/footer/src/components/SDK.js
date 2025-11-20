import { useMemo } from 'react';
import { useTheme, css } from '@kux/mui';
import { kcsensorsManualTrack } from '@utils/sensors';
import map from 'lodash/map';
import { useLang } from '../hookTool';
import { useCommonStyles } from './commonStyles';

const useStyles = ({ theme }) => {
  return {
    newFooterSDK: css({
      bottom: 10,
      listStyle: 'none',
      '[dir="rtl"] &': {
        left: 'unset',
        right: '16px',
        transform: 'translate3d(0, 0, 0)',
      },
      [theme.breakpoints.down('sm')]: {
        left: 120,
        '&:after': {
          left: 20,
          '[dir="rtl"] &': {
            left: 'unset',
            right: 20,
          },
        },
      },
    }),
  };
};

export default function SDK({ categoryKey }) {
  const { t } = useLang();
  const theme = useTheme();
  const commonStyles = useCommonStyles({ theme });
  const styles = useStyles({ theme });

  const FOOTER_LINKS = (t) =>
    useMemo(() => {
      return [
        { title: t('ki1G2oroDz6ApKzLKEhZdU'), path: 'https://github.com/Kucoin/KuCoin-Java-SDK' },
        { title: t('wTSJR7jC6trVUqGSxUv9kJ'), path: 'https://github.com/Kucoin/KuCoin-PHP-SDK' },
        { title: t('dtKht8KhFtg6rS6dVpTq4M'), path: 'https://github.com/Kucoin/KuCoin-Go-SDK' },
        { title: t('9EvjyXs6gBGPqRfB98V5b2'), path: 'https://github.com/Kucoin/kucoin-python-sdk' },
        { title: t('6incfSnGLwkNzs1PrXhmMG'), path: 'https://github.com/Kucoin/kucoin-node-sdk' },
        { title: t('aHPZJRmsRsXU1pnA44i1Ek'), path: 'https://github.com/Kucoin/kucoin-level3-sdk' },
      ];
    }, [t]);

  return (
    <dd
      className="newFooterHover"
      css={commonStyles.newFooterHover}
      data-inspector="inspector_footer_sdk"
    >
      {t('dD19jtYjENiz5oqVd8VYc6')}
      <ul
        className="newFooterHoverMenu newFooterSDK"
        css={[commonStyles.newFooterHoverMenu, styles.newFooterSDK]}
        data-inspector="inspector_footer_sdk_children"
      >
        {map(FOOTER_LINKS(t), (item) => (
          <li key={item.path}>
            <a
              href={item.path}
              target="_blank"
              key={item.path}
              onClick={() =>
                kcsensorsManualTrack(
                  { spm: ['Footer', categoryKey], data: { url: item.path } },
                  'page_click',
                )
              }
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </dd>
  );
}
