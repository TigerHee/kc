/**
 * Owner: vijay.zhou@kupotech.com
 * 路由变更时拦截并弹出挽留弹窗
 */
import { Button, Dialog, styled, useTheme } from '@kux/mui';
import { useEffect, useState, useRef } from 'react';
import { _t } from 'src/tools/i18n';
import warningDarkIcon from 'static/account/update-unbind-tip-dark.svg';
import warningIcon from 'static/account/update-unbind-tip.svg';
import { IS_SSR_MODE } from 'kc-next/env';
import { useRouter } from 'kc-next/router';
import { push } from '@/utils/router';
import useHistoryBlocker from 'hooks/useHistoryBlocker';

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
const PromptBasic = ({ open, onSave, onCancel }) => {

  return (
    <ExDialog
      size="medium"
      open={open}
      title={_t('75f5200963554800abfe')}
      header={null}
      footer={null}
      onCancel={onCancel}
      destroyOnClose
    >
      <Container>
        <AskToSave onSave={onSave} onCancel={onCancel} />
      </Container>
    </ExDialog>
  );
};
const PromptSSR = ({ isChanged, onSave, kybType }) => {
  const [open, setOpen] = useState(false);
  const isBlockingRef = useRef(false);
  const router = useRouter();
  const nextUrlRef = useRef(null);

  const handleSave = async () => {
    try {
      onSave();
      if (nextUrlRef.current) {
        await push(`${nextUrlRef.current}?kybType=${kybType}`);
      }
      isBlockingRef.current = false;
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };
  const handleCancel = () => {
    setOpen(false);
    isBlockingRef.current = false;
    nextUrlRef.current = null;
  };

  useEffect(() => {
    if (open) return;
    const handleRouteChangeStart = (url) => {
      if (isChanged && !isBlockingRef.current) {
        nextUrlRef.current = url;
        setOpen(true);
        isBlockingRef.current = true;
        throw new Error('道友请留步');
      }
    };
    router?.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router?.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [open, isChanged, router]);

  return <PromptBasic open={open} onSave={handleSave} onCancel={handleCancel} />;
};
const PromptCSR = ({ isChanged, onSave, kybType }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const nextLocationRef = useRef(null);
  const allowNextRef = useRef(false);

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

  useHistoryBlocker(
    (tx) => {
      if (allowNextRef.current || !isChanged) {
        allowNextRef.current = false;
        tx.retry();
        return;
      }
      nextLocationRef.current = tx;
      setOpen(true);
    },
    (isChanged && !open) || allowNextRef.current
  );

  const handleSave = async () => {
    try {
      onSave();
      const tx = nextLocationRef.current;
      nextLocationRef.current = null;
      setOpen(false);
      if (tx?.location?.pathname) {
        let pathname = tx.location.pathname;
        const { locale } = router || {};
        if (pathname.startsWith(`/${locale}`)) {
          pathname = pathname.substring(locale.length + 1);
        }
        allowNextRef.current = true;
        push(`${pathname}?kybType=${kybType}`);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleCancel = () => {
    setOpen(false);
    nextLocationRef.current = null;
    allowNextRef.current = false;
  };

  return <PromptBasic open={open} onSave={handleSave} onCancel={handleCancel} />;
};

export default function Prompt(props) {
  if (IS_SSR_MODE) {
    return <PromptSSR {...props} />;
  }
  return <PromptCSR {...props} />;
};
