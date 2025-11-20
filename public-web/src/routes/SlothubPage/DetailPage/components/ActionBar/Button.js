/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-05-30 21:37:49
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 18:16:10
 */
import { keyframes, styled } from '@kux/mui';
import { memo } from 'react';
import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import KuxButton from 'src/routes/SlothubPage/components/mui/Button';
import withAuth from 'src/routes/SlothubPage/hocs/withAuth';
import withKyc from 'src/routes/SlothubPage/hocs/withKyc';
import btnCover from 'static/slothub/detail-action-btn-cover.svg';
import { ActionButtonStyleType } from './constant';

const BtnWrap = styled.div`
  position: relative;
  display: flex;
  border-radius: 24px;
  border: ${({ fullGray }) => !fullGray && `1px solid #000`};
  cursor: pointer;
  background: ${({ fullGray }) => (fullGray ? 'rgba(29, 29, 29, 0.04)' : '#d3f475')};
  box-shadow: ${({ fullGray }) => !fullGray && '0px 4px 0px 0px #000'};
  overflow: hidden;
`;

const move = keyframes`
  0% {
      transform: translateX(-5%);
    }
  50% {
      transform: translateX(97%);
    }
  50.5% {
   visibility: hidden;
  }
  100% {
      visibility: hidden;
    }
`;

const BtnCover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${btnCover});
  background-repeat: no-repeat;
  animation: ${move} 2s cubic-bezier(0.16, 0.2, 0.93, 1.11) 0s infinite;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 40px;
  }
`;

const AuthButton = withAuth((props) => <KuxButton {...props} />);
const KycButton = withKyc((props) => <AuthButton {...props} />);

const StyledButton = styled(KycButton)`
  flex: 1;
  border-radius: 24px;
  background: ${({ fullGray }) => (fullGray ? 'rgba(29, 29, 29, 0.04)' : '#d3f475')};
  color: #151515;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  overflow: hidden;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
  }

  .KuxButton-disabled {
    opacity: 0.4;
  }
`;

const Button = (props) => {
  const { isH5 } = useDeviceHelper();
  const { children, styleType, onClick, onPreClick } = props;
  const fullGrayStyle = ActionButtonStyleType.fullGrayDisabled === styleType;
  const isDisableScene = [
    ActionButtonStyleType.disabled,
    ActionButtonStyleType.fullGrayDisabled,
  ].includes(styleType);

  const customProps = {
    type: 'default',
    size: isH5 ? 'basic' : 'large',
    disabled: isDisableScene,
  };

  return (
    <BtnWrap fullGray={fullGrayStyle}>
      <StyledButton
        onClick={onClick}
        onPreClick={onPreClick}
        fullGray={fullGrayStyle}
        {...customProps}
      >
        {children}
        {!isDisableScene && <BtnCover />}
      </StyledButton>
    </BtnWrap>
  );
};

export default memo(Button);
