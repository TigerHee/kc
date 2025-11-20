describe("/pre-market:coin 页面测试", () => {
  it("pre-market detail 页面正常工作 @level:p1", () => {
    cy.visit("/pre-market/ME");

    cy.document().its("body").should("not.be.empty");

    cy.get('#premarketCoinPage').should('exist');

    cy.get('section[data-inspector="inspector_premarket_banner"]').should("exist");

    cy.get('section[data-inspector="inspector_premarket_main"]').should("exist");

  });
});
