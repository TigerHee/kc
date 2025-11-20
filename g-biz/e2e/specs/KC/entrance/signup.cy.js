/* eslint-disable no-undef */
import { AccountInput, getExist } from '../../../common/entrance';

describe(`g-biz signup`, () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });
  it(`signup 注册组件验证`, () => {
    cy.waitForSiteConfig(`/ucenter/signup?rcode=DEBLEX`, {
      callback: (siteConfig) => {
        // 注册区域存在
        cy.get('[data-inspector="signup-content-box"]').should('exist');

        // 输入账号
        AccountInput();

        cy.get('[data-inspector="signup_rcode_input"] input').should(
          getExist(siteConfig?.accountConfig.supportRCode),
        );
        if (siteConfig?.accountConfig.supportRCode) {
          cy.get('[data-inspector="signup_rcode_input"] input').should('have.value', 'DEBLEX');
        }
        // 拦截验证码请求
        cy.intercept('/_api/ucenter/register-short-message*', {
          'success': true,
          'code': '200',
          'msg': 'Verification code sent.',
          'retry': false,
          'data': {},
        });
        // 拦截验证接口
        cy.intercept('/_api/ucenter/sign-up-validation*', {
          'success': true,
          'code': '200',
          'msg': 'success',
          'retry': false,
          'data': {},
        });

        // 点击注册按钮
        cy.get('[data-inspector="signup_confirm_btn"]').click();

        // 输入验证码页面可见
        cy.get('[data-inspector="account_verify_wrapper"]').should('exist');

        // 输入验证码
        cy.get('[data-inspector="account_verify_wrapper"] input').type('123456');
        // 点击校验验证码
        cy.get('[data-inspector="set_password_btn"]').click();

        // 到达输入密码页面
        // 输入小于10位不符合规则的密码
        cy.get('[data-inspector="password_input_with_eye"] input').type('Ab1234567');
        // 密码强度不展示
        cy.get('[data-inspector="password_strength"]').should('not.exist');
        // 输入符合规则的密码
        cy.get('[data-inspector="password_input_with_eye"] input')
          .clear()
          .type('Ab12345678');

        // 密码强度展示 密码强度低
        cy.get('[data-inspector="password_strength"]').should('exist');
        // 密码强度提示展示
        cy.get('[data-inspector="password_strength"] .password-strength-desc').should('exist');

        // 输入密码强度高的密码
        cy.get('[data-inspector="password_input_with_eye"] input')
          .clear()
          .type('Ab0123456789.');
        // 密码强度展示
        cy.get('[data-inspector="password_strength"]').should('exist');
        // 密码强度提示不展示
        cy.get('[data-inspector="password_strength"] .password-strength-desc').should(
          'not.visible',
        );
      },
    });
  });
});
