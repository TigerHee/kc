describe('/spot-nft/collection web页面测试', () => {
  beforeEach(() => {
    cy.login();
  });

  it('/spot-nft/collection', () => {
    cy.visit('/spot-nft/collection');
    cy.document().its('body').should('not.be.empty');

  });
});

describe('/spot-nft/collection h5页面测试', () => {
  beforeEach(() => {
    cy.login();
  });

  it('/spot-nft/collection', () => {
    cy.visit('/spot-nft/collection');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');

  });
});
