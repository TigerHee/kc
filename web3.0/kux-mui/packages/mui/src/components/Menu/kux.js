/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import toArray from 'utils/toArray';
import { variant } from 'styled-system';
import styled from 'emotion/index';

export function parseChildren(children, others) {
  const childList = [];
  const childKeys = [];
  toArray(children).forEach((child, index) => {
    if (React.isValidElement(child)) {
      const { key, props } = child;
      const eventKey = props.value || key || `kux-menu-${index}`;
      const cloneProps = {
        key: eventKey,
        eventKey,
        ...others,
      };
      const _child = React.cloneElement(child, cloneProps);
      childList.push(_child);
      childKeys.push(eventKey);
    }
  });
  return {
    childList,
    childKeys,
  };
}

export const MenuContent = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 264px;
  height: 100%;
  max-height: 100vh;
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  padding: 20px 16px 0;
  border-right: 1px solid ${(props) => props.theme.colors.cover8};
  background: ${(props) => props.theme.colors.background};
  transition: all 0.3s ease;

  ${(props) => props.theme.breakpoints.down('xl')} {
    width: 240px;
    padding: 20px 12px 0;
  }
  ${(props) =>
    variant({
      prop: 'size',
      variants: {
        mini: {
          width: 72,
          padding: '18px 4px 0 4px',
          [props.theme.breakpoints.down('xl')]: {
            width: 72,
            padding: '18px 4px 0 4px',
          },
        },
      },
    })}
`;

export const SubMenuWrapper = styled.li`
  width: 100%;
  display: flex;
  flex-direction: column;
  .KuxMenuItem-root {
    margin-bottom: 4px;
    .KuxMenuItem-text {
      color: ${(props) => props.theme.colors.text};
    }
    &:not(.KuxMenuItem-root-sub):hover {
      background: ${(props) => props.theme.colors.cover2};
    }
    &.KuxMenuItem-selected:not(.KuxMenuItem-root-sub) {
      .KuxMenuItem-text {
        color: ${(props) => props.theme.colors.primary};
        font-weight: 500;
      }
      background: ${(props) => props.theme.colors.primary8};
    }
  }
  .KuxMenuItem-root-sub {
    margin-top: -4px;
    .KuxMenuItem-title {
      height: 40px;
      &:hover {
        background: ${(props) => props.theme.colors.cover2};
      }
    }
  }
  &.KuxMenuItem-root-sub-hasIcon {
    .KuxMenuItem-title {
      padding: 14px 16px;
    }
    .KuxMenuItem-root {
      .KuxMenuItem-title {
        padding-left: ${(props) => (props.showIcon ? 48 : 16)}px;
      }
    }
    .KuxMenuItem-root:not(.KuxMenuItem-root-sub) {
      padding-left: ${(props) => (props.showIcon ? 48 : 16)}px;
    }
  }
`;

export const SubMenuTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 56px;
  margin-bottom: 8px;
  height: 48px;
  font-size: 16px;
  line-height: 130%;
  padding: 14px 20px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  &:last-of-type {
    margin-bottom: 0px;
  }
  background: transparent;
  &:hover {
    background: ${(props) => props.theme.colors.cover2};
  }
  transition: all 0.3s ease;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
  ${(props) =>
    props.layer > 1 && {
      marginBottom: '0',
      fontSize: '14px',
      fontWeight: 400,
      padding: props.icon ? '11px 20px 11px 48px' : '11px 20px 11px 20px',
      background: 'none',
      '&:hover': {
        background: 'none',
        color: props.theme.colors.primary,
      },
    }}
  svg.KuxMenuItem-arrow {
    transition: all 0.3s ease;
    transform: ${(props) => (props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 20px;
    height: 20px;
    margin-right: 12px;
    color: ${(props) => props.theme.colors.icon60};
  }
`;

export const SubMenuItems = styled.ul`
  padding: 0;
  display: flex;
  flex-direction: column;
  list-style: none;
  &.KuxSubMenu-layer1 {
    margin-bottom: 8px;
    .KuxMenuItem-icon {
      display: none;
    }
  }
  &.KuxSubMenu-layer2 {
    margin-top: 4px;
    .KuxMenuItem-root {
      .KuxMenuItem-text {
        color: ${(props) => props.theme.colors.text60};
      }
    }
  }
`;
