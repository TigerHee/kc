/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';
import { Element } from 'react-scroll';

export const Wrapper = styled.div`
  width: 100%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0px 16px;
  }
`;

export const ElementWrapper = styled(Element)`
  &:not(:last-child) {
    margin-bottom: 60px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }
`;

export const Title = styled.h2`
  color: #000d1d;
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  margin: 0px 0px 24px 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 0px 0px 16px 0px;
    font-size: 20px;
  }
`;

const paragraphCSS = `
  color: rgba(29, 29, 29, 0.60);
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  margin-bottom: 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

export const Paragraph = styled.p`
  ${paragraphCSS}
  &:not(:last-child) {
    margin-bottom: 12px;
  }
`;

export const ListWrapper = styled.ul`
  padding: ${(props) => (props.needBottomSpace ? '24px 0px' : '24px 0px 0px 0px')};
  margin: 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: ${(props) => (props.needBottomSpace ? '16px 0px' : '16px 0px 0px 0px')};
  }
`;

export const ParagraphDes = styled.p`
  ${paragraphCSS}
`;

export const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 0px 0px 0px;
`;

export const Image = styled.img`
  width: 400px;
  height: 400px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 300px;
    height: 300px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 200px;
    height: 200px;
  }
`;

export const ReadTitle = styled.h2`
  color: #000d1d;
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  margin: 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
