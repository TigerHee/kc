describe('/assets/bonus/loans  web页面测试', () => {
  beforeEach(() => {
    cy.login();
  });

  it('/assets/bonus/loans ', () => {
    cy.visit('/assets/bonus/loans');
    cy.document().its('body').should('not.be.empty');

  });
});

describe('/assets/bonus/loans  h5页面测试', () => {
  beforeEach(() => {
    cy.login();
  });

  it('/assets/bonus/loans ', () => {
    cy.visit('/assets/bonus/loans');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');

  });
});
