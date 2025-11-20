/**
 * Owner: willen@kupotech.com
 */
import { Breadcrumb, styled } from '@kux/mui';
import { Link } from 'components/Router';
import { map } from 'lodash-es';
import PropTypes from 'prop-types';

const { Item } = Breadcrumb;

const BreadcrumbItem = styled(Item)`
  a {
    color: ${({ theme, isLast }) => (isLast ? theme.colors.text : theme.colors.text60)};
  }
`;

const KcBreadCrumbs = ({ breadCrumbs }) => {
  if (!breadCrumbs.length) return null;
  return (
    <Breadcrumb>
      {map(breadCrumbs, ({ label, url }, index) => {
        if (url) {
          return (
            <BreadcrumbItem key={index} isLast={index === breadCrumbs?.length - 1}>
              <Link to={url}>{label}</Link>
            </BreadcrumbItem>
          );
        }
        return (
          <BreadcrumbItem key={index} isLast={index === breadCrumbs?.length - 1}>
            <span>{label}</span>
          </BreadcrumbItem>
        );
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
