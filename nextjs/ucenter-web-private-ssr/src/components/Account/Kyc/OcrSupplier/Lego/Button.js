/**
 * Owner: Lena@kupotech.com
 */
import styled from '@emotion/styled';
import { Button } from '@kux/mui';
import { isFunction } from 'lodash-es';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'src/tools/i18n';
import { trackClick } from 'utils/ga';

const Wrapper = styled.div`
  flex-shrink: 0;
  margin: 0 -32px;
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
`;
const BtnWrapper = styled.div`
  padding: 20px 32px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px 32px 0;
  }
  .KuxButton-root {
    &:last-of-type {
      min-width: 160px;
    }
  }
`;
const PreButton = styled(Button)`
  color: ${(props) => props.theme.colors.text60};
  margin-right: 24px;
`;

const StyledBtn = ({
  btnText,
  disabled,
  onClick,
  loading,
  size = 'basic',
  fullWidth = false,
  onOk,
  onCancel,
  cancelText,
  ...otherProps
}) => {
  const dispatch = useDispatch();
  const { legoPhotos, legoCameraStep, currentRoute } = useSelector((state) => state.kyc);

  const hideModal = () => {
    onOk('legoIndex');
  };
  const handleCancel = () => {
    if (isFunction(onCancel)) {
      onCancel();
      return;
    }

    if (currentRoute === 'legoIndex') {
      trackClick(['IDPhotoTeachBack', '1']);
    }

    if (currentRoute === 'legoCamera') {
      if (legoCameraStep === 'backPhoto') {
        dispatch({
          type: 'kyc/update',
          payload: {
            legoCameraStep: 'backCamera',
            showCamera: false,
            legoPhotos: { frontPhoto: legoPhotos?.frontPhoto },
          },
        });
        try {
          trackClick(['B1KYCIDPhotoCheckConfirmBack', '1']);
        } catch (error) {
          console.log('err', error);
        }
        return;
      }
      if (legoCameraStep === 'backCamera') {
        dispatch({
          type: 'kyc/update',
          payload: {
            photoType: 'front',
            legoCameraStep: 'frontPhoto',
            showCamera: true,
          },
        });
        try {
          trackClick(['B1KYCKucouinCameraBack', '1']);
        } catch (error) {
          console.log('err', error);
        }
        return;
      }
      if (legoCameraStep === 'frontPhoto') {
        dispatch({
          type: 'kyc/update',
          payload: {
            legoCameraStep: 'frontCamera',
            showCamera: false,
            legoPhotos: {},
          },
        });
        try {
          trackClick(['B1KYCIDPhotoCheckConfirmBack', '1']);
        } catch (error) {
          console.log('err', error);
        }
        return;
      }
      if (legoCameraStep === 'frontCamera') {
        try {
          trackClick(['B1KYCKucouinCameraBack', '1']);
        } catch (error) {
          console.log('err', error);
        }
        dispatch({
          type: 'kyc/update',
          payload: {
            showCamera: false,
          },
        });
        hideModal();

        return;
      }
      try {
        trackClick([
          legoCameraStep === 'cameraLoading'
            ? 'B1KYCCameraLoadingBack'
            : legoCameraStep === 'cameraFailed'
              ? 'B1KYCCameraFailedBack'
              : 'B1KYCCameraAccessBack',
          '1',
        ]);
      } catch (error) {
        console.log('err', error);
      }
      hideModal();
      return;
    }
    hideModal();
  };

  return (
    <Wrapper {...otherProps}>
      <BtnWrapper>
        {isFunction(onOk) ? (
          <PreButton
            onClick={handleCancel}
            loading={loading}
            type="default"
            variant="text"
            data-testid="preButton"
          >
            <span>{cancelText || _t('jcrNiqR1ykWLB4AZF9igRS')}</span>
          </PreButton>
        ) : null}
        <Button
          size={size}
          fullWidth={fullWidth}
          disabled={disabled}
          onClick={onClick}
          loading={loading}
        >
          <span>{btnText}</span>
        </Button>
      </BtnWrapper>
    </Wrapper>
  );
};
export default StyledBtn;
