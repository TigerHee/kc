describe('/listing web页面测试', () => {
  it('/listing', () => {
    cy.visit('/listing');

    cy.document().its('body').should('not.be.empty');

    cy.get('div[data-inspector="ListingPage"]').should('exist');
  });
});

describe('/listing h5页面测试', () => {
  it('/listing', () => {
    cy.visit('/listing');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');

    cy.get('div[data-inspector="ListingPage"]').should('exist');
  });
});
