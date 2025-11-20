describe('/cert qrcode 页面测试', () => {
  it('cert qrcode 页面在web工作', () => {
    cy.visit('/cert/qrcode/sss');
    cy.document().its('body').should('not.be.empty');
    cy.get('div[data-inspector="cert-page-qrcode"]').should('exist');
  });

  it('cert qrcode 页面在H5工作', () => {
    cy.visit('/cert/qrcode/sss');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');
    cy.get('div[data-inspector="cert-page-qrcode"]').should('exist');
  });
});
