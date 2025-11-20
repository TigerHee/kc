/*
 * @Owner: Clyne@kupotech.com
 */
import { styled } from '@/style/emotion';

export const SearchWrapper = styled.div`
  position: relative;
  .KuxInput-sizeSmall {
    background: none;
  }
  .KuxInput-typeText fieldset {
    border-radius: 80px;
    background: ${(props) => props.theme.colors.cover4};
  }
  .KuxInput-input {
    height: 30px;
    font-weight: 400;
  }

  .KuxForm-itemHelp {
    display: none;
  }
`;
