/**
 * 统一的类型定义文件
 */
import React from 'react';

// 用户信息接口
export interface UserInfo {
  lastLoginAt?: number;
  [key: string]: any;
}

// 通知/弹窗数据的统一接口
export interface Notice {
  // 基础信息
  title?: React.ReactNode;
  content?: React.ReactNode;

  // 按钮相关
  buttonAgree?: React.ReactNode;
  buttonRefuse?: React.ReactNode;
  buttonAgreeWebUrl?: string;
  buttonRefuseWebUrl?: string;

  // 样式和显示相关
  displayType?: string;
  configCode?: string;
  closable?: boolean;
  icon?: React.ReactNode;

  // 隐私政策相关
  privacy?: string;
  privacyUrl?: string;

  // 业务相关
  originalSiteType?: string;
  targetSiteType?: string;
  kycClearAt?: string | number;
  durationTime?: number;

  // 其他动态属性
  [key: string]: any;
}

// 对话框信息
export interface DialogInfo {
  dismiss?: boolean;
  visible?: boolean;
  bizType?: string;
  notice?: Notice;
}

// 对话框映射
export interface DialogInfoMap {
  [key: string]: DialogInfo;
}

// 基础对话框 Props
export interface BaseDialogProps {
  visible?: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  buttonRefuse?: React.ReactNode;
  onCancel?: () => void;
  buttonAgree?: React.ReactNode;
  onOk?: () => void;
  showDefaultPolicy?: boolean;
  privacy?: string;
  privacyUrl?: string;
  closable?: boolean;
  icon?: string;
}

// 通用对话框 Props
export interface DialogProps {
  notice?: Notice;
  bizType?: string;
  onClose?: () => void;
  visible?: boolean;
  userInfo?: UserInfo;
  passType?: string;
}
