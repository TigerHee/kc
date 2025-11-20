/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { Breadcrumb, styled } from '@kux/mui';
import { Link } from 'components/Router';

const { Item } = Breadcrumb;

const BreadWrapper = styled(Breadcrumb)`
  .link {
    font-size: 14px;
    &,
    &:hover,
    &:focus {
      color: ${(props) => props.theme.colors.text60};
      text-decoration: none !important;
    }
  }
  .text {
    font-weight: 500;
  }
`;
const KcBreadCrumbs = ({ breadCrumbs }) => {
  if (!breadCrumbs.length) return null;
  return (
    <BreadWrapper>
      {map(breadCrumbs, ({ label, url }, index) => {
        if (url) {
          return (
            <Item key={index}>
              <Link to={url} className="link">
                {label}
              </Link>
            </Item>
          );
        }
        return (
          <Item key={index}>
            <span className="text">{label}</span>
          </Item>
        );
      })}
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
