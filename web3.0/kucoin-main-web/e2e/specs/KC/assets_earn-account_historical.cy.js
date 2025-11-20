describe('earn-account history 页面测试', () => {
  beforeEach(() => {
    cy.login();
  });

  it('earn-account history 页面正常工作', () => {
    cy.visit('/assets/earn-account/historical');
    cy.get("[data-inspector='assets_page']").should('exist');
  });
});
