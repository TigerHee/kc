/**
 * Owner: victor.ren@kupotech.com
 */
import styled from 'emotion/index';
import { variant } from 'styled-system';

const SnackbarContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  padding: 9px 16px;
  border-radius: 4px;
  color: ${(props) => props.theme.colors.textEmphasis};
  font-family: ${(props) => props.theme.fonts.family};
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  overflow: hidden;
  ${(props) => {
    return variant({
      prop: 'variant',
      variants: {
        success: {
          background: props.theme.colors.cover,
        },
        info: {
          background: props.theme.colors.cover,
        },
        error: {
          background: props.theme.colors.secondary,
        },
        warning: {
          background: props.theme.colors.complementary,
        },
        loading: {
          background: props.theme.colors.cover,
        },
      },
    });
  }}
`;

export default SnackbarContent;
