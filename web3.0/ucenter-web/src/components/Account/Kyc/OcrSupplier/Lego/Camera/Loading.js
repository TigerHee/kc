/**
 * Owner: Lena@kupotech.com
 */
import { styled } from '@kux/mui';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { _t } from 'src/tools/i18n';
import TimeoutIcon from 'static/account/kyc/result/timeout.svg';
import { kcsensorsManualExpose } from 'utils/ga';
import Btn from '../Button';

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 56px;
  z-index: 5;
  position: relative;
`;
const LoadingIcon = styled.img`
  width: 148px;
  height: 148px;
  margin-bottom: 24px;
`;
const Title = styled.h3`
  font-weight: 600;
  font-size: 18px;
  line-height: 130%;
  margin-bottom: 8px;
  text-align: center;
  color: ${(props) => props.theme.colors.text};
`;
const StyledButton = styled(Btn)`
  border-top: 0;
`;

const Loading = ({ type = 'success', retry, photoType }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      kcsensorsManualExpose(
        [type === 'success' ? 'B1KYCCameraLoading' : 'B1KYCCameraFailed', '1'],
        {},
      );
    } catch (error) {
      console.log('err', error);
    }
    dispatch({
      type: 'kyc/update',
      payload: {
        legoCameraStep: type === 'success' ? 'cameraLoading' : 'cameraFailed',
      },
    });
  }, [type]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'kyc/update',
        payload: {
          legoCameraStep: photoType === 'front' ? 'frontCamera' : 'backCamera',
        },
      });
    };
  }, [photoType]);

  return (
    <LoadingWrapper type={type}>
      <LoadingIcon src={type === 'success' ? TimeoutIcon : TimeoutIcon} />
      <Title>
        {type === 'success' ? _t('ts6Di9nQRBBy8z2rXn3iRc') : _t('3Lj1wFccpX3opWQ3qDbHgZ')}
      </Title>
      {type === 'fail' && <StyledButton btnText={_t('qrnvBWNg6XyWgLmS8a5Dy2')} onClick={retry} />}
    </LoadingWrapper>
  );
};
export default Loading;
