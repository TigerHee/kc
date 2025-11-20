describe('/gemspace 页面测试', () => {
  it('@level:p1 gemspace ongoing 页面正常工作', () => {
    cy.visit('/gemspace/ongoing');
    cy.url().should('include', '/404');
  });

  it('@level:p1 gemspace newlisting 页面正常工作', () => {
    cy.visit('/gemspace/newlisting');

    cy.url().should('include', '/404');
  });
});
