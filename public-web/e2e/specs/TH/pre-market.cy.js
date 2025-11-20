describe('/pre-market 页面测试', () => {
  it('@level:p1 pre-market 落地页面正常工作', () => {
    cy.visit('/pre-market');
    cy.url().should('include', '/404');
  });
});
