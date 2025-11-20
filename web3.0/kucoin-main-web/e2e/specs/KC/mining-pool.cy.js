
describe('mining-pool 页面测试 未登录', () => {
  it('mining-pool 页面正常工作', () => {
    cy.visit('/mining-pool');
    cy.get("[data-inspector='seo_mining_pool']").should('exist');
  });
});

describe('mining-pool 页面测试 已登录', () => {
  beforeEach(() => {
    cy.login();
  });

  it('mining-pool 页面正常工作', () => {
    cy.visit('/mining-pool');
    cy.get("[data-inspector='seo_mining_pool']").should('exist');
  });
});
