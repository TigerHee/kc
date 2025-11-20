describe('/user-guide/spot页面测试', () => {
  it('/user-guide/spot 页面正常工作 @level:p1', () => {
    cy.visit('/user-guide/spot');

    cy.document().its('body').should('not.be.empty');

    cy.get('main[data-inspector="user-guide-spot"]').should('exist');
  });
});
