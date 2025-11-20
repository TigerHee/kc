/**
 * Owner: pike@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { Breadcrumb } from '@kux/mui';
import { Link } from 'components/Router';
import { styled } from '@kux/mui/emotion';
// import styles from './style.less';

const BreadWrapper = styled.div`
  .custom-link {
    color: ${(props) => props.theme.colors.text60};
    font-weight: 500;
  }
  .custom-unlink {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
  }
`;
const { Item } = Breadcrumb;

const KcBreadCrumbs = ({ breadCrumbs }) => {
  if (!breadCrumbs.length) return null;
  return (
    <BreadWrapper>
      <Breadcrumb>
        {map(breadCrumbs, ({ label, url }, index) => {
          if (url) {
            return (
              <Item key={index}>
                <Link to={url} className="custom-link">
                  {label}
                </Link>
              </Item>
            );
          }
          return (
            <Item key={index}>
              <span className="custom-unlink">{label}</span>
            </Item>
          );
        })}
      </Breadcrumb>
    </BreadWrapper>
  );
};

KcBreadCrumbs.propTypes = {
  breadCrumbs: PropTypes.array,
};

KcBreadCrumbs.defaultProps = {
  breadCrumbs: [],
};

export default KcBreadCrumbs;
