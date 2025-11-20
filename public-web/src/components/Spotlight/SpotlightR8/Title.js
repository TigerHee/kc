/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import { ReactComponent as TitleLeftBg } from 'static/spotlight8/titleLeft.svg';

const TitleWrapper = styled.h2`
  margin-top: 100px;
  margin-bottom: 40px;
  position: relative;
  display: flex;
  align-items: center;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 80px;
    margin-bottom: 32px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 48px;
    margin-bottom: 16px;
  }
`;

const TitleText = styled.div`
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 100%;
  height: 100%;
  color: ${(props) => props.theme.colors.text};
  position: relative;
  z-index: 1;
  padding-left: 16px;
  display: inline-flex;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.primary8};

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;

const TitleLeft = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 48px;
    height: 48px;
  }
`;
const TitleLeftBgWrapper = styled(TitleLeftBg)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;

const TitleIcon = styled.img`
  width: 32px;
  height: 32px;
  position: relative;
  z-index: 1;

  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;

const TitleRight = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: 1;
  height: 56px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 48px;
  }
`;

const Title = ({ icon, title }) => {
  return (
    <TitleWrapper>
      <TitleLeft>
        <TitleLeftBgWrapper alt="line" />
        <TitleIcon src={icon} alt="icon" />
      </TitleLeft>
      <TitleRight>
        <TitleText>{title}</TitleText>
      </TitleRight>
    </TitleWrapper>
  );
};

export default Title;
