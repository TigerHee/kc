/* eslint-disable no-undef */

const url = '/ucenter/signup';

describe(`【${url}】`, () => {
  it(`${url} 注册页面 +86区号限制 合规巡检`, () => {
    cy.waitForSiteConfig(url);

    // 注册区域存在
    cy.get('[data-inspector="signup-content-box"]').should('exist');

    // 输入手机号
    cy.get('[data-inspector="signin_account_input"] input')
      .clear()
      .type('138888');

    // 出现了区号选择框
    cy.get('[data-inspector="phone-selector-trigger"]')
      .should('exist')
      .click();

    // 抽屉打开了
    cy.get('[data-inspector="phone_area_selector"]').should('exist');

    // 搜索 +86 区号
    cy.get('[data-inspector="phone_area_selector_search"] input').type('+86');

    // +86 的那一行应该存在且只有一个，但不能被选中（应该有特殊的禁用样式）
    cy.get('[data-inspector="phone_area_selector_item"]')
      .should('have.length', 1)
      .and('contain.text', '+86')
      .and('have.class', 'overlayItemDisabled');

    // 验证 +86 区号不能被点击选中
    cy.get('[data-inspector="phone_area_selector_item"]').click({ force: true }); // 强制点击

    // 抽屉应该仍然打开，因为 +86 不能被选中
    cy.get('[data-inspector="phone_area_selector"]').should('exist');

    // 当前选中的区号不应该是 +86
    cy.get('[data-inspector="phone-selector-text"]').should('not.contain.text', '+86');
  });
});
