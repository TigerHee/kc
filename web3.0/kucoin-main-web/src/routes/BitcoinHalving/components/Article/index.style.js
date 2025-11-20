/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  padding: 80px 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 60px 0px;
  }
`;

export const Title = styled.h2`
  color: #f3f3f3;
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  line-height: 130%;
  margin-bottom: 0px;
  span {
    color: #01bc8d;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

export const SubTitle = styled.p`
  color: rgba(243, 243, 243, 0.6);
  font-size: 16px;
  line-height: 130%;
  width: 100%;
  text-align: center;
  margin-top: 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 16px;
    font-size: 12px;
  }
`;

export const ModuleTitle = styled.h2`
  display: block;
  color: #f3f3f3;
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  line-height: 130%;
  margin: 40px 0px 24px 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-weight: 600;
    font-size: 16px;
  }
`;

export const VideoWrapper = styled.div`
  margin: 24px 0px 0px 0px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 24px 0px 0px 0px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 16px 0px 0px 0px;
  }
`;

export const Paragraph = styled.p`
  color: rgba(243, 243, 243, 0.6);
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
  &:not(:last-child) {
    margin: 24px 0px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 0px;
    font-size: 12px;
    &:not(:last-child) {
      margin: 16px 0px;
    }
  }
`;

export const Chapter = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0px auto;
`;

export const SpacingChapter = styled(Chapter)`
  margin-top: ${({ mt }) => mt}px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 120px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 40px;
  }
`;

export const Image = styled.img`
  margin: 0px auto;
  display: block;
  width: 100%;
  height: 584px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    height: auto;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    height: auto;
  }
`;

export const FAQwrapper = styled.div`
  margin-top: 24px;
`;
