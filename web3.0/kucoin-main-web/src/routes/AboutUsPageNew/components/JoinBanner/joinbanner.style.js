/**
 * Owner: will.wang@kupotech.com
 */

import { Button, styled } from '@kux/mui';

export const JoinbannerWrapper = styled.section`
  width: 100%;
  margin: 0 auto;
  padding: 80px 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;

  background-color: ${props => props.theme.colors.cover2};

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    padding: 80px 32px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 40px 32px;
  }
`;



export const JoinbannerWrapperTitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  margin-bottom: 20px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

export const JoinbannerWrapperParagraph = styled.p`
  color: ${(props) => props.theme.colors.text40};
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.3;
  margin-bottom: 48px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin-bottom: 28px;
  }
`;

export const JoinbannerWrapperButton = styled(Button)`
  min-width: 240px;

  & .KuxButton-endIcon.KuxButton-iconSizeLarge {
    width: 20px;
    height: 20px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} { 
    font-size: 14px;
    height: 40px;

    & .KuxButton-endIcon.KuxButton-iconSizeLarge {
      width: 16px;
      height: 16px;
    }
  }
`;
