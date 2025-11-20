const url = '/ucenter/signin';
describe(`【${url}】`, () => {
  it(`@level:p0 ${url} route test`, () => {
    // 正常国家用户访问
    cy.countryJP();
    cy.waitForSiteConfig(url);
    cy.get('[data-inspector="signin_page"]').should('exist');

    // 左侧的 slogan 文案存在
    cy.get('[data-inspector="signin_slogan"]').should('exist');
    // passkey 按钮存在
    cy.get('#login_passkey_btn').should('exist');

    // 巡检无法判断 三方登陆按钮
    // telegrame 三方登陆按钮存在
    // cy.get('#login_telegram_btn').should('exist');
    // // google 三方登陆按钮存在
    // cy.get('#login_google_btn').should('exist');
    // // apple 三方登陆按钮存在
    // cy.get('#login_apple_btn').should('exist');

    // 点击快速註冊
    cy.get('[data-inspector="signin_signup_btn"] a').should('exist').click();
    // 跳转到注册页面
    cy.url().should('include', '/signup');
  });

  it(`@level:p0 手机号登陆`, () => {
    cy.waitForSiteConfig(url, {
      callback: (siteConfig) => {
        // 确保切换到账号密码登陆
        cy.get('[data-inspector="signin_account_login_tab"]').click();
        // 账号输入框存在
        cy.get('[data-inspector="signin_account_input"]').should('exist');

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

        // 点击下一步按钮
        cy.get('[data-inspector="signin_next_btn"]').click();
        // 输入密码
        cy.get('[data-inspector="signin_password_input"] input').type('123456');

        // 拦截一步登陆接口，下发验证方式
        cy.intercept('/_api/ucenter/v2/aggregate-login*', {
          success: true,
          code: '200',
          msg: 'success',
          retry: false,
          data: {
            loginToken: '03849731-2e24-4ce9-804d-eb8354d75a1d',
            needValidations: [['my_sms']],
            loginSafeWord: null,
            finishUpgrade: true,
            jwtToken: null,
            type: 1,
            countryCode: '91',
            riskTag: null,
            verifyCheckToken: null,
            verifyToken: null,
            email: null,
            phone: '**1001',
            riskStrategy: null,
            validationSwitch: null,
            siteType: 'global',
          },
        }).as('aggregateLogin');
        // 拦截发送验证码请求
        cy.intercept('/_api/ucenter/send-validation-code*', {
          success: true,
          code: '200',
          msg: 'Verification code sent.',
          retry: false,
          data: {},
        }).as('sendValidationCode');

        // 登录按钮可点击
        cy.get('[data-inspector="signin_submit_button"]').should('not.be.disabled');
        // 点击登陆接口
        cy.get('[data-inspector="signin_submit_button"]').click();

        // 等待一步登陆接口发送请求完成
        cy.wait('@aggregateLogin');
        // 同时会发送验证码
        cy.wait('@sendValidationCode');

        // 到达输入验证码页面
        // 验证码页面存在
        cy.get('[data-inspector="signin_verify_container"]').should('exist');
        // 短信验证码输入框存在
        cy.get('[data-inspector="entrance_sms_verify_input"] input').should('exist');
        // 发送短信验证码按钮存在
        cy.get('[data-inspector="entrance_sms_send_button"]').should('exist');

        // 输入6位验证码
        cy.get('[data-inspector="entrance_sms_verify_input"] input').type('123456');
        // 提交按钮可点击
        cy.get('[data-inspector="entrance_verify_button"]').should('not.be.disabled');

        // 拦截二步登陆
        cy.intercept('/_api/ucenter/v2/login-validation*', {
          success: true,
          code: '200',
          msg: 'Verification code sent.',
          retry: false,
          data: {
            code: '200',
            data: {
              isPhoneValidate: true,
              honorLevel: 0,
              language: 'en_US',
              type: 1,
              emailValidate: false,
              uid: 2400010000081268,
              createdAt: 1749548330000,
              isEmailValidate: false,
              countryCode: '91',
              referralCode: '6SV7UAF',
              currency: 'USD',
              subLevel: 1,
              tenant: '',
              tradeType: 1,
              isNeedDepositValidate: false,
              siteType: 'global',
              lastLoginCountry: 'GB',
              timeZone: 'singapore',
              oesBound: -1,
              domainId: 'kucoin',
              lastLoginAt: 1749629277000,
              phone: '91-2025061001',
              needDepositValidate: false,
              subType: 0,
              device: 'Chrome 135',
              phoneValidate: true,
              webDeviceLimit: 1,
              status: 2,
            },
            msg: 'success',
            retry: false,
            success: true,
          },
        }).as('loginValidation');
        const userTermConfig = siteConfig?.termConfig?.userTermConfig || [];
        // 待签协议
        cy.intercept('/_api/ucenter/user/query-waited-sign-term*', {
          success: true,
          code: '200',
          msg: 'success',
          retry: false,
          // 文本协议
          data: userTermConfig.map((item) => ({
            agreementForm: 'link',
            termId: item.termId,
            title: item.termCode,
          })),
        }).as('queryWaitedSignTerm');
        cy.intercept('/_api/ucenter/user-info*', {
          success: true,
          code: '200',
          msg: 'success',
          retry: false,
          data: {
            csrf: 'abcdfedfdsfdfsf',
          },
        }).as('getUserInfoWhenQueryWaitedSignTerm');
        // 点击提交
        cy.get('[data-inspector="entrance_verify_button"]').click();
        cy.wait('@loginValidation');
        cy.wait('@queryWaitedSignTerm').then(({ response }) => {
          if (response?.body?.code !== '404') {
            cy.wait('@getUserInfoWhenQueryWaitedSignTerm');
            cy.get('[data-inspector="link_term_update_dialog_content"]').should('exist');
          }
        });
      },
    });
  });

  it(`@level:p0 邮箱登陆`, () => {
    cy.waitForSiteConfig(url);

    // 确保切换到账号密码登陆
    cy.get('[data-inspector="signin_account_login_tab"]').click();
    // 账号输入框存在
    cy.get('[data-inspector="signin_account_input"]').should('exist');

    // 输入邮箱
    cy.get('[data-inspector="signin_account_input"] input').type('138888@gmail.com');
    // 区号选择框不可见
    cy.get('[data-inspector="phone-selector-trigger"]').should('not.visible');

    // 点击下一步按钮
    cy.get('[data-inspector="signin_next_btn"]').click();
    // 输入密码
    cy.get('[data-inspector="signin_password_input"] input').type('123456');

    // 拦截一步登陆接口，下发验证方式
    cy.intercept('/_api/ucenter/v2/aggregate-login*', {
      success: true,
      code: '200',
      msg: 'success',
      retry: false,
      data: {
        loginToken: '9102b0a0-fb02-4e5c-9669-54e793b75677',
        needValidations: [['my_email']],
        loginSafeWord: null,
        finishUpgrade: true,
        jwtToken: null,
        type: 1,
        countryCode: null,
        riskTag: null,
        verifyCheckToken: null,
        verifyToken: null,
        email: '13**@**.com',
        phone: null,
        riskStrategy: null,
        validationSwitch: null,
        siteType: 'global',
      },
    }).as('aggregateLogin');
    // 拦截发送验证码请求
    cy.intercept('/_api/ucenter/send-validation-code*', {
      success: true,
      code: '200',
      msg: 'Verification code sent.',
      retry: false,
      data: {},
    }).as('sendValidationCode');

    // 登录按钮可点击
    cy.get('[data-inspector="signin_submit_button"]').should('not.be.disabled');
    // 点击登陆接口
    cy.get('[data-inspector="signin_submit_button"]').click();

    // 等待一步验证接口发送成功
    cy.wait('@aggregateLogin');
    // 同时会发送验证码
    cy.wait('@sendValidationCode');

    // 到达输入验证码页面
    // 验证码页面存在
    cy.get('[data-inspector="signin_verify_container"]').should('exist');
    // 短信验证码输入框存在
    cy.get('[data-inspector="entrance_email_verify_input"] input').should('exist');
    // 发送短信验证码按钮存在
    cy.get('[data-inspector="entrance_email_send_button"]').should('exist');

    // 点击发送验证码接口
    cy.get('[data-inspector="entrance_email_send_button"]').click();

    // 输入6位验证码
    cy.get('[data-inspector="entrance_email_verify_input"] input').type('123456');
    // 提交按钮可点击
    cy.get('[data-inspector="entrance_verify_button"]').should('not.be.disabled');

    // 拦截二步登陆
    cy.intercept('/_api/ucenter/v2/login-validation*', {
      code: '200',
      data: {
        isPhoneValidate: true,
        honorLevel: 0,
        language: 'en_US',
        type: 1,
        emailValidate: true,
        uid: 2400010000081268,
        createdAt: 1749548330000,
        isEmailValidate: true,
        countryCode: null,
        referralCode: '6SV7UAF',
        currency: 'USD',
        subLevel: 1,
        tenant: '',
        email: '138888@gmail.com',
        tradeType: 1,
        isNeedDepositValidate: false,
        siteType: 'global',
        lastLoginCountry: 'GB',
        timeZone: 'singapore',
        oesBound: -1,
        domainId: 'kucoin',
        lastLoginAt: 1749634972000,
        phone: null,
        needDepositValidate: false,
        subType: 0,
        device: 'Chrome 135',
        phoneValidate: true,
        webDeviceLimit: 1,
        status: 2,
      },
      msg: 'success',
      retry: false,
      success: true,
    }).as('loginValidation');
    // 点击提交
    cy.get('[data-inspector="entrance_verify_button"]').click();
    cy.wait('@loginValidation');
  });

  it(`@level:p0 子账号登陆`, () => {
    cy.waitForSiteConfig(url);

    // 确保切换到子账号登陆
    cy.get('[data-inspector="signin_sub_account_login_tab"]').click();
    // 子账号账号输入框存在
    cy.get('[data-inspector="signin_sub_input"]').should('exist');

    // 输入邮箱
    cy.get('[data-inspector="signin_sub_input"] input').type('2025061001sub01');

    // 点击下一步按钮
    cy.get('[data-inspector="signin_next_btn"]').click();
    // 输入密码
    cy.get('[data-inspector="signin_password_input"] input').type('123456');

    // 拦截一步登陆接口，下发验证方式
    cy.intercept('/_api/ucenter/v2/aggregate-login*', {
      success: true,
      code: '200',
      msg: 'success',
      retry: false,
      data: {
        loginToken: 'e6ee8a8d-60ef-4c42-a357-051dbc963573',
        needValidations: [],
        loginSafeWord: null,
        finishUpgrade: true,
        jwtToken: null,
        type: 3,
        countryCode: null,
        riskTag: null,
        verifyCheckToken: null,
        verifyToken: null,
        email: null,
        phone: null,
        riskStrategy: null,
        validationSwitch: null,
        siteType: 'global',
      },
    }).as('aggregateLogin');

    // 直接登陆成功
    // 登录按钮可点击
    cy.get('[data-inspector="signin_submit_button"]').should('not.be.disabled');
    // 点击登陆接口
    cy.get('[data-inspector="signin_submit_button"]').click();

    // 等待一步登陆接口发送请求完成
    cy.wait('@aggregateLogin');
  });

  it(`@level:p0 二维码登陆`, () => {
    cy.waitForSiteConfig(url);

    // 切到二维码登录
    if (Cypress.$('[data-inspector="signin_qrbox"]').length === 0) {
      cy.get('[data-inspector="signin_qrcode_icon"]').click();
    }
    cy.get('[data-inspector="signin_qrbox_qrcode"]').should('exist');
  });

  it(`@level:p0 邮箱风控验证`, () => {
    cy.waitForSiteConfig(url);

    // 确保切换到账号密码登陆
    cy.get('[data-inspector="signin_account_login_tab"]').click();
    // 账号输入框存在
    cy.get('[data-inspector="signin_account_input"]').should('exist');

    // 输入邮箱
    cy.get('[data-inspector="signin_account_input"] input').type('138888@gmail.com');

    // 点击下一步按钮
    cy.get('[data-inspector="signin_next_btn"]').click();
    // 输入密码
    cy.get('[data-inspector="signin_password_input"] input').type('123456');

    // 拦截一步登陆接口，下发验证方式
    cy.intercept('/_api/ucenter/v2/aggregate-login*', {
      success: true,
      code: '200',
      msg: 'success',
      retry: false,
      data: {
        loginToken: '9102b0a0-fb02-4e5c-9669-54e793b75677',
        needValidations: [['my_email']],
        loginSafeWord: null,
        finishUpgrade: true,
        jwtToken: null,
        type: 1,
        countryCode: null,
        riskTag: 'LOGIN_RISK_EMAIL_VERIFY',
        verifyCheckToken: null,
        verifyToken: null,
        email: '13**@**.com',
        phone: null,
        riskStrategy: null,
        validationSwitch: null,
        siteType: 'global',
      },
    }).as('aggregateLogin');

    // 登录按钮可点击
    cy.get('[data-inspector="signin_submit_button"]').should('not.be.disabled');
    // 点击登陆接口
    cy.get('[data-inspector="signin_submit_button"]').click();

    // 等待一步登陆接口发送请求完成
    cy.wait('@aggregateLogin');

    // 邮箱风控页面存在
    cy.get('[data-inspector="signin_mail_authorize"]').should('exist');
    // 重发邮箱验证码内容存在
    cy.get('[data-inspector="signin_mail_authorize-resent"]').should('exist');
  });

  it(`【GB】${url} route test`, () => {
    cy.countryGB();
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
    cy.get('[data-inspector="signin_page"]').should('exist');

    // 左侧的 slogan 文案不存在
    cy.get('[data-inspector="signin_slogan"]').should('not.exist');
  });
});
