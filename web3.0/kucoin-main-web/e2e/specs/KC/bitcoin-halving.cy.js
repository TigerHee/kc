describe('bitcoin-halving 页面测试 未登录', () => {
  it('bitcoin-halving 页面正常工作', () => {
    cy.visit('/bitcoin-halving');
    cy.get("[data-inspector='seo_bitcoin_halving']").should('exist');
  });
});

describe('/bitcoin-halving 页面测试 已登录', () => {
  beforeEach(() => {
    cy.login();
  });

  it('bitcoin-halving 页面正常工作', () => {
    cy.visit('/bitcoin-halving');
    cy.get("[data-inspector='seo_bitcoin_halving']").should('exist');
  });
});
