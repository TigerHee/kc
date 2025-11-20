/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import useTheme from 'hooks/useTheme';
import { LeftOutlined, RightOutlined } from '@kux/icons';

const PaginationItemRoot = styled.button`
  min-width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: ${(props) => props.theme.radius.basic};
  cursor: pointer;
  text-decoration: none;
  color: ${(props) => (props.selected ? props.theme.colors.text : props.theme.colors.text40)};
  background-color: ${(props) => props.theme.colors.overlay};
  outline: none;
  border: 1px solid
    ${(props) => (props.selected ? props.theme.colors.text : props.theme.colors.divider8)};
  &:hover {
    border-color: ${(props) => props.theme.colors.cover20};
    color: ${props => props.theme.colors.text};
  }
  &:active {
    text-decoration: none;
    color: ${(props) => (props.selected ? props.theme.colors.text : props.theme.colors.text40)};
  }
`;

const PaginationItemEllipsis = styled.div`
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text40};
`;

const PaginationItemIcon = styled.button`
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  border-radius: ${(props) => props.theme.radius.basic};
  cursor: pointer;
  text-decoration: none;
  outline: none;
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  background: none;
  border: 1px solid ${(props) => props.theme.colors.divider8};
  &:hover {
    border-color: ${(props) => props.theme.colors.cover20};
    color: ${props => props.theme.colors.text};
    svg {
      fill: ${props => props.theme.colors.text};
    }
  }
  [dir='rtl'] & {
    svg {
      transform: rotate(180deg);
    }
  }
`;

const PaginationItem = React.forwardRef((props, ref) => {
  const { type, page, selected, disabled, component = 'button', ...others } = props;
  const theme = useTheme();
  if (type === 'start-ellipsis' || type === 'end-ellipsis') {
    return <PaginationItemEllipsis theme={theme}>···</PaginationItemEllipsis>;
  }
  const hrefProp = {};
  if (others?.getHref) {
    hrefProp.href = others.getHref(page);
  }
  if (type === 'previous' || type === 'next') {
    return (
      <PaginationItemIcon
        {...others}
        theme={theme}
        disabled={disabled}
        as={component}
        {...hrefProp}
      >
        {type === 'previous' ? <LeftOutlined size={16} color={theme.colors.icon} /> : <RightOutlined size={16} color={theme.colors.icon} />}
      </PaginationItemIcon>
    );
  }
  return (
    <PaginationItemRoot
      {...others}
      selected={selected}
      theme={theme}
      data-current={page}
      ref={ref}
      as={component}
      {...hrefProp}
    >
      {page}
    </PaginationItemRoot>
  );
});

export default PaginationItem;
