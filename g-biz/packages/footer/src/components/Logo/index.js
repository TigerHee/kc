import { useTheme, css } from '@kux/mui';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { changLangToPath } from '../../common/tools';
import { WITHOUT_QUERY_PARAM, LOGO_LINK } from '../../config';
import { tenant } from '../../tenantConfig';

const useStyles = ({ theme }) => {
  return {
    logo: css({
      display: 'block',
      height: 36,
      marginBottom: 56,
      [theme.breakpoints.down('sm')]: {
        marginBottom: 24,
      },
    }),
    img: css({
      width: 121,
      marginRight: 22,
      [theme.breakpoints.down('sm')]: {
        width: 103.71,
      },
      '[dir="rtl"] &': {
        marginRight: 'unset',
        marginLeft: 22,
      },
    }),
  };
};

export default function FooterLogo({ currentLang, KUCOIN_HOST }) {
  const theme = useTheme();
  const styles = useStyles({ theme });
  return (
    <a
      href={changLangToPath(
        currentLang,
        queryPersistence.formatUrlWithStore(KUCOIN_HOST, WITHOUT_QUERY_PARAM),
      )}
      css={styles.logo}
      className="logo"
      aria-label="Kucoin logo (footer)"
    >
      <img src={window?._BRAND_LOGO_ || LOGO_LINK} alt={tenant || 'KuCoin'} css={styles.img} />
    </a>
  );
}
