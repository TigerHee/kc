/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import useTheme from 'hooks/useTheme';
import { variant } from 'styled-system';
import PropTypes from 'prop-types';
import Divider from '../Divider';

const OUT_LENGTH = 5; // 超出5个出现省略号

const BreadWrapper = styled.ol`
  display: flex;
  font-size: 14px;
  line-height: 18px;
  list-style-type: none;
  margin-block-start: 0px;
  margin-block-end: 0px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
  ${variant({
    prop: 'size',
    variants: {
      small: {
        fontSize: 12,
        lineHeight: '16px',
      },
    },
  })}
`;

const ItemWrapper = styled.li`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text60};
  .rightArrow {
    margin: 0 2px;
    margin-bottom: -2px;
  }
  &:not(:last-of-type) {
    &:hover {
      cursor: pointer;
    }
  }
  &:last-of-type {
    color: ${(props) => props.theme.colors.text};
    .Item-Child {
      border-bottom: none;
    }
    .KuxDivider-root {
      display: none;
    }
  }
`;

const MoreDot = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text60};
  .dots {
    display: flex;
    align-items: center;
    margin-bottom: -2px;
    font-size: 18px;
  }
  .rightArrow {
    margin: 0 4px 0 2px;
    margin-bottom: -2px;
  }
`;

const CusDivider = styled(Divider)`
  margin: 0 8px;
  background: ${(props) => props.theme.colors.text60};
  transform-origin: center;
  transform: rotate(16deg) scale(0.8);
`;

const BorderedChild = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom-color: ${(props) => props.theme.colors.text40};
  }
`;

function Item({ children, ...props }) {
  const theme = useTheme();

  return (
    <ItemWrapper theme={theme} {...props}>
      <BorderedChild theme={theme} className="Item-Child">
        {children}
      </BorderedChild>
      <CusDivider type="vertical" theme={theme} />
    </ItemWrapper>
  );
}

function Breadcrumb({ children, ...props }) {
  const theme = useTheme();

  return (
    <nav aria-label="Breadcrumb">
      <BreadWrapper {...props}>
        {children.length >= OUT_LENGTH
          ? children
              .slice(0, 1)
              .concat([
                <MoreDot theme={theme} key="__more_dot__">
                  <div className="dots">···</div>
                  <CusDivider type="vertical" theme={theme} />
                </MoreDot>,
              ])
              .concat(children.slice(-2))
          : children}
      </BreadWrapper>
    </nav>
  );
}

Breadcrumb.Item = Item;

Breadcrumb.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['basic', 'small']),
};

Breadcrumb.defaultProps = {
  size: 'basic',
};

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
