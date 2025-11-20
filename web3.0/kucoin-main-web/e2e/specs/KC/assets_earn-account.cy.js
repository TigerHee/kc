describe('earn-account 页面测试', () => {
  beforeEach(() => {
    cy.login();
  });

  it('earn-account 页面正常工作', () => {
    cy.visit('/assets/earn-account');
    cy.get("[data-inspector='assets_page']").should('exist');
  });
})
