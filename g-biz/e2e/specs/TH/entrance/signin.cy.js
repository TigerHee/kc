/* eslint-disable no-undef */
import { AccountInput } from '../../../common/entrance';

const verifyLogin = () => {
  // 切到二维码登录
  if (Cypress.$('[data-inspector="signin_qrbox"]').length === 0) {
    cy.get('[data-inspector="signin_qrcode_icon"]').click();
  }

  // 检查二维码存在
  cy.get('[data-inspector="signin_qrbox_qrcode"]').should('exist');

  // 切换到账号登录
  cy.get('[data-inspector="signin_qrcode_icon"]').click();
  // 子账号 tab 存在
  // 子账号 tab 存在，并点击
  cy.get('[data-inspector="signin_sub_account_login_tab"]').click();
  cy.get('[data-inspector="signin_sub_input"]').should('exist');

  // 切换到主账号登录
  cy.get('[data-inspector="signin_account_login_tab"]').click();

  AccountInput();

  // 点击下一步按钮
  cy.get('[data-inspector="signin_next_btn"]').click();
  // 输入密码
  cy.get('[data-inspector="signin_password_input"] input').type('123456');
  // 登录按钮可点击
  cy.get('[data-inspector="signin_submit_button"]').should('not.be.disabled');
  // 登录失败，提示错误信息
  // cy.get('[data-inspector="error-alert"]').should('exist');
};

describe(`g-biz signin`, () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });
  it(`g-biz 登录组件验证`, () => {
    cy.waitForSiteConfig('/ucenter/signin');
    // 左侧区域存在
    cy.get('[data-inspector="layouts_slots_left"]').should('not.exist');
    verifyLogin();
    // 忘记密码存在
    cy.get('[data-inspector="signin_forget_password"]')
      .should('exist')
      .click();
    cy.url().should('include', '/ucenter/reset-password');
  });
});
