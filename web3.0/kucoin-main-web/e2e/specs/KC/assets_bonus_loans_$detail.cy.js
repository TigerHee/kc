describe('/assets/bonus/loans/:detail  web页面测试', () => {
  it('/assets/bonus/loans/:detail ', () => {
    cy.visit('/assets/bonus/loans/test');
    cy.document().its('body').should('not.be.empty');

  });
});

describe('/assets/bonus/loans/:detail  h5页面测试', () => {

  it('/assets/bonus/loans/:detail ', () => {
    cy.visit('/assets/bonus/loans/test');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');

  });
});
