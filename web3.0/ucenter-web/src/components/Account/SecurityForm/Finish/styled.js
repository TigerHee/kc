/**
 * Owner: lori@kupotech.com
 */
import { styled } from '@kux/mui';

export const FinishWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-bottom: 48px;
  }

  a,
  .link_for_a {
    text-decoration: underline;
  }

  img {
    width: 148px;
    height: 148px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 120px;
      height: 120px;
    }
  }
`;

export const StatusTitle = styled.div`
  padding: 8px 0 4px 0;
  font-weight: 700;
  font-size: 28px;
  line-height: 40px;
  text-align: center;
  color: ${(props) => props.theme.colors.text};

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

export const Warning = styled.div`
  padding: 8px 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export const CenterText = styled.div`
  padding: 8px 0;
  font-size: 16px;
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
  margin-bottom: 12px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
