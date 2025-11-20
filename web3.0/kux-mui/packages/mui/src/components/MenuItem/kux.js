/**
 * Owner: victor.ren@kupotech.com
 */
import { variant } from 'styled-system';
import styled from 'emotion/index';

export const MenuItemRoot = styled.li`
  display: flex;
  flex-direction: ${(props) => (props.size === 'mini' ? 'column' : 'row')};
  align-items: center;
  border-radius: 56px;
  margin-bottom: 8px;
  height: 48px;
  font-size: 16px;
  line-height: 130%;
  padding-left: ${(props) => (props.showIcon ? '16px' : '20px')};
  font-weight: ${(props) => {
    return props.isSelected ? 700 : 500;
  }};
  color: ${(props) => props.theme.colors[props.isSelected ? 'textPrimary' : 'text']};
  cursor: pointer;
  &:last-of-type {
    margin-bottom: 0px;
  }
  background: ${(props) => (props.isSelected ? props.theme.colors.primary8 : 'transparent')};
  &:hover {
    background: ${(props) =>
      props.isSelected ? props.theme.colors.primary8 : props.theme.colors.cover2};
  }
  transition: all 0.3s ease;
  ${(props) => props.theme.breakpoints.down('xl')} {
    font-size: 14px;
  }
  ${(props) =>
    variant({
      prop: 'size',
      variants: {
        mini: {
          marginBottom: 22,
          height: 'auto',
          fontSize: 10,
          borderRadius: 'unset',
          paddingLeft: 0,
          justifyContent: 'center',
          color: props.isSelected ? props.theme.colors.primary : props.theme.colors.text40,
          background: 'transparent',
          span: {
            display: 'block',
            maxWidth: 64,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          },
          [props.theme.breakpoints.down('xl')]: {
            fontSize: 10,
          },
          '&:hover': {
            background: 'transparent',
            color: props.isSelected ? props.theme.colors.primary : props.theme.colors.text60,
          },
        },
      },
    })}
  ${(props) =>
    props.isSub && {
      height: 'auto',
      padding: '11px 20px',
      fontSize: '14px',
      fontWeight: 400,
      color: props.isSelected ? props.theme.colors.text : props.theme.colors.text60,
      background: 'none',
      '.KuxMenuItem-text': {
        overflow: 'hidden',
        display: '-webkit-box',
        textOverflow: 'ellipsis',
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical',
        '&:-webkit-scrollbar': {
          display: 'none',
        },
      },
      '&:hover': {
        background: 'none',
        color: props.theme.colors.primary,
      },
    }}
`;

export const IconBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  ${variant({
    prop: 'size',
    variants: {
      mini: {
        marginRight: 0,
        marginBottom: '4px',
      },
    },
  })}
`;
