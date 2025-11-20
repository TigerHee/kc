/* eslint-disable no-undef */

const url = '/pt/ucenter/signup';

// 如果当前是葡萄牙语，默认展示 +55（巴西区号）
describe(`【${url}】`, () => {
  it(`${url} 葡萄牙语语言 注册页面 合规巡检`, () => {
    cy.waitForSiteConfig(url);
    // 注册区域存在
    cy.get('[data-inspector="signup-content-box"]').should('exist');

    // 输入手机号
    cy.get('[data-inspector="signin_account_input"] input')
      .clear()
      .type('138888');

    cy.get('[data-inspector="phone-selector-text"]').should('contain.text', '+55');
  });
});
