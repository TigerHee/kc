describe('/user-guide/spot页面测试', () => {
  it('/user-guide/spot 页面正常工作', () => {
    cy.visit('/user-guide/spot');
    cy.url().should('include', '/404');
  });
});
