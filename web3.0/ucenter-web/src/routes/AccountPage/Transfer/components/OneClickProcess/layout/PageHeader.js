/**
 * Owner: jacky@kupotech.com
 */

import alertWarnIcon from 'static/account/transfer/alert-warn.svg';
import { ReactComponent as CloseIcon } from 'static/account/transfer/close.svg';

import JsBridge from '@knb/native-bridge';
import { styled } from '@kux/mui';
import { useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import { CardModal } from '../components/Modal';

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
`;

export default function PageHeader({
  onBack,
  pageTitle,
  pageSubTitle,
  alertTips,
  style,
  isShowAlert = true,
}) {
  const isApp = JsBridge.isApp();
  const [open, setOpen] = useState(false);
  const totalHeaderHeight = useSelector((state) => state['$header_header']?.totalHeaderHeight);

  return (
    <>
      <PageNav stickyTop={totalHeaderHeight + 1} isSticky={!isApp && !!onBack} style={style}>
        {!isApp && onBack && (
          <StyledCloseIcon
            onClick={() => {
              setOpen(true);
            }}
          />
        )}
      </PageNav>

      <PageTitle>{pageTitle}</PageTitle>
      <PageSubTitle>{pageSubTitle}</PageSubTitle>
      <Alert>
        {isShowAlert && <AlertIcon src={alertWarnIcon} alt="warning-icon" />}
        <span>{alertTips}</span>
      </Alert>
      <CardModal
        title={_t('de77fba7f1fa4800a637')}
        subtitle={_t('557bd2a06e114800a8dd')}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          setOpen(false);
          onBack?.();
        }}
      />
    </>
  );
}

const PageNav = styled.div`
  position: ${({ isSticky }) => (isSticky ? 'sticky' : 'static')};
  /* 减掉border线高度 */
  top: ${({ stickyTop }) => `${stickyTop - 2}px`};
  background-color: ${({ theme }) => theme.colors.overlay};
  z-index: 4;
  justify-content: end;

  display: flex;
  /* padding: 32px 0 24px; */
  padding: 24px 0 24px;
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    /* top: 103px; */
    padding: 16px 0 24px;
  }
`;

const BackBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const PageTitle = styled.h1`
  margin: 0 0 12px 0;
  font-weight: 700;
  font-size: 28px;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    /* top: 170px; */
    margin: 0;
    font-size: 20px;
  }
`;

const PageSubTitle = styled.p`
  margin: 0 0 12px 0;
  font-weight: 400;
  font-size: 14px;
  line-height: 180%;
  color: ${({ theme }) => theme.colors.text60};
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const Alert = styled.div`
  padding-top: 12px;
  padding-right: 16px;
  padding-bottom: 12px;
  padding-left: 16px;
  display: flex;
  gap: 8px;
  border-radius: 8px;
  font-size: 14px;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.colors.text60};
  background: ${({ theme }) => theme.colors.complementary8};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 6px;
    font-size: 12px;
  }
`;

const AlertIcon = styled.img`
  margin-top: 2px;
  width: 14.6px;
  height: 14.6px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 12.8px;
    height: 12.8px;
    margin-top: 1.6px;
  }
`;
