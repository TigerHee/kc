describe('/pre-market/:coin 页面测试', () => {
  it('@level:p1 pre-market 详情页面 页面正常工作', () => {
    cy.visit('/pre-market/ME');
    cy.url().should('include', '/404');
  });
});
