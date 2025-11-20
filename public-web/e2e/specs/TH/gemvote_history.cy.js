describe("/gemvote/history 页面测试", () => {
  it("gemvote history 页面正常工作 @level:p1", () => {
    cy.visit("/gemvote/history");

    cy.document().its("body").should("not.be.empty");

    cy.get('#voteHistoryListPage').should('exist');

    cy.get('div[data-inspector="inspector_votehub_history_list"]').should("exist");

  });
});
