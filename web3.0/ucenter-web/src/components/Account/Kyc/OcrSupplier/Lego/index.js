/**
 * Owner: Lena@kupotech.com
 */
import { styled, useResponsive } from '@kux/mui';
import { useEffect } from 'react';
import { _t } from 'src/tools/i18n';
import AllowImg from 'static/account/kyc/lego/allow.svg';
import AllowSmImg from 'static/account/kyc/lego/allow_sm.svg';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import Btn from './Button';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const TopWrapper = styled.div`
  flex: 1;
`;
const Title = styled.h2`
  font-weight: 700;
  font-size: 24px;
  line-height: 130%;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
const Img = styled.img`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;
const Desc = styled.h3`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const Lego = ({ onOk, onCancel }) => {
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const handleClick = () => {
    try {
      trackClick(['IDPhotoTeachStarTakePhoto', '1']);
    } catch (error) {
      console.log('err', error);
    }
    onOk('legoCamera');
  };

  useEffect(() => {
    try {
      kcsensorsManualExpose(['IDPhotoTeach', '1'], {});
    } catch (error) {
      console.log('err', error);
    }
  }, []);

  return (
    <Wrapper>
      <TopWrapper>
        <Title>{_t('kyc_step2_camera')}</Title>
        <Img src={isH5 ? AllowSmImg : AllowImg} />
        <Desc>{_t('d6RR7tF5cNhJHwMFESnXgE')}</Desc>
      </TopWrapper>
      <Btn
        onCancel={onCancel}
        onOk={onOk}
        btnText={_t('1uQj2nEFstsPBLTJqNQRV9')}
        onClick={handleClick}
      />
    </Wrapper>
  );
};
export default Lego;
