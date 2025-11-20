import styled from 'emotion/index';
import Drawer from '../Drawer';
import { space, border, layout, variant } from 'styled-system';

export const MDrawerRoot = styled(Drawer)`
  display: flex;
  flex-direction: column;
  min-width: 375px;
  ${variant({
  prop: 'anchor',
  variants: {
    right: {
      borderRadius: 'none',
    },
    left: {
      borderRadius: 'none',
    },
    top: {
      borderRadius: '0 0 24px 24px'
    },
    bottom: {
      borderRadius: '24px 24px 0 0'
    }
  }
})}
${space}
${border}
${layout}
`;
