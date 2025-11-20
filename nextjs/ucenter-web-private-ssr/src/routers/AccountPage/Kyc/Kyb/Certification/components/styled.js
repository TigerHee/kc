/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Button, Form, styled } from '@kux/mui';
import { forwardRef } from 'react';
import { _t } from 'src/tools/i18n';
import warningIcon from 'static/account/kyc/kyb/warning_icon.svg';

const SectionTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  line-height: 130%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;
const SectionDescription = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  margin-top: 4px;
`;
const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ closer }) => (closer ? 8 : 20)}px;
  margin-top: 32px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }
`;
const SectionContainer = styled.div`
  & + & {
    margin-top: 48px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-top: 40px;
    }
  }
`;
export const Section = ({ label, description, style, closer, children }) => {
  return (
    <SectionContainer style={style}>
      <SectionTitle>{label}</SectionTitle>
      {description ? <SectionDescription>{description}</SectionDescription> : null}
      <SectionContent closer={closer}>{children}</SectionContent>
    </SectionContainer>
  );
};

export const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1456px;
  gap: 40px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-direction: column;
    gap: 0;
  }
`;
export const LayoutLeft = styled.div`
  display: flex;
  gap: 24px;
  flex: 1 1 724px;
  max-width: 724px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex: 0;
    max-width: none;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 8px;
  }
`;
export const LayoutRight = styled.div`
  flex: 0 0 404px;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex: 0;
  }
`;

export const Block = styled.div`
  padding: 24px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  flex: 1;
  height: fit-content;
  overflow: hidden;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 20px 16px;
  }
`;

const ButtonGroupContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 48px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 40px;
    .KuxButton-root {
      flex: 1;
    }
  }
`;
const PrevButton = styled(Button)`
  min-width: 160px;
`;
const NextButton = styled(Button)`
  min-width: 240px;
`;
export const ButtonGroup = ({ style, loading, hiddenBack, lastStep, onNext, onBack }) => {
  return (
    <ButtonGroupContainer style={style}>
      {!hiddenBack ? (
        <PrevButton
          data-testid="backButton"
          size="large"
          variant="outlined"
          disabled={loading}
          onClick={onBack}
        >
          {_t('lockdrop.card.pagination.prev')}
        </PrevButton>
      ) : null}
      <NextButton data-testid="nextButton" size="large" disabled={loading} onClick={onNext}>
        {lastStep ? <span>{_t('submit')}</span> : <span>{_t('next')}</span>}
      </NextButton>
    </ButtonGroupContainer>
  );
};

const WarningContainer = styled.div`
  display: flex;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(248, 178, 0, 0.04);
  align-items: flex-start;
  gap: 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 12px;
  }
  ul,
  ol {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 1.5em;
  }
  ul > li {
    list-style-type: initial;
  }
  ol > li {
    list-style-type: decimal;
  }
`;
const WarningContent = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
`;
export const WarningBox = forwardRef(({ children, style }, ref) => {
  return (
    <WarningContainer ref={ref} style={style}>
      <img src={warningIcon} alt="warning" />
      <WarningContent>{children}</WarningContent>
    </WarningContainer>
  );
});

export const ExForm = styled(Form)`
  margin-top: 24px;
  .KuxForm-item {
    flex: 1;
  }
  .KuxDatePicker-wrapper {
    width: 100%;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 12px;
  }
`;
