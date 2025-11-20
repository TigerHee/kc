describe("/gemvote/record 页面测试", () => {
  it("gemvote record 页面正常工作 @level:p1", () => {
    cy.visit("/gemvote/record");

    cy.document().its("body").should("not.be.empty");

    cy.get('#recordListPage').should('exist');

    cy.get('div[data-inspector="inspector_votehub_record_list"]').should("exist");

  });
});