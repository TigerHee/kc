describe('/information/currencyOffline 页面测试', () => {
  it('@level:p1 /information/currencyOffline 页面正常工作', () => {
    cy.visit('/information/currencyOffline');
    cy.url().should('include', '/404');
  });
});
