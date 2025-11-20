
describe('web3-wallet 页面测试 未登录', () => {
  it('web3-wallet 页面正常工作', () => {
    cy.visit('/web3-wallet');
    cy.get("[data-inspector='seo_web3_wallet']").should('exist');
  });
});

describe('web3-wallet 页面测试 已登录', () => {
  beforeEach(() => {
    cy.login();
  });

  it('web3-wallet 页面正常工作', () => {
    cy.visit('/web3-wallet');
    cy.get("[data-inspector='seo_web3_wallet']").should('exist');
  });
});
