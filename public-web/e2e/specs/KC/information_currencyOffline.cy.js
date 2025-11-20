describe('/currencyOffline 页面测试', () => {
  it('currencyOffline 页面正常工作 @level:p1', () => {
    cy.visit('/information/currencyOffline');
    cy.document().its('body').should('not.be.empty');

    cy.get('[data-inspector="information_currencyOffline_banner"]').should('exist');
    cy.get('[data-inspector="information_currencyOffline_list"]').should('exist');
  });
});
