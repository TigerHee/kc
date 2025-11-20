/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Breadcrumb, css, useTheme } from '@kux/mui';
import { Link } from 'components/Router';
import { _t } from 'tools/i18n';

const useStyle = ({ color }) => {
  return {
    link: css`
      color: ${color.text60};
    `,
  };
};

const CustomBreadCrumbs = ({ routerName }) => {
  const theme = useTheme();
  const classes = useStyle({ color: theme.colors });
  useLocale();
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to={'/account/kyc'} css={classes.link}>
          {_t('kyc.verified')}
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{routerName}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default CustomBreadCrumbs;
