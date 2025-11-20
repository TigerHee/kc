/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import line from 'static/spotlight6/line.png';

const TitleWrapper = styled.h1`
  margin-bottom: 30px;
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 4px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
    padding-bottom: 3px;
  }
`;

const TitleIcon = styled.img`
  width: 40px;
  height: 40px;
  margin: 0 8px 0 10px;
  position: relative;
  z-index: 1;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 30px;
    height: 30px;
    margin: 0 4px 0 8px;
  }
`;

const TitleText = styled.span`
  font-weight: 600;
  font-size: 36px;
  line-height: 47px;
  color: #e1e8f5;
  position: relative;
  z-index: 1;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
    line-height: 31px;
  }
`;

const TitleLine = styled.img`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 20px;

  [dir='rtl'] & {
    transform: rotateY(180deg);
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    height: 12px;
  }
`;

const Title = ({ icon, title }) => {
  return (
    <TitleWrapper>
      <TitleLine src={line} alt="line" />
      <TitleIcon src={icon} alt="icon" />
      <TitleText>{title}</TitleText>
    </TitleWrapper>
  );
};

export default Title;
