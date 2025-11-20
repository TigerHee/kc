describe('/user-guide/margin页面测试', () => {
  it('/user-guide/margin 页面正常工作', () => {
    cy.visit('/user-guide/margin');
    cy.url().should('include', '/404');
  });
});
