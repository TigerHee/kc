describe('/kcs 页面测试', () => {
  it('kcs 页面正常工作', () => {
    cy.visit('/kcs');

    cy.document().its('body').should('not.be.empty');

    cy.get('[data-inspector="kcs_staking"]').should('exist');
    cy.get('[data-inspector="kcs_banner"]').should('exist');
    cy.get('[data-inspector="kcs_about"]').should('exist');
    cy.get('[data-inspector="kcs_eligibility"]').should('exist');
  });
});
