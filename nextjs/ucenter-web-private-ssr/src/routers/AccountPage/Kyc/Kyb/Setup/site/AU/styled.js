import { styled } from '@kux/mui';

export const ChooseContainer = styled.div`
  margin: 0 auto;
  max-width: 580px;
  width: 100%;
  padding: 0 32px;
  .pageTitle {
    margin-top: 64px;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    font-size: 24px;
    font-style: normal;
    line-height: 140%;
  }
  .formItemDesc {
    margin-bottom: 32px;
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 140%;
  }
  .KuxForm-itemHelp {
    min-height: 40px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;
