/**
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { Breadcrumb, Steps, Spin } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { useResponsive } from '@kufox/mui';
import { replace } from 'utils/router';
import { _t } from 'tools/i18n';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import ApplyResult from './ApplyResult';
import { Wrapper, Inner, BreadcrumbStyle } from '../common/StyledComps';
import completeImg from 'static/listing/complete.svg';

const { Step } = Steps;

const Content = styled.div`
  display: flex;
  margin-top: 40px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column-reverse;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 25px;
  }
`;

const FormWrap = styled.div`
  width: 68%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    margin-top: 40px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 25px;
  }
`;

const StepWrap = styled.div`
  flex: 1;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    .KuxStep-title {
      height: 24px;
    }
  }
`;

const LoadingWrap = styled.div`
  width: 100%;
  height: 50vh;
`;

function StepForm() {
  const { applyCurrentStep } = useSelector((state) => state.listing);
  const loading = useSelector((state) => state.loading.effects['listing/getSummary']);

  const { sm, md, lg } = useResponsive();
  const isPc = sm && md && lg;
  const isMobile = sm && !md && !lg;

  const renderStep = () => {
    if (applyCurrentStep === 0) {
      return <StepOne />;
    }
    if (applyCurrentStep === 1) {
      return <StepTwo />;
    }
    if (applyCurrentStep === 2) {
      return <StepThree />;
    }
    return null;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Spin spinning={true} tip={_t('t9FhkeBMMw81EQzjmrHSas')}>
          <LoadingWrap />
        </Spin>
      );
    }
    if (applyCurrentStep === 3) {
      return <ApplyResult />;
    }

    return (
      <Content>
        <FormWrap>{renderStep()}</FormWrap>
        <StepWrap>
          <Steps
            size="small"
            current={applyCurrentStep}
            direction={isPc ? 'vertical' : 'horizontal'}
          >
            <Step
              icon={applyCurrentStep !== 0 ? <img src={completeImg} alt="" /> : null}
              title={isMobile ? '' : _t('4kVLxDS9jFDAsLPbMqBMC9')}
            />
            <Step
              icon={applyCurrentStep === 2 ? <img src={completeImg} alt="" /> : null}
              title={isMobile ? '' : _t('3bk3TbhWRhkdZvXj4GztLY')}
            />
            <Step title={isMobile ? '' : _t('oC2zppBKimuGB5NRJjAoJu')} />
          </Steps>
        </StepWrap>
      </Content>
    );
  };

  return (
    <Wrapper data-inspector="ListingApplyPage">
      <Inner>
        <BreadcrumbStyle>
          <Breadcrumb.Item onClick={() => replace('/listing')}>
            {_t('iKoK5kGnuiFPuniA2ELqAT')}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{_t('9V4Vk7sm8zxLaB96upZCAP')}</Breadcrumb.Item>
        </BreadcrumbStyle>
        {renderContent()}
      </Inner>
    </Wrapper>
  );
}

export default StepForm;
