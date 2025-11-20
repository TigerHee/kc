/* eslint-disable no-undef */
import { AccountInput } from '../../../common/entrance';

describe(`g-biz signup`, () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });
  it(`忘记密码页面`, () => {
    cy.waitForSiteConfig('/ucenter/reset-password');

    cy.get('[data-inspector="forget_pwd_container"]').should('exist');

    // 输入账号
    AccountInput();

    cy.intercept('/_api/ucenter/check-required-validations*', {
      statusCode: 200,
      body: {
        success: true,
        code: '200',
        data: [['my_sms']],
      },
    }).as('checkRequiredValidation');

    // 拦截验证码请求
    cy.intercept('/_api/ucenter/send-validation-code*', {
      'success': true,
      'code': '200',
      'retry': false,
      'data': {},
    }).as('sendValidationCode');

    // 发送验证码按钮
    cy.get('[data-inspector="forget_pwd_send_code"]').click();

    cy.wait('@checkRequiredValidation');
    cy.wait('@sendValidationCode');
  });
});
