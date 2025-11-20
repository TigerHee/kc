import { checkRender } from '../common/utils';
const url = '/account/kyc/tax';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);

    // 页面 正常渲染
    checkRender('[data-inspector="account_kyc_tax_page"]');

    // 检测输入框校验和按钮是否可点击
    cy.get('[data-inspector="account_kyc_tax_page"] button').should('be.disabled');
    cy.get('#panNumber').find('input[type=text]').type('ABCDE1234A');
    cy.get('[data-inspector="account_kyc_tax_page"] button').should('not.be.disabled');
  });
});
