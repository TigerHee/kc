import { checkRender } from './utils';
const url = '/account/kyc/institutional-kyc';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);

    // 页面 正常渲染
    checkRender('[data-inspector="account_kyc_institutional_kyc_page"]');

    // 查找所有 input[type="text"] 元素并输入 'test'
    cy.get('[data-inspector="account_kyc_institutional_kyc_page"] input[type="text"]').each(
      ($input) => {
        cy.wrap($input).type('test');
      },
    );

    // 查找所有的 .KuxSelect-wrapper 并依次点击
    cy.get('[data-inspector="account_kyc_institutional_kyc_page"] .KuxSelect-wrapper').each(
      ($selectWrapper) => {
        // 点击 .KuxSelect-wrapper 打开下拉框
        cy.wrap($selectWrapper).click();

        // 选择并点击下拉框中的第一个 .KuxSelect-optionItem
        cy.get('.KuxSelect-optionItem').first().click();
      },
    );

    // 下一步按钮可以被点击
    cy.get('[data-inspector="account_kyc_institutional_kyc_page"] .KuxButton-root')
      .should('be.visible')
      .click();
  });
});
