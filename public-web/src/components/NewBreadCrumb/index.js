/**
 * Owner: willen@kupotech.com
 */
import { Breadcrumb } from '@kufox/mui';
import { Link } from 'components/Router';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import styles from './style.less';

const KcBreadCrumbs = ({ breadCrumbs }) => {
  if (!breadCrumbs.length) return null;
  return (
    <Breadcrumb>
      {map(breadCrumbs, ({ label, url }, index) => {
        if (url) {
          return (
            <Breadcrumb.Item key={index}>
              <Link to={url} className={styles.link}>
                {label}
              </Link>
            </Breadcrumb.Item>
          );
        }
        return <Breadcrumb.Item key={index}>{label}</Breadcrumb.Item>;
      })}
    </Breadcrumb>
  );
};

KcBreadCrumbs.propTypes = {
  breadCrumbs: PropTypes.array,
};

KcBreadCrumbs.defaultProps = {
  breadCrumbs: [],
};

export default KcBreadCrumbs;
