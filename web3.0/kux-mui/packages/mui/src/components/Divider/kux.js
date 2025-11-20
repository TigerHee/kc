
import styled from 'emotion/index';
import { variant, space, layout } from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop'

export const DividerRoot = styled('div', {
  shouldForwardProp,
})((props) => ({
  border: 'none',
  flexShrink: 0,
  background: props.theme.colors.divider8,
  ...variant({
    prop: 'type',
    variants: {
      horizontal: {
        display: 'block',
        width: '100%',
        height: '1px',
        margin: '8px 0',
      },
      vertical: {
        width: '1px',
        height: '1em',
        margin: '0 12px',
        display: 'inline-block',
        verticalAlign: 'middle',
      },
    },
  })(props)
}), space, layout);

export const DividerRootWithChildren = styled('div', {
  shouldForwardProp
})(props => ({
  display: 'flex',
  whiteSpace: 'nowrap',
  margin: '8px 0',
  textAlign: 'center',
  '&:before': {
    position: 'relative',
    ...variant({
      prop: 'orientation',
      variants: {
        left: {
          width: '10%',
        },
        center: {
          width: '50%',
        },
        right: {
          width: '90%',
        },
      },
    })(props),
    top: '50%',
    content: '" "',
    transform: 'translateY(50%)',
    borderTop: `1px solid ${props.theme.colors.divider8}`,
  },
  '&:after': {
    position: 'relative',
    ...variant({
      prop: 'orientation',
      variants: {
        left: {
          width: '90%',
        },
        center: {
          width: '50%',
        },
        right: {
          width: '10%',
        },
      },
    })(props),
    top: '50%',
    content: '" "',
    transform: 'translateY(50%)',
    borderTop: `1px solid ${props.theme.colors.divider8}`,
  }
}), space, layout);

export const ChildrenWrapper = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.colors.text40};
  padding: 0 8px;
`;