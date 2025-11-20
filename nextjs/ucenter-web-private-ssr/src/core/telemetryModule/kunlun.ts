import { IS_SERVER_ENV } from 'kc-next/env';
import * as kunlun from '@kc/web-kunlun';
import { bootConfig } from 'kc-next/boot';

export function initKunlun() {
  if (IS_SERVER_ENV) return;
  kunlun.init({
    // 需要在 kunlun 上重点关注的接口
    apis: [
      '/_api/ucenter/sign-up-phone', // 手机号注册
      '/_api/ucenter/sign-up-email', // 邮箱注册
      '/_api/ucenter/sign-up-phone-email', // 手机号注册必须绑定邮箱
      '/_api/ucenter/v2/aggregate-login', // 登录
      '/_api/ucenter/v2/login-validation', // 登陆校验V2版本
      '/_api/ucenter/v2/external-login', // 三方账号 第一步登陆
      '/_api/ucenter/send-validation-code', // 发送验证码
      '/_api/ucenter/login-validation', // 二次校验
      '/_api/ucenter/user/password', // 设置密码
      '/_api/cyber-truck-vault/v2/api-key', // 创建 API Key
      '/_api/ucenter/v2/sub/user/create', // 新建子账号 - 普通子账号
      '/_api/ucenter/v2/kyc/sub/user/create', // 新建子账号 - 托管子账号
      '/_api/kyc/web/kyc/finish/jumio', // 完成 Jumio KYC 验证
      '/_api/kyc/web/kyc/finish/sumsub', // 完成 Sumsub KYC 验证
      '/_api/kyc/web/kyc/ng/finish', // 完成 NG KYC 验证
      '/_api/kyc/web/kyc/finish/lego', // 完成 Lego KYC 验证
      '/_api/compliance-center-flow/compliance/flow/render', // KYC 中台获取流程配置
      '/_api/compliance-center-flow/compliance/flow/after', // KYC 中台完成流程
      '/_api/kyc/web/kyc/submit/pan', // KYC 提交pan码和panCard


      // 合规相关接口
      '/_api/compliance-biz/web/compliance/rule', // 获取展业中台接口
      '/_api/universal-core/ip/country', // 获取国家IP接口
      '/_api/growth-config/get/client/config/codes', // 获取营销配置的接口主要是关注这个query的接口 businessLine=ucenter&codes=web202312homepagePop
      '/_api/ucenter/compliance/rules', // 后端对接的展业中台获取营销相关的规则
    ],
    site: bootConfig._BRAND_SITE_ || 'KC',
    project: process.env.NEXT_PUBLIC_APP_NAME,
  });
}

export { kunlun };
