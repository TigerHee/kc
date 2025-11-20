/* eslint-disable no-undef */
// 访问页面等待 site-config 接口
Cypress.Commands.add('waitForSiteConfig', (url, opt = {}) => {
  const {
    timeout = 10000,
    reg = '/_api/ucenter/site-config*',
    name = 'waitSiteConfig',
    callback = () => {},
    ...options
  } = opt;
  cy.intercept(reg).as(name);
  cy.visit(url, options);
  cy.wait(`@${name}`, { timeout }).then(({ response }) => {
    const siteConfig = response?.body?.data;
    callback(siteConfig);
  });
});

// 日本用户访问
Cypress.Commands.add('countryJP', () => {
  cy.intercept('/_api/universal-core/ip/country*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        countryCode: 'JP',
        mobileCode: '81',
      },
    },
  }).as('ipCountry');
});

// 英国用户访问
Cypress.Commands.add('countryGB', () => {
  cy.intercept('/_api/universal-core/ip/country*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        countryCode: 'GB',
        mobileCode: '44',
      },
    },
  }).as('ipCountry');
});

// 印度用户访问
Cypress.Commands.add('countryIN', () => {
  cy.intercept('/_api/universal-core/ip/country*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        countryCode: 'IN',
        mobileCode: '91',
      },
    },
  }).as('ipCountry');
});

// 拦截展业规则接口
Cypress.Commands.add('setComplianceApi', (config) => {
  cy.intercept('/_api/compliance-biz/web/compliance/rule*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      msg: 'success',
      retry: false,
      data: {
        source: 'null_unauthenticated_web_null',
        config: config,
      },
    },
  }).as('getComplianceRules');
});

// 展业规则全限制
Cypress.Commands.add('complianceForbidden', () => {
  cy.intercept('/_api/compliance-biz/web/compliance/rule*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        config: {
          'compliance.account.rightBanner.1': true,
          'compliance.account.rightAnnouncements.1': true,
        },
        source: '',
      },
    },
  }).as('complianceRule');
});

// 展业规则全放开
Cypress.Commands.add('complianceFree', () => {
  cy.intercept('/_api/compliance-biz/web/compliance/rule*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        config: {},
        source: '',
      },
    },
  }).as('complianceRule');
});

// 读取 uc 多站点配置
Cypress.Commands.add('getSiteConfig', (url, interceptor) => {
  cy.intercept('GET', '/_api/ucenter/site-config*', interceptor).as('siteConfig');
  cy.visit(url);
  return cy.wait('@siteConfig').then(({ response }) => {
    const siteConfig = response?.body?.data;
    return siteConfig;
  });
});

// account 页面 读取多站点配置，相比 getSiteConfig， 当前方法需要获取行情模块的多站点配置
Cypress.Commands.add('getAccountSiteConfig', (url, interceptor) => {
  cy.intercept('GET', '/_api/ucenter/site-config*', interceptor).as('siteConfig');
  cy.intercept('GET', '/_api/discover-front/v1/market/uc/module/config*', interceptor).as(
    'marketSiteConfig',
  );
  cy.visit(url);
  // 不能使用 prmoise.all, cy.wait 已经是 promise 了, Cypress 会对 Cypress.Commands 返回其他 promise 报错
  return cy
    .wait('@siteConfig')
    .then(({ response }) => {
      const siteConfig = response?.body?.data;
      return siteConfig;
    })
    .then((siteConfig) => {
      return cy.wait('@marketSiteConfig').then(({ response }) => {
        const marketSiteConfig = response?.body?.data;
        return [siteConfig, marketSiteConfig];
      });
    });
});

// 用户关闭全部认证方式
Cypress.Commands.add('securityMethodsNone', () => {
  cy.intercept('/_api/ucenter/user/security-methods*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        PERSONAL_KYC: false,
        WITHDRAW_PASSWORD: false,
        VOICE: false,
        SMS: false,
        PASSKEY: false,
        COMPANY_KYC: false,
        LOGIN_IP_PROTECT: false,
        EMAIL: false,
        GOOGLE2FA: false,
      },
    },
  }).as('securityMethods');
});

// 用户开启全部认证方式
Cypress.Commands.add('securityMethodsAll', () => {
  cy.intercept('/_api/ucenter/user/security-methods*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        PERSONAL_KYC: true,
        WITHDRAW_PASSWORD: true,
        VOICE: true,
        SMS: true,
        PASSKEY: true,
        COMPANY_KYC: true,
        LOGIN_IP_PROTECT: true,
        EMAIL: true,
        GOOGLE2FA: true,
      },
    },
  }).as('securityMethods');
});

// 验证码通过
Cypress.Commands.add('mockValidationCode', () => {
  cy.intercept('/_api/ucenter/verify-validation-code*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {},
    },
  }).as('verifyCode');
});
Cypress.Commands.add('validationCodePassed', () => {
  cy.mockValidationCode();
  return cy.get('[data-inspector="sec_form"] input').then(($inputs) => {
    [...$inputs].forEach(($input) => {
      cy.wrap($input).type('888888');
    });
    if ($inputs.length > 1) {
      // 有2个输入框时，需要手动点提交按钮
      cy.get('[data-inspector="sec_form_submit"]').click();
    }
  });
});

// 启用的认证方式（全关）
Cypress.Commands.add('requiredValidationsNone', () => {
  cy.intercept('/_api/ucenter/check-required-validations*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: [],
    },
  });
});
// 启用的认证方式（全开）
Cypress.Commands.add('requiredValidationsAll', () => {
  cy.intercept('/_api/ucenter/check-required-validations*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: [['google_2fa', 'my_sms', 'my_email', 'withdraw_password']],
    },
  });
});
