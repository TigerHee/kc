describe('保证金 页面测试', () => {
  beforeEach(() => {
    cy.login();
  });

  it('保证金 页面正常工作', () => {
    cy.visit('/proof-of-reserves');
    cy.get("[data-inspector='proof_of_reserves_page']").should('exist');
  });
});
