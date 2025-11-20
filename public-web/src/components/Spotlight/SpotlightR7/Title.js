/**
 * Owner: jessie@kupotech.com
 */
import { styled, useResponsive } from '@kux/mui';
import titleLeft from 'static/spotlight7/title_left.svg';
import titleLeftMini from 'static/spotlight7/title_left_mini.svg';
import titleRight from 'static/spotlight7/title_right.svg';
import titleRightMini from 'static/spotlight7/title_right_mini.svg';

const TitleWrapper = styled.h2`
  margin-top: 100px;
  margin-bottom: 40px;
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 4px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 80px;
    margin-bottom: 32px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 48px;
    margin-bottom: 16px;
  }
`;

const TitleIcon = styled.img`
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 1;

  [dir='rtl'] & {
    transform: rotateY(180deg);
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 32px;
    height: 32px;
  }
`;

const TitleText = styled.div`
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 100%;
  height: 100%;
  color: ${(props) => props.theme.colors.text};
  border-top: 1px solid ${(props) => props.theme.colors.cover16};
  border-bottom: 1px solid ${(props) => props.theme.colors.cover16};
  position: relative;
  z-index: 1;
  padding: 0 8px 0 32px;
  display: inline-flex;
  align-items: center;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 28px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 6px 0 16px;
    font-size: 18px;
  }
`;

const TitleLeft = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 50px;
    height: 48px;
  }
`;
const TitleLeftBg = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;
const TitleRight = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: 1;
  height: 64px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 48px;
  }
`;
const TitleRightBottom = styled.img`
  position: relative;
  width: 21px;
  height: 100%;

  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;

const Title = ({ icon, title }) => {
  const { sm } = useResponsive();
  return (
    <TitleWrapper>
      <TitleLeft>
        <TitleLeftBg src={!sm ? titleLeftMini : titleLeft} alt="line" />
        <TitleIcon src={icon} alt="icon" />
      </TitleLeft>
      <TitleRight>
        <TitleText>{title}</TitleText>
        <TitleRightBottom src={!sm ? titleRightMini : titleRight} alt="line" />
      </TitleRight>
    </TitleWrapper>
  );
};

export default Title;
