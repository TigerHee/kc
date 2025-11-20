/**
 * Owner: vijay.zhou@kupotech.com
 * 路由变更时拦截并弹出挽留弹窗
 */
import { Button, Dialog, styled, useTheme } from '@kux/mui';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { _t } from 'src/tools/i18n';
import warningDarkIcon from 'static/account/update-unbind-tip-dark.svg';
import warningIcon from 'static/account/update-unbind-tip.svg';

const Container = styled.div``;

const AskToSaveContainer = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const AskToSaveContent = styled.div`
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 148px;
  }
`;
const AskToSaveTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  margin-top: 8px;
`;
const AskToSaveDesc = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  margin-top: 8px;
`;
const AskToSaveBenefits = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.cover2};
  margin-top: 12px;
  width: 100%;
`;
const AskToSaveBenefitItem = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  display: flex;
  justify-content: space-between;
  > span:nth-child(even) {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const AskToSave = ({ onSave, onCancel }) => {
  const { currentTheme } = useTheme();

  return (
    <AskToSaveContainer>
      <AskToSaveContent>
        <img src={currentTheme === 'dark' ? warningDarkIcon : warningIcon} alt="warning" />
        <AskToSaveTitle>{_t('kyc_process_quit')}</AskToSaveTitle>
        <AskToSaveDesc>{_t('kyc_homepage_quit2')}</AskToSaveDesc>
        <AskToSaveBenefits>
          <AskToSaveBenefitItem>
            <span>{_t('deposit')}</span>
            <span>{_t('967eebf066114800acaa')}</span>
          </AskToSaveBenefitItem>
          <AskToSaveBenefitItem>
            <span>{_t('withdrawal')}</span>
            <span>{_t('b759c35a54154800a334')}</span>
          </AskToSaveBenefitItem>
        </AskToSaveBenefits>
      </AskToSaveContent>
      <Button onClick={onCancel}>{_t('eQ89hvVQ7xXYATdU7HbELL')}</Button>
      <Button variant="text" style={{ height: 18 }} onClick={onSave}>
        {_t('kyc_homepage_quit_button')}
      </Button>
    </AskToSaveContainer>
  );
};

const ExDialog = styled(Dialog)`
  .KuxModalFooter-root {
    padding: 20px 32px;
    border-top: 0.5px solid ${({ theme }) => theme.colors.cover8};
  }
  .KuxModalFooter-buttonWrapper {
    .KuxButton-root:first-child {
      margin-right: 24px;
      color: ${({ theme }) => theme.colors.text60};
      &:hover {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;
const Prompt = ({ isChanged, onSave, kybType }) => {
  const [open, setOpen] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [nextLocation, setNextLocation] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const handler = (event) => {
      if (isChanged) {
        event.returnValue = isChanged;
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [isChanged]);

  useEffect(() => {
    const unblock = history.block((location) => {
      if (!isBlocking && isChanged) {
        setNextLocation(location);
        setIsBlocking(true);
        setOpen(true);
        return false;
      }
      return true;
    });
    return () => unblock();
  }, [isChanged, isBlocking, history]);

  const handleSave = async () => {
    try {
      onSave();
      setOpen(false);
      if (nextLocation) {
        history.push(`${nextLocation.pathname}?kybType=${kybType}`);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleCancel = () => {
    setIsBlocking(false);
    setOpen(false);
  };

  return (
    <ExDialog
      size="medium"
      open={open}
      title={_t('75f5200963554800abfe')}
      header={null}
      footer={null}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Container>
        <AskToSave onSave={handleSave} onCancel={handleCancel} />
      </Container>
    </ExDialog>
  );
};

export default Prompt;
