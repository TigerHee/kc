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

  ol {
    display: block;
    list-style-type: decimal;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }

  ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 0 60px;
    font-size: 16px;
  }
`;
