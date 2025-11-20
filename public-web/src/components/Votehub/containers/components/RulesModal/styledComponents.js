/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';

export const ContentWrapper = styled.div`
  padding: 20px 16px 34px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};

  p {
    margin-bottom: 12px;
    &.title {
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
    }
    &::last-of-type {
      margin-bottom: 0;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 0 60px;
    font-size: 16px;
  }
`;
