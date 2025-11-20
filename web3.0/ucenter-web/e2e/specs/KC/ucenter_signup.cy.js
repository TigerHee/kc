import { getExist } from '../common/utils'
const url = '/ucenter/signup';

describe(`【${url}】`, () => {
  it(`@level:p0 手机号注册`, () => {
    cy.waitForSiteConfig(`${url}?rcode=DEBLEX`, { callback: (siteConfig) => {
      cy.get('[data-inspector="signup_page"]').should('exist');
    // 注册协议默认选中
    cy.get('#agreementTerm').should('be.checked');
    cy.get('#privacyUserTerm').should('be.checked');

    // 输入手机号
    cy.get('[data-inspector="signin_account_input"] input').clear().type('138888');
    // 出现了区号选择框
    cy.get('[data-inspector="phone-selector-trigger"]').should('exist').click();
    // 打开区号选择框抽屉
    cy.get('[data-inspector="phone_area_selector"]').should('exist');
    // 区号搜索，并且点击一个区号
    cy.get('[data-inspector="phone_area_selector_search"] input').type('1242');
    // phone_area_selector_item 只存在一个，并且 innerText 包含 输入区号
    cy.get('[data-inspector="phone_area_selector_item"]')
      .should('have.length', 1)
      .should('contain.text', '1242')
      .click();
    // 区号选择框抽屉关闭
    cy.get('[data-inspector="phone_area_selector"]').should('not.exist');
    // 区号被选中
    cy.get('[data-inspector="phone-selector-text"]').should('contain.text', '+1242');

    // 验证 rcode
    cy.get('[data-inspector="signup_rcode_input"] input').should(getExist(siteConfig?.accountConfig.supportRCode));
    if (siteConfig?.accountConfig.supportRCode) {
      cy.get('[data-inspector="signup_rcode_input"] input').should('have.value', 'DEBLEX');
    }

    // 拦截验证码请求
    cy.intercept('/_api/ucenter/register-short-message*', {
      success: true,
      code: '200',
      msg: 'Verification code sent.',
      retry: false,
      data: {},
    }).as('registerShortMessage');
    // 拦截验证接口
    cy.intercept('/_api/ucenter/sign-up-validation*', {
      success: true,
      code: '200',
      msg: 'success',
      retry: false,
      data: {},
    }).as('signupValidation');
    // 点击注册按钮
    cy.get('[data-inspector="signup_confirm_btn"]').click();

    // 等待发送验证码请求完成
    cy.wait('@registerShortMessage');

    // 输入验证码页面可见
    cy.get('[data-inspector="account_verify_wrapper"]').should('exist');

    // 输入验证码
    cy.get('[data-inspector="account_verify_wrapper"] input').type('123456');
    // 点击校验验证码
    cy.get('[data-inspector="set_password_btn"]').click();

    // 等待校验验证码请求完成
    cy.wait('@signupValidation');

    // 到达输入密码页面
    // 输入小于10位不符合规则的密码
    cy.get('[data-inspector="password_input_with_eye"] input').type('Ab1234567');
    // 密码强度不展示
    cy.get('[data-inspector="password_strength"]').should('not.exist');
    // 输入符合规则的密码
    cy.get('[data-inspector="password_input_with_eye"] input').clear().type('Ab12345678');

    // 密码强度展示 密码强度低
    cy.get('[data-inspector="password_strength"]').should('exist');
    // 密码强度提示展示
    cy.get('[data-inspector="password_strength"] .password-strength-desc').should('exist');

    // 输入密码强度高的密码
    cy.get('[data-inspector="password_input_with_eye"] input').clear().type('Ab0123456789.');
    // 密码强度展示
    cy.get('[data-inspector="password_strength"]').should('exist');
    // 密码强度提示不展示
    cy.get('[data-inspector="password_strength"] .password-strength-desc').should('not.visible');

    cy.intercept('/_api/ucenter/sign-up-phone*', {
      code: '200',
      data: {
        isPhoneValidate: true,
        honorLevel: 0,
        language: 'en_US',
        uid: 2400010000082681,
        createdAt: 1749713765517,
        countryCode: '91',
        siteType: 'global',
        lastLoginCountry: 'GB',
        timeZone: 'singapore',
        oesBound: -1,
        domainId: 'kucoin',
        phone: '91-2025061201',
        phoneValidate: true,
        status: 2,
      },
      msg: 'success',
      retry: false,
      success: true,
    }).as('signupSubmit');
    // 点击提交
    cy.get('[data-inspector="signup_setpwd_btn"]').click();

    // 等待注册请求完成
    cy.wait('@signupSubmit');
    } });
  });

  it(`@level:p0 邮箱注册`, () => {
    cy.waitForSiteConfig(`${url}`);
    cy.get('[data-inspector="signup_page"]').should('exist');
    // 注册协议默认选中
    cy.get('#agreementTerm').should('be.checked');
    cy.get('#privacyUserTerm').should('be.checked');

    // 输入邮箱
    cy.get('[data-inspector="signin_account_input"] input').type('138888@gmail.com');
    // 区号选择框不可见
    cy.get('[data-inspector="phone-selector-trigger"]').should('not.visible');

    // 拦截验证码请求
    cy.intercept('/_api/ucenter/register-email*', {
      success: true,
      code: '200',
      msg: 'Verification code sent.',
      retry: false,
      data: {},
    }).as('registerEmailMessage');
    // 拦截验证接口
    cy.intercept('/_api/ucenter/sign-up-validation*', {
      success: true,
      code: '200',
      msg: 'success',
      retry: false,
      data: {},
    }).as('signupValidation');
    // 点击注册按钮
    cy.get('[data-inspector="signup_confirm_btn"]').click();

    // 等待发送验证码请求完成
    cy.wait('@registerEmailMessage');

    // 输入验证码页面可见
    cy.get('[data-inspector="account_verify_wrapper"]').should('exist');

    // 输入验证码
    cy.get('[data-inspector="account_verify_wrapper"] input').type('123456');
    // 点击校验验证码
    cy.get('[data-inspector="set_password_btn"]').click();

    // 等待校验验证码请求完成
    cy.wait('@signupValidation');

    // 到达输入密码页面
    // 输入小于10位不符合规则的密码
    cy.get('[data-inspector="password_input_with_eye"] input').type('Ab1234567');
    // 密码强度不展示
    cy.get('[data-inspector="password_strength"]').should('not.exist');
    // 输入符合规则的密码
    cy.get('[data-inspector="password_input_with_eye"] input').clear().type('Ab12345678');

    // 密码强度展示 密码强度低
    cy.get('[data-inspector="password_strength"]').should('exist');
    // 密码强度提示展示
    cy.get('[data-inspector="password_strength"] .password-strength-desc').should('exist');

    // 输入密码强度高的密码
    cy.get('[data-inspector="password_input_with_eye"] input').clear().type('Ab0123456789.');
    // 密码强度展示
    cy.get('[data-inspector="password_strength"]').should('exist');
    // 密码强度提示不展示
    cy.get('[data-inspector="password_strength"] .password-strength-desc').should('not.visible');

    cy.intercept('/_api/ucenter/sign-up-email*', {
      code: '200',
      data: {
        honorLevel: 0,
        language: 'en_US',
        emailValidate: true,
        uid: 2400010000082710,
        createdAt: 1749715942399,
        isEmailValidate: true,
        email: 'sean.shi2025061202@kupotech.com',
        siteType: 'global',
        lastLoginCountry: 'GB',
        timeZone: 'singapore',
        oesBound: -1,
        domainId: 'kucoin',
        status: 2,
      },
      msg: 'success',
      retry: false,
      success: true,
    }).as('signupSubmit');
    // 点击提交
    cy.get('[data-inspector="signup_setpwd_btn"]').click();

    // 等待注册请求完成
    cy.wait('@signupSubmit');
  });

  it(`@level:p0 手机号注册绑定邮箱`, () => {
    // 拦截 abTest 请求
    cy.intercept('https://ab.kucoin.plus/api/v2/abtest/online/results*', {
      status: 'SUCCESS',
      results: [
        {
          abtest_experiment_id: '1399',
          abtest_experiment_group_id: '0',
          is_control_group: true,
          is_white_list: true,
          experiment_type: 'CODE',
          variables: [
            {
              name: 'inWhiteList',
              type: 'BOOLEAN',
              value: 'true',
            },
          ],
          abtest_experiment_result_id: '13990200',
          subject_id: '2400010000084679',
          subject_name: 'USER',
          abtest_experiment_version: '2',
          cacheable: false,
        },
      ],
      out_list: [],
      is_custom_cache: false,
    }).as('abTest');
    cy.waitForSiteConfig(`${url}`);
    cy.wait('@abTest');
    cy.get('[data-inspector="signup_page"]').should('exist');
    // 注册协议默认选中
    cy.get('#agreementTerm').should('be.checked');
    cy.get('#privacyUserTerm').should('be.checked');

    // 输入手机号
    cy.get('[data-inspector="signin_account_input"] input').clear().type('138888');
    // 出现了区号选择框
    cy.get('[data-inspector="phone-selector-trigger"]').should('exist').click();
    // 打开区号选择框抽屉
    cy.get('[data-inspector="phone_area_selector"]').should('exist');
    // 区号搜索，并且点击一个区号
    cy.get('[data-inspector="phone_area_selector_search"] input').type('1242');
    // phone_area_selector_item 只存在一个，并且 innerText 包含 输入区号
    cy.get('[data-inspector="phone_area_selector_item"]')
      .should('have.length', 1)
      .should('contain.text', '1242')
      .click();
    // 区号选择框抽屉关闭
    cy.get('[data-inspector="phone_area_selector"]').should('not.exist');
    // 区号被选中
    cy.get('[data-inspector="phone-selector-text"]').should('contain.text', '+1242');

    // 拦截验证码请求
    cy.intercept('/_api/ucenter/register-short-message*', {
      success: true,
      code: '200',
      msg: 'Verification code sent.',
      retry: false,
      data: {},
    }).as('registerShortMessage');
    // 拦截验证接口
    cy.intercept('/_api/ucenter/sign-up-validation*', {
      success: true,
      code: '200',
      msg: 'success',
      retry: false,
      data: {},
    }).as('signupValidation');
    // 点击注册按钮
    cy.get('[data-inspector="signup_confirm_btn"]').click();

    // 等待发送验证码请求完成
    cy.wait('@registerShortMessage');

    // 输入验证码页面可见
    cy.get('[data-inspector="account_verify_wrapper"]').should('exist');

    // 输入验证码
    cy.get('[data-inspector="account_verify_wrapper"] input').type('123456');
    // 点击校验验证码
    cy.get('[data-inspector="set_password_btn"]').click();

    // 等待校验验证码请求完成
    cy.wait('@signupValidation');

    // 绑定邮箱页面
    cy.get('[data-inspector="bind_email_input"] input').type('138888@gmail.com');
    // 拦截验证码请求
    cy.intercept('/_api/ucenter/register-email*', {
      success: true,
      code: '200',
      msg: 'Verification code sent.',
      retry: false,
      data: {},
    }).as('registerEmailMessage');

    // 点击绑定按钮
    cy.get('[data-inspector="bind_email_btn"]').click();

    // 等待发送验证码请求完成
    cy.wait('@registerEmailMessage');

    // 输入验证码页面可见
    cy.get('[data-inspector="account_verify_wrapper"]').should('exist');

    // 输入验证码
    cy.get('[data-inspector="account_verify_wrapper"] input').type('123456');
    // 点击校验验证码
    cy.get('[data-inspector="set_password_btn"]').click();

    // 等待校验验证码请求完成
    cy.wait('@signupValidation');

    // 到达输入密码页面
    // 输入小于10位不符合规则的密码
    cy.get('[data-inspector="password_input_with_eye"] input').type('Ab1234567');
    // 密码强度不展示
    cy.get('[data-inspector="password_strength"]').should('not.exist');
    // 输入符合规则的密码
    cy.get('[data-inspector="password_input_with_eye"] input').clear().type('Ab12345678');

    // 密码强度展示 密码强度低
    cy.get('[data-inspector="password_strength"]').should('exist');
    // 密码强度提示展示
    cy.get('[data-inspector="password_strength"] .password-strength-desc').should('exist');

    // 输入密码强度高的密码
    cy.get('[data-inspector="password_input_with_eye"] input').clear().type('Ab0123456789.');
    // 密码强度展示
    cy.get('[data-inspector="password_strength"]').should('exist');
    // 密码强度提示不展示
    cy.get('[data-inspector="password_strength"] .password-strength-desc').should('not.visible');
    // 拦截手机号注册绑定邮箱 注册接口
    cy.intercept('/_api/ucenter/sign-up-phone-email*', {
      code: '200',
      data: {
        isPhoneValidate: true,
        honorLevel: 0,
        language: 'en_US',
        emailValidate: true,
        uid: 2400010000082799,
        createdAt: 1749722105977,
        isEmailValidate: true,
        countryCode: '91',
        email: '12312@gmail.com',
        siteType: 'global',
        lastLoginCountry: 'US',
        timeZone: 'singapore',
        oesBound: -1,
        domainId: 'kucoin',
        phone: '91-2025061204',
        phoneValidate: true,
        status: 2,
      },
      msg: 'success',
      retry: false,
      success: true,
    }).as('signupSubmit');
    // 点击提交
    cy.get('[data-inspector="signup_setpwd_btn"]').click();

    // 等待注册请求完成
    cy.wait('@signupSubmit');
  });

  it(`@level:p0 注册左侧区域`, () => {
    // 非印度、非英国用户访问，除了印度注册引导，其他展业规则全部打开
    cy.setComplianceApi({
      'compliance.signup.leftIndia.1': false,
    });
    cy.waitForSiteConfig(url);
    cy.get('[data-inspector="signup_page"]').should('exist');
    // 注册协议默认选中
    cy.get('#agreementTerm').should('be.checked');
    cy.get('#privacyUserTerm').should('be.checked');

    // 左侧区域存在
    cy.get('[data-inspector="signup_left_area"]').should('exist');
    // 印度用户专属的广告不存在
    cy.get('[data-inspector="signup_left_india_module"]').should('not.exist');
    // 左侧广告模块存在
    // cy.get('[data-inspector="signup_left_mtk_content"]').should('exist');
    cy.get('[data-inspector="signup_left_text1"]').should('exist');
    cy.get('[data-inspector="signup_left_text2"]').should('exist');
    // 储备金存在
    cy.get('[data-inspector="signup_left_reserve"]').should('exist');

    // 点击快速登錄
    cy.get('[data-inspector="signup_had_account_btn"]').should('exist').click();
    // 跳转到登录页面
    cy.url().should('include', '/ucenter/signin');
  });

  it(`【GB】英国用户访问`, () => {
    // 模拟英国用户访问命中的展业规则
    cy.setComplianceApi({
      'compliance.homepage.stepGuide.UK': false,
      'kcWeb.B5trading.test': false,
      'compliance.homepage.productSuiteKuCoinEarn.UK': false,
      'compliance.signup.leftIndia.1': false,
      'compliance.header.kurewards.1': false,
      'compliance.signin.slogan.1': false,
      'compliance.account.vipRate.1': false,
      'compliance.signup.preferredProfessionals.1': false,
      'compliance.kyc.benifitUrl.1': false,
      'compliance.header.referralAndKuRewards.1': false,
      'compliance.account.newUserBenefit.1': false,
      'compliance.homepage.newCoin.1': false,
      'compliance.account.market.1': false,
      'compliance.homepage.banner.slogan': false,
      'compliance.header.turkeyEntry.1': false,
      'compliance.homepage.faq.1': false,
      'compliance.signup.leaveDialog.1': false,
      'compliance.account.marketHotTab.1': false,
      'compliance.homepage.signupGuide.1': false,
      'compliance.homepage.securityTitle.UK': false,
      'compliance.signup.hiddenMktContent.1': false,
      'compliance.footer.isUKForbidden.1': false,
      'compliance.signup.leadingCyptocurrencyExchange.1': false,
    });
    cy.waitForSiteConfig(url);
    cy.get('[data-inspector="signup_page"]').should('exist');

    // 左侧区域存在
    cy.get('[data-inspector="signup_left_area"]').should('exist');
    // 印度用户专属的广告不存在
    cy.get('[data-inspector="signup_left_india_module"]').should('not.exist');
    // 左侧广告模块不存在
    cy.get('[data-inspector="signup_left_mtk_content"]').should('not.exist');
    cy.get('[data-inspector="signup_left_text1"]').should('not.exist');
    cy.get('[data-inspector="signup_left_text2"]').should('not.exist');
    // 储备金存在
    cy.get('[data-inspector="signup_left_reserve"]').should('exist');
  });
  it(`【IN】印度用户访问`, () => {
    // 印度用户访问
    cy.setComplianceApi({});
    cy.waitForSiteConfig(url);
    cy.get('[data-inspector="signup_page"]').should('exist');

    // 左侧区域存在
    cy.get('[data-inspector="signup_left_area"]').should('exist');
    // 印度用户专属的广告存在
    cy.get('[data-inspector="signup_left_india_module"]').should('exist');
    // 左侧广告模块存在
    cy.get('[data-inspector="signup_left_text1"]').should('exist');
    cy.get('[data-inspector="signup_left_text2"]').should('exist');
    // 储备金存在
    cy.get('[data-inspector="signup_left_reserve"]').should('exist');
  });
});
