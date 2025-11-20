describe('/kcs 页面测试', () => {
  it('kcs 返回 404', () => {
    cy.visit('/kcs');
    cy.url().should('include', '/404');
  });
});
