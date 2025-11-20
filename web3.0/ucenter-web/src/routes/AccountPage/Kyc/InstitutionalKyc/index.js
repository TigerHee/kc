/**
 * Owner: willen@kupotech.com
 * 填写kyb资料
 */
/** 机构认证 */
import { injectLocale } from '@kucoin-base/i18n';
import { styled, useSnackbar } from '@kux/mui';
import CustomBreadCrumbs from 'components/Account/Kyc/common/components/CustomBreadCrumbs';
import { KYC_TYPE, SOURCE } from 'components/Account/Kyc/common/constants';
import InstitutionalKycDocuments from 'components/Account/Kyc/InstitutionalKyc/InstitutionalKycForm/InstitutionalKycDocuments';
import InstitutionalKycForm from 'components/Account/Kyc/InstitutionalKyc/InstitutionalKycForm/InstitutionalKycForm';
import InstitutionalKycPersonalInfo from 'components/Account/Kyc/InstitutionalKyc/InstitutionalKycForm/InstitutionalKycPersonalInfo';
import Notice from 'components/Account/Kyc/InstitutionalKyc/Notice';
import Step from 'components/Account/Kyc/InstitutionalKyc/Step';
import ModalForbid from 'components/Tips/modalForbid';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { _t } from 'tools/i18n';
import { useBrowserPrompt } from 'utils/hooks';
import { push } from 'utils/router';

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 28px 64px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 28px 16px;
  }
`;
const StyledNotice = styled(Notice)`
  margin-top: 40px;
  margin-bottom: 60px;
`;

const InstitutionalKyc = ({
  currentLang,
  dispatch,
  registrationAttachmentImg,
  incumbencyPhotoImg,
  frontPhotoImg,
  kycCode,
  handleRegistrationAttachmentImg,
  backPhotoImg,
  handlePhotoImg,
  authorizeAttachmentImg,
  performanceAttachmentImg,
  shareholdersAttachmentImg,
  directorAttachmentImg,
  otherAttachmentImg,
  countriesKYB,
  companyDetail,
  failureReason,
  isSub = false,
}) => {
  const { message } = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);

  const resetHandler = () => {
    dispatch({ type: 'kyc/reset' });
  };

  useEffect(() => {
    dispatch({ type: 'kyc/getKybCountries' });
    dispatch({ type: 'kyc/getKycCode' });
    dispatch({ type: 'kyc/KycCompanyDetail' });
    return resetHandler;
  }, []);

  useEffect(() => {
    // 切换步骤滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [activeStep]);

  const onInstitutionalKycPersonalSuccess = async () => {
    // 机构认证公司信息和联系人信息成功后，需要最终提交审核
    const data = await dispatch({
      type: 'kyc/confirmCheck',
      payload: { kycType: KYC_TYPE.INSTITUTIONAL, source: SOURCE },
    });
    if (data.success) {
      message.info(_t('kyc.account.sec.review.passed'));
      setShowPrompt(false);
      setTimeout(() => {
        push('/account/kyc');
      }, 400);
    }
    if (!data.success && data.msg) {
      message.error(data.msg);
    }
  };

  const onError = async (err) => {
    message.error(err);
  };

  const institutionalKycFormProps = {
    dispatch,
    currentLang,
    registrationAttachmentImg,
    handleRegistrationAttachmentImg,
    directorAttachmentImg,
    kycCode,
    countries: countriesKYB,
    onSuccessCallback: () => setActiveStep(1),
    onError,
    companyDetail,
    failureReason,
  };

  const institutionalKycPersonalInfoProps = {
    dispatch,
    currentLang,
    incumbencyPhotoImg,
    frontPhotoImg,
    backPhotoImg,
    handlePhotoImg,
    kycCode,
    onPrevious: () => {
      dispatch({ type: 'kyc/KycCompanyDetail' });
      setActiveStep(0);
    },
    onSuccessCallback: () => setActiveStep(2),
    onError,
    companyDetail,
    failureReason,
  };

  const institutionalKycDocumentsProps = {
    dispatch,
    currentLang,
    authorizeAttachmentImg,
    performanceAttachmentImg,
    shareholdersAttachmentImg,
    directorAttachmentImg,
    otherAttachmentImg,
    kycCode,
    onPrevious: () => {
      dispatch({ type: 'kyc/KycCompanyDetail' });
      setActiveStep(1);
    },
    onSuccessCallback: onInstitutionalKycPersonalSuccess,
    onError,
    companyDetail,
    failureReason,
  };

  useBrowserPrompt();

  return (
    <Wrapper data-inspector="account_kyc_institutional_kyc_page">
      {showPrompt && <Prompt message={_t('teV1Wa58kb9F64G8YMXi3g')} />}
      {isSub && <ModalForbid />}
      <CustomBreadCrumbs routerName={_t('kyc.certification.mechanism')} />
      <StyledNotice />
      <Step activeStep={activeStep} />
      {activeStep === 0 && <InstitutionalKycForm {...institutionalKycFormProps} />}
      {activeStep === 1 && <InstitutionalKycPersonalInfo {...institutionalKycPersonalInfoProps} />}
      {activeStep === 2 && <InstitutionalKycDocuments {...institutionalKycDocumentsProps} />}
    </Wrapper>
  );
};

export default connect(({ kyc, user: { user: { isSub = false } = {} } = {} }) => ({
  ...kyc,
  isSub,
}))(injectLocale(InstitutionalKyc));
