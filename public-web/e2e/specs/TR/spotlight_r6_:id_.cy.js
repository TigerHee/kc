describe('/spotlight_r6 页面测试', () => {
  it('@level:p1 spotlight_r6 页面正常工作', () => {
    cy.visit('/spotlight_r6/161');
    cy.url().should('include', '/404');
  });
});
