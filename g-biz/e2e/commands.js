/* eslint-disable no-undef */

// 访问页面等待 site-config 接口
Cypress.Commands.add('waitForSiteConfig', (url, opt = {}) => {
  const {
    timeout = 10000,
    reg = '/_api/ucenter/site-config*',
    name = 'waitSiteConfig',
    ...options
  } = opt;
  cy.intercept(reg).as(name);
  cy.visit(url, options);
  cy.wait(`@${name}`, { timeout });
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
  }).as('countryGB');
});

// 香港用户访问
Cypress.Commands.add('countryHK', () => {
  cy.intercept('/_api/universal-core/ip/country*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        countryCode: 'HK',
        mobileCode: '852',
      },
    },
  }).as('countryHK');
});

// 土耳其用户访问
Cypress.Commands.add('countryTR', () => {
  cy.intercept('/_api/universal-core/ip/country*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        countryCode: 'TR',
        mobileCode: '90',
      },
    },
  }).as('countryTR');
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
  }).as('countryIN');
});

// 奥地利用户访问
Cypress.Commands.add('countryAT', () => {
  cy.intercept('/_api/universal-core/ip/country*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        countryCode: 'AT',
        mobileCode: '43',
      },
    },
  }).as('countryAT');
});

// rcode校验拦截
Cypress.Commands.add(
  'rcodeValidate',
  (
    data = {
      region: null,
      isIntercept: false,
      regionV2: null,
      interceptV2: false,
      interceptV3: false,
      inviterCategory: '',
    },
  ) => {
    cy.intercept('/_api/growth-ucenter/invitation/user-rcode/validate*', {
      statusCode: 200,
      body: {
        success: true,
        code: '200',
        data,
      },
    }).as('rcodeValidate');
  },
);

// 展业规则全限制
Cypress.Commands.add('complianceFobidden', () => {
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

// 手动设置展业规则
Cypress.Commands.add('setComplianceApi', (config) => {
  cy.intercept('/_api/compliance-biz/web/compliance/rule*', {
    statusCode: 200,
    body: {
      'success': true,
      'code': '200',
      'msg': 'success',
      'retry': false,
      'data': {
        'source': 'null_unauthenticated_web_null',
        'config': config,
      },
    },
  }).as('getComplianceRules');
});

// 读取多站点配置
Cypress.Commands.add('getSiteConfig', (url) => {
  cy.intercept('GET', '/_api/ucenter/site-config*').as('siteConfig');
  cy.visit(url);
  cy.wait('@siteConfig').then(({ response }) => {
    const siteConfig = response?.body?.data;
    return siteConfig;
  });
});

// 设置多站点配置
Cypress.Commands.add('setSiteConfigApi', () => {
  cy.intercept('/_api/ucenter/site-config*', {
    statusCode: 200,
    body: {
      'success': true,
      'code': '200',
      'msg': 'success',
      'retry': false,
      'data': {
        'accountConfig': {
          'siteType': 'turkey',
          'siteLogoUrl': '',
          'bindingLimits': [],
          'accountTypes': ['email', 'phone'],
          'supportExtAccounts': [],
          'supportSubAccount': false,
          'supportRCode': false,
          'subUserPermissions': ['spot'],
          'subUserTypes': ['normal'],
        },
        'registerConfig': {
          'supportRegisterGuide': false,
          'registerPageContextUrl': '',
          'serviceTermsUrl':
            'https://kucointurkiye1.zendesk.com/hc/tr/articles/9221322349071-KULLANICI-S%C3%96ZLE%C5%9EMES%C4%B0',
          'privacyTermsUrl':
            'https://kucointurkiye1.zendesk.com/hc/tr/articles/9221331006991-G%C4%B0ZL%C4%B0L%C4%B0K-POL%C4%B0T%C4%B0KASI',
        },
        'loginConfig': {
          'loginAccountTypes': ['userpwd'],
          'loginPageContextUrl': '',
        },
        'securityConfig': {
          'loginPwdOpt': true,
          'withdrawPwdOpt': true,
          'phoneBindOpt': true,
          'emailBindOpt': true,
          'extAccountBindOpt': false,
          'google2faOpt': true,
          'antiPhishingCodeOpt': true,
          'biometricsOpt': false,
        },
        'myConfig': {
          'directoryConfig': {
            'pageDirectorys': ['kyc', 'downloadcenter', 'overview', 'accountsecurity', 'api'],
            'profilePhotoDirectorys': ['accountinfo'],
            'rateStandardUrl': '/privilege',
          },
          'overviewConfig': {
            'assetFuncs': ['depositcoins', 'assetoverview', 'entrustedinquiry', 'withdrawalcoins'],
            'supportMyInfo': true,
            'supportNewUserBenefits': false,
            'supportVipRate': false,
            'supportActivityEntry': false,
            'supportList': false,
            'supportNotice': true,
            'supportDownloadGuide': true,
          },
        },
      },
    },
  }).as('setSiteConfigApi');
});

Cypress.Commands.add('ukTopRestrictNotice', () => {
  cy.intercept('/_api/user-dismiss/ip-dismiss/notice/web/gb*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        IP_TOP_MESSAGE: {
          dismiss: true,
          notice: {
            showPrivacy: true,
            displayType: 'ERROR',
            topMessage:
              'Based on your England IP address, we currently do not provide services in your country or region due to local laws, regulations, or policies. We apologize for any inconvenience this may cause.',
            'closable': true,
          },
          bizType: 'IP_TOP_MESSAGE',
        },
      },
    },
  }).as('ukTopRestrictNotice');
});

Cypress.Commands.add('commonTopRestrictNotice', () => {
  cy.intercept('/_api/user-dismiss/ip-dismiss/notice*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        IP_TOP_MESSAGE: {
          dismiss: true,
          notice: {
            showPrivacy: true,
            displayType: 'ERROR',
            topMessage:
              'Based on your IP address, we currently do not provide services in your country or region due to local laws, regulations, or policies. We apologize for any inconvenience this may cause.',
            'closable': true,
          },
          bizType: 'IP_TOP_MESSAGE',
        },
      },
    },
  }).as('commonTopRestrictNotice');
});

// 展业中台隐藏注册流程营销内容
Cypress.Commands.add('complianceBoxSignupMkt', () => {
  cy.intercept('/_api/ucenter/compliance/rules*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        signUpGuide: false,
      },
    },
  }).as('complianceRule');
});

// 标记为新手
Cypress.Commands.add('markAsNovice', () => {
  cy.intercept('/_api/novice-zone/v2/web/novice/summary*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        markAsNovice: true,
        ladderInfoList: null,
        specialNoviceFlag: true,
        schoolFlag: true,
        extraParams: {
          bzModuleSwitchWeb: false,
        },
      },
    },
  }).as('complianceRule');
});
