describe('/proof-of-reserves/faq web页面测试', () => {
  it('/proof-of-reserves/faq', () => {
    cy.visit('/proof-of-reserves/faq');

    cy.document().its('body').should('not.be.empty');

    cy.get('div[data-inspector="proof_of_reserves_faq_page"]').should('exist');
  });
});

describe('/proof-of-reserves/faq h5页面测试', () => {
  it('/proof-of-reserves/faq', () => {
    cy.visit('/proof-of-reserves/faq');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');

    cy.get('div[data-inspector="proof_of_reserves_faq_page"]').should('exist');
  });
});
