/* eslint-disable no-undef */
import { AccountInput, getExist } from '../../../common/entrance';

describe(`g-biz signup`, () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });
  it(`signup 登录组件验证`, () => {
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
        // 同意协议
        cy.get('[data-inspector="signup-agree-wrapper"]').should('exist');
        // 点击同意协议里面所有的 2 个 input
        cy.get('[data-inspector="signup-agree-wrapper"] input')
          .should('have.length', 2)
          .click({ multiple: true });

        // 拦截验证码请求
        cy.intercept('/_api/ucenter/register-short-message*', {
          'success': true,
          'code': '200',
          'msg': 'Verification code sent.',
          'retry': false,
          'data': {},
        });

        // 点击注册按钮
        cy.get('[data-inspector="signup_confirm_btn"]').click();

        // 输入验证码页面可见
        cy.get('[data-inspector="account_verify_wrapper"]').should('exist');
      },
    });
  });
});
