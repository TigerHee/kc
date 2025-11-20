/**
 * Owner: john.zhang@kupotech.com
 */

import styled from '@emotion/styled';
import JsBridge from '@knb/native-bridge';

import { useCallback, useState } from 'react';
import { getIsAndroid } from 'src/components/InviteBenefits/tools/helper';
import { _t } from 'src/tools/i18n';
import { ReactComponent as BackIcon } from 'static/account/transfer/header-back.svg';
import { ReactComponent as CloseIcon } from 'static/account/transfer/header-close.svg';
import { StepEnum } from '../../constants';
import { CardModal } from '../OneClickProcess/components/Modal';

const HeaderContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.overlay};
  /* height: 100px; */
  /* todo: 临时处理安卓适配 */
  padding-top: ${({ isAndroid }) => (isAndroid ? '14px' : '56px')};
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderBox = styled.div`
  background-color: ${({ theme }) => theme.colors.overlay};
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  top: 56px;
`;

const HeaderTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  font-size: 18px;
  line-height: 1.4;
`;

const Com = ({ title = '', step = StepEnum.Entry, onBack = null }) => {
  const [open, setOpen] = useState(false);
  const _isAndroid = getIsAndroid();

  /**
   * 返回按钮逻辑:
   * - 入口确认页: 点击后直接关闭页面
   * - 一键迁移页: 返回【入口确认页】
   */
  const onBackClick = useCallback(() => {
    // 在transfer步骤时，点击返回按钮后返回到上一步
    if (step === StepEnum.Transfer) {
      onBack?.();
      return;
    }
    if (step === StepEnum.Entry) {
      JsBridge.open({
        type: 'func',
        params: { name: 'exit' },
      });
    }
  }, [step, onBack]);

  /**
   * 关闭按钮逻辑:
   * - 一键迁移页: 点击后弹出确认弹窗，确认后退出迁移，关闭页面
   */
  const onExitClick = () => {
    setOpen(true);
  };

  const handleDialogConfirm = () => {
    JsBridge.open({
      type: 'func',
      params: { name: 'exit' },
    });
  };

  return (
    <HeaderContainer isAndroid={_isAndroid}>
      <HeaderBox className="Header-box">
        <BackIcon onClick={onBackClick} />
        <HeaderTitle>{title}</HeaderTitle>
        {step === StepEnum.Transfer ? <CloseIcon onClick={onExitClick} /> : <div />}
        <CardModal
          open={open}
          title={_t('de77fba7f1fa4800a637')}
          subtitle={_t('557bd2a06e114800a8dd')}
          onOk={handleDialogConfirm}
          onCancel={() => setOpen(false)}
        />
      </HeaderBox>
    </HeaderContainer>
  );
};

const AppCustomHeader = ({ title = '', step = StepEnum.Entry, onBack = null }) => {
  // 仅在App的入口和迁移前页面可展示header
  if (
    !JsBridge.isApp() ||
    [StepEnum.Blocking, StepEnum.Failed, StepEnum.Process, StepEnum.Success].includes(step)
  ) {
    return null;
  }

  return <Com title={title} step={step} onBack={onBack} />;
};

export default AppCustomHeader;
