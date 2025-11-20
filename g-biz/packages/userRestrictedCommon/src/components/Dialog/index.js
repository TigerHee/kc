/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import { kcsensorsManualTrack } from '@utils/sensors';
import RegisterDialog from './RegisterDialog';
import IPDialog from './IPDialog';
import ForceKYCDialog from './ForceKYCDialog';
import ClearanceDialog from './ClearanceDialog';
import ExamineDialog from './ExamineDialog';
import {
  ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG,
  ACCOUNT_TRANSFER_SPECIAL_DIALOG,
} from '../../constants';

import AccountTransferDialog from './AccountTransferDialog';

export default ({ notice, bizType, onClose, visible, userInfo, currentLang, passType }) => {
  // 统一弹窗曝光埋点
  useEffect(() => {
    if (visible) {
      kcsensorsManualTrack(
        {
          spm: ['topDialog', '1'],
          data: {
            guideType: bizType,
            name: 'fix_popup',
            reportType: 'show',
            guideColor: notice?.displayType,
            popType:
              passType === 'moveCheck' ? 'active' : passType === 'timeCheck' ? 'passive' : '',
            modelCode: notice?.configCode,
          },
        },
        'publicGuideEvent',
      );
    }
  }, [visible, bizType, notice, passType]);

  const handleManualTrack = (reportType = '') => {
    const data = {
      guideType: bizType,
      name: 'fix_popup',
      reportType,
      guideColor: notice?.displayType,
      popType: passType === 'moveCheck' ? 'active' : passType === 'timeCheck' ? 'passive' : '',
      modelCode: notice?.configCode,
    };
    if (
      [ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG, ACCOUNT_TRANSFER_SPECIAL_DIALOG].includes(bizType)
    ) {
      data.user_original_siteType = notice?.originalSiteType;
      data.user_target_siteType = notice?.targetSiteType;
    }
    kcsensorsManualTrack(
      {
        spm: ['topDialog', '1'],
        data,
      },
      'publicGuideEvent',
    );
  };

  const handleClickCancel = () => {
    onClose && onClose();
    handleManualTrack('close');
  };

  const handleClickOk = () => {
    onClose && onClose();
    handleManualTrack('click');
  };

  if (bizType === 'REGISTER') {
    // 新增禁止弹窗
    return (
      <RegisterDialog
        visible={visible}
        notice={notice}
        onClose={handleClickCancel}
        onOk={handleClickOk}
      />
    );
  }
  if (bizType === 'IP_DIALOG' || bizType === 'ENGLAND_SPECIAL_DIALOG') {
    // IP禁止弹窗、英国地区封禁弹窗
    return (
      <IPDialog
        bizType={bizType}
        visible={visible}
        notice={notice}
        onClose={handleClickCancel}
        onOk={handleClickOk}
        currentLang={currentLang}
      />
    );
  }
  if (
    [ACCOUNT_TRANSFER_SPECIAL_DIALOG, ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG].includes(bizType)
  ) {
    // 用户迁移入口弹窗
    return (
      <AccountTransferDialog
        bizType={bizType}
        visible={visible}
        userInfo={userInfo}
        notice={notice}
        onClose={handleClickCancel}
        onOk={handleClickOk}
        currentLang={currentLang}
      />
    );
  }
  if (bizType === 'FORCE_KYC_DIALOG') {
    // 强制KYC弹窗
    return (
      <ForceKYCDialog
        visible={visible}
        notice={notice}
        onClose={handleClickCancel}
        onOk={handleClickOk}
        userInfo={userInfo}
        currentLang={currentLang}
      />
    );
  }
  if (bizType === 'CLEARANCE_DIALOG') {
    // 自动化清退
    return (
      <ClearanceDialog
        visible={visible}
        notice={notice}
        onClose={handleClickCancel}
        onOk={handleClickOk}
        userInfo={userInfo}
        currentLang={currentLang}
      />
    );
  }
  if (bizType === 'EXAMINE_DIALOG') {
    // 信息审查
    return (
      <ExamineDialog
        visible={visible}
        notice={notice}
        onClose={handleClickCancel}
        onOk={handleClickOk}
        userInfo={userInfo}
        currentLang={currentLang}
      />
    );
  }
  return null;
};
