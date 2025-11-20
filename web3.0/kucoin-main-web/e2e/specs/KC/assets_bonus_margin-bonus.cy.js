describe('/assets/bonus/margin-bonus web页面测试', () => {
  beforeEach(() => {
    cy.login();
  });

  it('/assets/bonus/margin-bonus', () => {
    cy.visit('/assets/bonus/margin-bonus');
    cy.document().its('body').should('not.be.empty');

  });
});

describe('/assets/bonus/margin-bonus h5页面测试', () => {
  beforeEach(() => {
    cy.login();
  });

  it('/assets/bonus/margin-bonus', () => {
    cy.visit('/assets/bonus/margin-bonus');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');

  });
});
