/* eslint-disable no-undef */

const url = '/account/kyc/tax';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} 印度pan number巡检`, () => {
    cy.visit(url);

    // 页面 正常渲染
    cy.get('[data-inspector="account_kyc_tax_page"]').should('exist');

    // 检测输入框校验和按钮是否可点击
    cy.get('[data-inspector="account_kyc_tax_page"] button').should('be.disabled');
    cy.get('#panNumber')
      .find('input[type=text]')
      .type('ABCDE1234A');
    cy.get('[data-inspector="account_kyc_tax_page"] button').should('not.be.disabled');
  });
});
