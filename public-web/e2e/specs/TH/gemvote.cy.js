describe("/gemvote 页面测试", () => {
  it("gemvote 页面正常工作 @level:p1", () => {
    cy.visit("/gemvote");

    cy.document().its("body").should("not.be.empty");

    cy.get('#votehubPage').should('exist');

    cy.get('section[data-inspector="inspector_votehub_banner"]').should("exist");

    cy.get('section[data-inspector="inspector_votehub_task_list"]').should("exist");

    cy.get('section[data-inspector="inspector_votehub_faq"]').should("exist");

    cy.get('section[data-inspector="inspector_votehub_rule"]').should("exist");

  });
});
