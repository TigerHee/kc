describe('/cert qrcode 页面测试', () => {
  it('cert qrcode 页面在web工作', () => {
    cy.visit('/cert/qrcode/sss');
    cy.url().should('include', '/404');
  });
});
