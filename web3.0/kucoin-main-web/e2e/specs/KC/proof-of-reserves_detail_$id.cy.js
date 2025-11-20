describe('/proof-of-reserves/detail/:id  web页面测试', () => {
  it('/proof-of-reserves/detail/:id ', () => {
    cy.visit('/proof-of-reserves/detail/test');
    cy.document().its('body').should('not.be.empty');


  });
});

describe('/proof-of-reserves/detail/:id  h5页面测试', () => {

  it('/proof-of-reserves/detail/:id ', () => {
    cy.visit('/proof-of-reserves/detail/test');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');


  });
});
