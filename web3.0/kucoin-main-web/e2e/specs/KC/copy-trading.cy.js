
describe('copy-trading 页面测试 未登录', () => {
  it('copy-trading 页面正常工作', () => {
    cy.visit('/copy-trading');
    cy.get("[data-inspector='seo_copy_trading']").should('exist');
  });
});

describe('copy-trading 页面测试 已登录', () => {
  beforeEach(() => {
    cy.login();
  });

  it('copy-trading 页面正常工作', () => {
    cy.visit('/copy-trading');
    cy.get("[data-inspector='seo_copy_trading']").should('exist');
  });
});