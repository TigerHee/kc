import styled from 'emotion/index';
import { color, space, border, typography } from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop'

export const TypographyRoot = styled('h1', {
  shouldForwardProp,
})(props => `
  margin: 0;
  font-size: ${props.size ? props.size + 'px' : props.fonts.fontSize};
  line-height: ${props.fonts.lineHeight};
  font-weight: 500;
`,
  color, space, border, typography
);
