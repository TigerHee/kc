/**
 * Owner: tom@kupotech.com
 */
import { Breadcrumb } from '@kufox/mui';
import { styled } from '@kufox/mui';

export const Wrapper = styled.div`
  background-color: #fff;
  padding: 0 24px;
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0 16px;
  }
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const BreadcrumbStyle = styled(Breadcrumb)`
  margin-top: 27px;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 17px;
    font-size: 12px;
  }
`;

export const StepTitle = styled.div`
  font-weight: 500;
  font-size: 36px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 24px;
  }
`;
