/**
 * Owner: will.wang@kupotech.com
 */
import { styled, Button } from '@kux/mui';

export const StorySectionContainer = styled.div`
  width: 100%;
`;

export const StoryContent = styled.div`
  width: 1160px;
  margin: 80px auto 133px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow: hidden;
  
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
    padding: 0 32px;
    margin: 32px auto 120px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    margin: 27px auto 40px;
    padding: 0 16px;
  }
`;

export const Storytitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  line-height: 130%;
  margin: 0;
 

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

export const StoryParagraphOne = styled.p`
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  line-height: 160%;
  margin: 32px 0 0;
  
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 16px 0 0;
    font-size: 15px;
  }
`;

export const StoryParagraphTwo = styled.p`
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 160%;
  margin: 12px 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin: 8px 0;
  }
`;

export const StoryParagraphThree = styled.p`
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 160%;
  margin: 0 0 40px;
  
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin: 0 0 24px;
  }
`;

export const StorySlideNextButton = styled(Button)`
  height: 28px;
`;
