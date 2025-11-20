export const getExist = (support) => (support ? 'exist' : 'not.exist');

export function AccountInput() {
  // 输入邮箱
  cy.get('[data-inspector="signin_account_input"] input').type('138888@');
  // 区号选择框不可见
  cy.get('[data-inspector="phone-selector-trigger"]').should('not.visible');

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
  // 区号搜索，并且点击一个区号
  cy.get('[data-inspector="phone_area_selector_search"] input').type('1242');
  // phone_area_selector_item 只存在一个，并且 innerText 包含 1242
  cy.get('[data-inspector="phone_area_selector_item"]')
    .should('have.length', 1)
    .should('contain.text', '1242')
    .click();
  // 抽屉被关闭了
  cy.get('[data-inspector="phone_area_selector"]').should('not.exist');
  // 区号被选中
  cy.get('[data-inspector="phone-selector-text"]').should('contain.text', '+1242');
}

function ReadAgreement() {
  // 协议内容存在
  cy.get('[data-inspector="signup-agreement-box"]').should('exist');
  // 滚动到底部
  cy.get('[data-inspector="signup-agreement-box"]').scrollTo('bottom');
  cy.wait(2000);
  // 点击同意协议
  cy.get('[data-inspector="signup-agreement-wrapper"] input').click();
  // 点击下一页按钮
  cy.get('[data-inspector="signup_agreement_btn"]').click();
}

// 土耳其站阅读注册协议
export function TRReadAgreement() {
  // 连续阅读 3 份协议
  ReadAgreement();
  ReadAgreement();
  ReadAgreement();
}

export function TRAccountInput() {
  // 输入邮箱
  cy.get('[data-inspector="signin_account_input"] input').type('138888@');
  // 区号选择框不可见
  cy.get('[data-inspector="phone-selector-trigger"]').should('not.visible');

  // 输入手机号
  cy.get('[data-inspector="signin_account_input"] input')
    .clear()
    .type('138888');
  // 出现了区号选择框，并且存在 disable 属性
  cy.get('[data-inspector="phone-selector-trigger"]')
    .should('exist')
    .should('have.attr', 'disabled');
  // 抽屉不能打开
  cy.get('[data-inspector="phone_area_selector"]').should('not.exist');
  // 土耳其固定区号
  cy.get('[data-inspector="phone-selector-text"]').should('contain.text', '+90');
}
