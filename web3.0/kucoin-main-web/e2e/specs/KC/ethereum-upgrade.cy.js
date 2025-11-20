describe('/ethereum-upgrade  web页面测试', () => {
  it('/ethereum-upgrade ', () => {
    cy.visit('/ethereum-upgrade');
    cy.document().its('body').should('not.be.empty');

    cy.get("[data-inspector='seo_ethereum_2_upgrade']").should('exist');

  });
});

describe('/ethereum-upgrade  h5页面测试', () => {

  it('/ethereum-upgrade ', () => {
    cy.visit('/ethereum-upgrade');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');

    cy.get("[data-inspector='seo_ethereum_2_upgrade']").should('exist');

  });
});
