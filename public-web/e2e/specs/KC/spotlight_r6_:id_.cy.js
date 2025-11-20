describe('/spotlight_r6 页面测试', () => {
  it('spotlight_r6 页面正常工作 @level:p1', () => {
    cy.visit('/spotlight_r6/161');

    cy.document().its('body').should('not.be.empty');

    cy.get('#spotlight6-wrapper').should('exist');
    cy.get('div[data-inspector="inspector_spotlight6"]').should('exist');
  });
});
