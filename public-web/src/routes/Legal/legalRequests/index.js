/**
 * Owner: odan.ou@kupotech.com
 */

import styled from '@emotion/styled';
import { Spin } from '@kufox/mui';
import { useResizeObserverBody } from 'hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LegalProgress } from './Components';
import LegalHeader from './LegalHeader';
import StepsIndex from './Steps';
import Submitted from './Submitted';
import { useLegalLogin } from './useFetchConf';
import { eFalseStyle, eScreenStyle, eTheme, eTrueStyle, LegalConf } from './utils';

const LegalContentWrapper = styled.div`
  padding: 0 ${LegalConf.LeftPadding} 48px;
  display: flex;
  background: ${eTheme('backgroundMajor')};
  justify-content: space-between;
  ${eFalseStyle('littleScreen')`
    > div:first-of-type {
      width: 588px;
    }
  `}
  ${eTrueStyle('littleScreen')`
    display: block;
    > div {
      width: 100%;
    }
  `}
  ${eScreenStyle('Max1200')`
    padding-left: 64px;
    padding-right: 64px;
  `}
  ${eScreenStyle('Max768')`
    padding-left: 16px;
    padding-right: 16px;
  `}
`;

const LegalProgressMobilWrap = styled.div``;

const LegalRequests = () => {
  const {
    token,
    userVerifyRes: { data, run },
    run: userRun,
    loading,
  } = useLegalLogin();
  const resizeData = useResizeObserverBody();

  const getCurrentStep = useCallback(
    (data) => {
      if (!token) return 0;
      // 人员信息审核已通过
      if (data?.status === 1) return 2;
      return 1;
    },
    [token],
  );
  const [currentStep, setCurrentStep] = useState(getCurrentStep(data)); // 0-2

  const [hasSubmit, setHasSubmit] = useState(false);

  const onEnd = useCallback(() => {
    setHasSubmit(true);
  }, []);

  const onClose = useCallback(() => {
    setHasSubmit(false);
  }, []);

  useEffect(() => {
    setCurrentStep(getCurrentStep(data));
  }, [data, getCurrentStep]);

  const { width, screen, breakpointsDown } = resizeData;
  if (width === 0) return null;
  const littleScreen = breakpointsDown('Max1200');

  const params = {
    onVerifyRefresh: run,
    token,
    verifyData: data,
    run: userRun,
    loading,
    onEnd,
    resizeData, // resizeData.screen
    screen,
    littleScreen,
  };

  return (
    <div>
      <LegalHeader screen={screen} littleScreen={littleScreen} />
      <LegalContentWrapper littleScreen={littleScreen} screen={screen}>
        {!hasSubmit && littleScreen && (
          <LegalProgressMobilWrap>
            <LegalProgress currentStep={currentStep} direction="horizontal" screen={screen} />
          </LegalProgressMobilWrap>
        )}
        {hasSubmit ? (
          <Submitted onClose={onClose} screen={screen} />
        ) : (
          <React.Fragment>
            <div>
              <StepsIndex {...params} currentStep={currentStep} />
            </div>
            {!littleScreen && <LegalProgress currentStep={currentStep} screen={screen} />}
          </React.Fragment>
        )}
      </LegalContentWrapper>
    </div>
  );
};

const LegalRequestsWrap = (props) => {
  const { token, userVerifyRes, ...others } = useLegalLogin();
  const hasShowSpinRef = useRef(false);

  if (!token || (token && userVerifyRes.data) || hasShowSpinRef.current) {
    return <LegalRequests {...props} {...others} />;
  }
  hasShowSpinRef.current = true;
  return (
    <Spin>
      <div style={{ minHeight: 200 }} />
    </Spin>
  );
};

export default LegalRequestsWrap;
