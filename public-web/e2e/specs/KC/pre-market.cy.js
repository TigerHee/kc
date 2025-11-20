describe("/pre-market 页面测试", () => {
  it("pre-market 落地页面正常工作 @level:p1", () => {
    cy.visit("/pre-market");

    cy.document().its("body").should("not.be.empty");

    cy.get('#premarketLandingPage').should('exist');

    cy.get('section[data-inspector="inspector_premarket_banner"]').should("exist");

    cy.get('section[data-inspector="inspector_premarket_landing_list"]').should("exist");

    cy.get('section[data-inspector="inspector_premarket_process"]').should("exist");

    cy.get('section[data-inspector="inspector_premarket_faq"]').should("exist");

  });
});
