/**
 * Owner: tiger@kupotech.com
 */
import { Button, Spin, styled } from '@kux/mui';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLegoAdvanceResult } from 'services/kyc';
import { _t } from 'src/tools/i18n';
import { saTrackForBiz, trackClick } from 'utils/ga';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  width: 100%;
`;
const StyledSpin = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const IframeWrapper = styled.div`
  width: 100%;
  flex: 1;
  margin: 0 auto;
  overflow-y: auto;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;
const StyledIframe = styled.iframe`
  object-fit: cover;
  width: 100%;
  min-height: 890px;
  border: none;
  overflow: hidden;
  ${(props) => props.theme.breakpoints.down('sm')} {
    min-height: 720px;
  }
`;
const BtnWrapper = styled.div`
  flex-shrink: 0;
  padding: 20px 32px 0;
  display: flex;
  justify-content: flex-end;
  margin: 0 -32px;
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 0 -16px;
    padding: 20px 16px 0;
  }
`;
const ExitButton = styled(Button)`
  color: ${(props) => props.theme.colors.primary};
`;

export default ({ advanceUrl, onOk, onSupplierCallback }) => {
  const dispatch = useDispatch();
  const kyc2ChannelInfo = useSelector((state) => state.kyc.kyc2ChannelInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    saTrackForBiz({}, ['FaceScan', '']);

    const handleMsg = async (event) => {
      try {
        const { origin, data } = event;
        if (origin.includes('advance')) {
          const res = JSON.parse(data);
          // ['successNext', 'failedNext']
          if (['successNext'].includes(res?.info)) {
            dispatch({
              type: 'kyc/update',
              payload: { advanceType: 'success' },
            });
            const { data, success } = await getLegoAdvanceResult({
              ekycFlowId: kyc2ChannelInfo?.ekycflowId,
            });
            if (data && success) {
              onSupplierCallback(true);
            } else {
              onSupplierCallback(false);
            }
          }
          if (['failedNext'].includes(res?.info)) {
            dispatch({
              type: 'kyc/update',
              payload: { advanceType: 'fail' },
            });

            onSupplierCallback(false);
          }
        }
      } catch (error) {}
    };
    window.addEventListener('message', handleMsg);

    return () => {
      window.removeEventListener('message', handleMsg);
    };
  }, []);

  return (
    <Wrapper>
      <StyledSpin spinning={loading} size="small" />
      <IframeWrapper>
        {advanceUrl ? (
          <StyledIframe
            onLoad={() => {
              setLoading(false);
            }}
            src={advanceUrl}
            allow="camera;fullscreen;accelerometer;gyroscope;magnetometer"
            allowFullScreen
            id="advanceIframe"
            scrolling="no"
            seamless
          />
        ) : null}
      </IframeWrapper>
      <BtnWrapper>
        <ExitButton
          onClick={() => {
            onOk('facial');
            trackClick(['FaceScanProblem', '1']);
          }}
          type="default"
          variant="text"
        >
          {_t('iRf27YhRxDQP4QpC1QDrGB')}
        </ExitButton>
      </BtnWrapper>
    </Wrapper>
  );
};
