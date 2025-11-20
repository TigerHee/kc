import { createCheckClickTo, createCheckElementEnable } from "./utils";

export const url = '/account/security';

export const interceptConfig = () => {
  cy.intercept('GET', '/_api/ucenter/site-config*').as('siteConfig');
}
const getConfig = (callback) => {
  cy.wait(['@siteConfig', '@securityMethods']).then(([{ response: res1 }, { response: res2 }]) => {
    const siteConfig = res1.body.data;
    const securityMethods = res2.body.data;
    callback({ siteConfig, securityMethods });
  })
}

const checkNotExist = (id) => {
  cy.get(`[data-inspector="${id}"]`).should('not.exist');
};

export const checkElements = (tenant = 'KC') => {
  it('@level:p0 双重绑定 - passkey 绑定', () => {
    getConfig(({ siteConfig }) => {
      const rule = siteConfig.loginConfig.loginAccountTypes.includes('passkey')
        ? createCheckClickTo('/account/security/passkey')
        : checkNotExist;
      rule('passkeyBtn');
    })
  });
  it('@level:p0 双重绑定 - 邮箱绑定', () => {
    getConfig(({ securityMethods, siteConfig }) => {
      const rule = siteConfig.securityConfig.emailBindOpt && !securityMethods.EMAIL
        ? createCheckClickTo('/account/security/email')
        : checkNotExist;
      rule('bindEmailBtn');
    })
  })
  it('@level:p0 双重绑定 - 邮箱修改', () => {
    getConfig(({ securityMethods, siteConfig }) => {
      const rule = siteConfig.securityConfig.emailBindOpt && securityMethods.EMAIL
        ? createCheckClickTo('/account/security/email', true)
        : checkNotExist;
      rule('editEmailBtn');
    })
  })
  it('@level:p0 双重绑定 - 邮箱解绑', () => {
    getConfig(({ securityMethods, siteConfig }) => {
      const rule = tenant !== 'TH' && siteConfig.securityConfig.emailBindOpt && securityMethods.EMAIL
        ? createCheckClickTo('/account/security/unbind-email', true)
        : checkNotExist;
      rule('unbindEmailBtn');
    })
  })
  it('@level:p0 双重绑定 - 手机绑定', () => {
    getConfig(({ securityMethods, siteConfig }) => {
      const rule = siteConfig.securityConfig.phoneBindOpt && !securityMethods.SMS
        ? createCheckClickTo('/account/security/phone')
        : checkNotExist;
      rule('bindPhoneBtn');
    })
  })
  it('@level:p0 双重绑定 - 手機修改', () => {
    getConfig(({ securityMethods, siteConfig }) => {
      const rule = siteConfig.securityConfig.phoneBindOpt && securityMethods.SMS
        ? createCheckClickTo('/account/security/phone', true)
        : checkNotExist;
      rule('editPhoneBtn');
    })
  })
  it('@level:p0 双重绑定 - 手機解绑', () => {
    getConfig(({ securityMethods, siteConfig }) => {
      const rule = tenant !== 'TH' && siteConfig.securityConfig.phoneBindOpt && securityMethods.SMS
        ? createCheckClickTo('/account/security/unbind-phone', true)
        : checkNotExist;
      rule('unbindPhoneBtn');
    })
  })
  it('@level:p0 双重绑定 - 谷歌验证', () => {
    getConfig(({ securityMethods, siteConfig }) => {
      const rule = siteConfig.securityConfig.google2faOpt
        ? createCheckClickTo('/account/security/g2fa', securityMethods.GOOGLE2FA)
        : checkNotExist;
      rule(securityMethods.GOOGLE2FA ? "editG2FABtn" : "bindG2FABtn");
    })
  })
  it('@level:p0 高级设置 - 登录密码修改', () => {
    getConfig(({ siteConfig }) => {
      const rule = siteConfig.securityConfig.loginPwdOpt
        ? createCheckClickTo('/account/security/updatepwd')
        : checkNotExist;
      rule('modifiedLoginPwdBtn');
    })
  })
  it('@level:p0 高级设置 - 交易密码修改', () => {
    getConfig(({ siteConfig }) => {
      const rule = siteConfig.securityConfig.withdrawPwdOpt
        ? createCheckClickTo('/account/security/protect')
        : checkNotExist;
      rule('tradePassWordBtn');
    })
  })
  it('@level:p0 高级设置 - 登录 IP 限制', () => {
    createCheckElementEnable('input')('loginIp');
  })
  it('@level:p0 高级设置 - 安全语修改', () => {
    getConfig(({ siteConfig }) => {
      const rule = siteConfig.securityConfig.antiPhishingCodeOpt
        ? createCheckClickTo('/account/security/safeWord')
        : checkNotExist;
      rule('safeWordBtn');
    })
  })
  it('@level:p0 账户操作 - 账户冻结', () => {
    createCheckClickTo('/freezing')('freezeSelfBtn')
  })
  it('@level:p0 账户操作 - 注销账户', () => {
    createCheckClickTo('/account/security/deleteAccount')('deleteAccountBtn')
  })
}
