/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { useSelector } from 'react-redux';
import { _t } from 'src/tools/i18n';
import { ReactComponent as Step1Icon } from 'static/account/kyc/kyb/step1_icon.svg';
import { ReactComponent as Step2Icon } from 'static/account/kyc/kyb/step2_icon.svg';
import { ReactComponent as Step3Icon } from 'static/account/kyc/kyb/step3_icon.svg';
import useKybStatus from '../../../hooks/useKybStatus';

const Container = styled.div`
  padding: 24px 24px 28px 24px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.cover2};
`;

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Step = styled.div`
  display: flex;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  color: ${({ theme, active }) => (active ? theme.colors.text : theme.colors.text60)};
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 12px;
`;

const STEPS = [
  { icon: () => <Step1Icon />, label: _t('kyc.company.information') },
  { icon: () => <Step2Icon />, label: _t('7f950b18671f4000a04f') },
  { icon: () => <Step3Icon />, label: _t('9f9b6d69df5c4000a74a') },
  {
    icon: () => <Step3Icon />,
    label: `${_t('f5cf538081d54000af8d')} ${_t('bce448f70a354000a28c')}`,
  },
];

const VerificationRequirements = ({ desc, children }) => {
  const { currentPhase = 0 } = useSelector((state) => state.kyb?.companyDetail ?? {});
  const { kybStatus, kybStatusEnum } = useKybStatus();

  return (
    <>
      <Container>
        {desc ? <Description>{_t('a251c2923cb54000a15c')}</Description> : null}
        <Steps>
          {STEPS.map((step, index) => {
            const isActive = kybStatus !== kybStatusEnum.UNVERIFIED || currentPhase > index;
            const Icon = step.icon;
            return (
              <Step active={isActive} key={step.label}>
                <Icon />
                <span>{step.label}</span>
              </Step>
            );
          })}
        </Steps>
        {children}
      </Container>
    </>
  );
};

export default VerificationRequirements;
