describe('/pre-market/myOrder 页面测试', () => {
  it('@level:p1 pre-market/myOrder 页面正常工作', () => {
    cy.waitForSSG('/pre-market/myOrder');
    cy.url().should('include', '/404');
  });
});
