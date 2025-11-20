/**
 * Owner: roger@kupotech.com
 */
import { styled } from '@kux/mui';

const Wrapper = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 24px;
  text-decoration: none;
  :hover {
    background: ${(props) => props.theme.colors.cover2};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;

  .symbol-name {
    font-size: 14px;
  }
  .symbol-tag {
    margin-left: 6px;
  }
`;

export { Wrapper, ContentWrapper };
