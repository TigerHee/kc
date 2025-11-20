describe('/cert 页面测试', () => {
  it('cert 页面在web工作', () => {
    cy.visit('/cert');
    cy.document().its('body').should('not.be.empty');
    cy.get('div[data-inspector="cert-page"]').should('exist');
  });

  it('cert 页面在H5工作', () => {
    cy.visit('/cert');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');
    cy.get('div[data-inspector="cert-page"]').should('exist');
  });
});
