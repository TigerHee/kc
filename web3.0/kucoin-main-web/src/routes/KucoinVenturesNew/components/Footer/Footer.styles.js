/**
 * Owner: will.wang@kupotech.com
 */
import { Button, styled } from '@kux/mui';

export const FooterSectionContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 80px 240px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 120px 0 40px;

  background: ${(props) => props.theme.colors.cover2};

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 80px 0 40px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 40px 16px;
    margin: 40px 0;

    gap: 12px;
  }
`;

export const Title = styled.h4`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
export const Desc = styled.p`
  color: ${(props) => props.theme.colors.text40};
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
  margin-bottom: 28px;
  
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .hl-text {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: underline;
  }
`;
export const ApplyButton = styled(Button)`
  min-width: 240px;

  &:hover {
    color: ${props => props.theme.currentTheme === 'dark' ? '#000' : '#fff'};
  }
`;
