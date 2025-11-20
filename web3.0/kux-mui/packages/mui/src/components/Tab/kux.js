import styled from 'emotion/index';
import { variant } from 'styled-system';

const TabRoot = styled.button`
  overflow: hidden;
  flex-shrink: 0;
  text-align: center;
  white-space: normal;
  padding: 0 20px;
  cursor: pointer;
  font-family: ${(props) => props.theme.fonts.family};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: 0;
  box-sizing: border-box;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  padding-block: 0px;
  padding-inline: 0px;
  border: none;
  border-style: none;
  background-color: transparent;
`;

export const LineTab = styled(TabRoot)`
  padding: 0;
  font-weight: 500;
  -webkit-text-stroke: ${(props) =>
    props.selected ? `0.4px ${props.theme.colors.text}` : 'unset'};
  line-height: 130%;
  color: ${(props) => (props.selected ? props.theme.colors.text : props.theme.colors.text40)};
  transition: ${(props) => props.theme.transitions.create()};
  ${variant({
    prop: 'size',
    variants: {
      xsmall: {
        fontSize: 14,
        marginLeft: 20,
      },
      small: {
        fontSize: 15,
        marginLeft: 20,
      },
      medium: {
        fontSize: 16,
        marginLeft: 24,
      },
      large: {
        fontSize: 20,
        marginLeft: 28,
      },
      xlarge: {
        fontSize: 24,
        marginLeft: 28,
      },
    },
  })}
  &:first-of-type {
    margin-left: 0;
  }
  &:hover {
    color: ${(props) => (props.selected ? props.theme.colors.text : props.theme.colors.text60)};
  }
`;

export const BorderedTab = styled(TabRoot)(({ theme, selected, activeType, type }) => ({
  height: 34,
  padding: '0 16px',
  marginLeft: '12px',
  fontSize: 14,
  lineHeight: '130%',
  fontWeight: selected ? 700 : 500,
  borderRadius: 100,
  color: theme.colors[selected ? 'textEmphasis' : 'text40'],
  background: theme.colors[selected ? 'text' : 'cover2'],
  border: `1px solid ${selected ? 'transparent' : theme.colors.cover4}`,
  transition: theme.transitions.create(),
  '&:hover': {
    color: selected ? theme.colors.textEmphasis : theme.colors.text60,
  },
  ...variant({
    prop: 'type',
    variants: {
      text: {
        height: '24px',
        fontSize: '12px',
        marginLeft: '4px',
        padding: '0 10px',
        background: 'transparent',
        borderColor: 'transparent',
        fontWeight: 500,
      },
      normal: {
        height: '24px',
        fontSize: '12px',
        fontWeight: 500,
        borderRadius: '4px',
        background: 'none',
        color: theme.colors.text40,
        border: 'none',
        transition: 'unset',
        marginLeft: '4px',
        padding: '4px 10px',
      },
    },
  })({ type }),
  ...(selected &&
    variant({
      prop: 'activeType',
      variants: {
        primary: {
          background: theme.colors.primary12,
          color: theme.colors.primary,
          border: `1px solid ${theme.colors.primary12}`,
          '&:hover': {
            color: selected ? theme.colors.primary : theme.colors.text60,
          },
        },
      },
    })({ activeType })),
  ...(selected &&
    type === 'normal' && {
      background: theme.colors.cover4,
      color: theme.colors.text,
      '&:hover': {
        color: theme.colors.text,
      },
    }),
  '&:first-of-type': {
    marginLeft: 0,
  },
}));

export const SliderTab = styled('div')(({ selected, theme, size: tabSize }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  fontWeight: selected ? 600 : 500,
  color: selected ? theme.colors.text : theme.colors.text60,
  lineHeight: '130%',
  padding: '6px 12px',
  fontSize: '14px',
  cursor: 'pointer',
  ...variant({
    prop: 'tabSize',
    variants: {
      medium: {
        padding: '4px 8px',
        fontSize: '12px',
      },
    },
  })({ tabSize }),
}));
