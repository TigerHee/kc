/**
 * Owner: john.zhang@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { Button, styled, Tooltip, useResponsive } from '@kux/mui';
import { useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { submitSiteTransfer } from 'src/services/user_transfer';
import { _t } from 'src/tools/i18n';
import getSiteName from 'src/utils/getSiteName';
import { useMessageErr } from '../../../utils/message';
import { checkIsAppMigrationContainer } from '../../../utils/url';
import TaxCheckBox from '../AssetsTax/components/TaxCheckBox';
import { CardModal, FooterWrapper } from '../components/Modal';
import { BackBtn, ContinueBtn, OperationBox, PageFooterWrap } from './StyledComponents';

const EXIT_MODAL = 'EXIT_MODAL';
const CONTINUE_MODAL = 'CONTINUE_MODAL';

const PCFooterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

/**
 * 资产填报页的footer
 */
const AssetsFillOutFooter = ({ onBack, onContinue, checked = false, onCheckedChange = null }) => {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState(CONTINUE_MODAL);
  const isApp = JsBridge.isApp();
  const [btnLoading, setBtnLoading] = useState(false);
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
  const [confirmBtnLoading, setConfirmBtnLoading] = useState(false);
  const originSiteName = getSiteName(window._BRAND_SITE_FULL_NAME_);
  const errorMessage = useMessageErr();

  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const btnText = _t('iECAJ24wQyPUCR8nUqw6Kp');

  const handleSumbit = async () => {
    try {
      const { data, success } = await submitSiteTransfer({
        targetSiteType: userTransferInfo?.targetSiteType,
        targetRegion: userTransferInfo?.targetRegion,
      });
      if (success && data) {
        // 如果处于重新迁移，则在这里把重新迁移标识去除，由后端接管迁移状态
        sessionStorage.removeItem('ucenter_web_transfer_retry');
        setOpen(false);
        setBtnLoading(true);
        // setBtnText(_t('e28aa8b229824800a2eb'));
        if (isApp && !checkIsAppMigrationContainer()) {
          // app端如果不是在【迁移容器】下，需要跳至【迁移容器】打开，并且停止当前容器的轮询
          JsBridge.open({
            type: 'jump',
            params: { url: '/site/waitMigration?from=h5' },
          });
        }
      } else {
        // 迁移出错，极少情况会发生
        // 此时后端状态会返回
        errorMessage(_t('cb01036704184000a3a2'));
        setOpen(false);
      }
    } catch (error) {
      console.error('show submit error:', error);

      errorMessage(error);
      setBtnLoading(false);
    }
  };

  const handleContinueClick = async () => {
    setBtnLoading(true);
    // 当奥地利用户需要填报税务时，将跳过提交流水操作，页面跳到资产填报页
    if (typeof onContinue === 'function') {
      const res = await onContinue();

      if (!res) {
        setBtnLoading(false);
        return;
      }
    }
    setBtnLoading(false);
    setModalType(CONTINUE_MODAL);
    setOpen(true);
  };

  const handleExitClick = () => {
    setModalType(EXIT_MODAL);
    setOpen(true);
  };

  const handleContinue = async () => {
    try {
      setBtnLoading(true);
      await handleSumbit();
    } catch (error) {
    } finally {
      setBtnLoading(false);
    }
  };

  const continueModalProps = {
    title: _t('51d0f7d39ae74800ae09'),
    subtitle: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>{_t('853d946c20354000a794')}</div>
        <div>{_t('90ca7e44afc74000a700', { originSiteName })}</div>
        <div>{_t('2c3e693021994800a828')}</div>
      </div>
    ),
    footer: (
      <FooterWrapper>
        <Button
          fullWidth
          loading={confirmBtnLoading}
          onClick={async () => {
            setConfirmBtnLoading(true);
            await handleContinue();
            setConfirmBtnLoading(false);
          }}
        >
          {confirmBtnLoading ? '' : _t('iECAJ24wQyPUCR8nUqw6Kp')}
        </Button>
      </FooterWrapper>
    ),
  };

  const exitModalProps = {
    title: _t('de77fba7f1fa4800a637'),
    subtitle: _t('557bd2a06e114800a8dd'),
    onOk() {
      setOpen(false);
      onBack();
    },
  };

  const modalMap = {
    [CONTINUE_MODAL]: continueModalProps,
    [EXIT_MODAL]: exitModalProps,
  };

  const modalProps = modalMap[modalType];

  const PCContinueBtn = checked ? (
    <ContinueBtn loading={btnLoading} onClick={handleContinueClick}>
      {btnText}
    </ContinueBtn>
  ) : (
    <Tooltip placement="top" leaveDelay={50} title={_t('check.required')}>
      <div>
        <ContinueBtn loading={btnLoading} disabled onClick={handleContinueClick}>
          {btnText}
        </ContinueBtn>
      </div>
    </Tooltip>
  );
  const H5ContinueBtn = checked ? (
    <Button fullWidth loading={btnLoading} onClick={handleContinueClick}>
      {btnText}
    </Button>
  ) : (
    <Tooltip leaveDelay={50} title={_t('check.required')}>
      <div>
        <Button fullWidth disabled loading={btnLoading} onClick={handleContinueClick}>
          {btnText}
        </Button>
      </div>
    </Tooltip>
  );

  return (
    <>
      {isH5 ? (
        <div>
          <TaxCheckBox checked={checked} onChange={onCheckedChange} />
          {H5ContinueBtn}
        </div>
      ) : (
        <PCFooterContainer>
          <TaxCheckBox checked={checked} onChange={onCheckedChange} />
          <PageFooterWrap>
            <OperationBox>
              <BackBtn variant="text" onClick={handleExitClick}>
                {_t('db14ad1d2ada4800a48e')}
              </BackBtn>
              {PCContinueBtn}
            </OperationBox>
          </PageFooterWrap>
        </PCFooterContainer>
      )}
      <CardModal
        {...modalProps}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default AssetsFillOutFooter;
