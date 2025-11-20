describe("/gemvote/voting 页面测试", () => {
  it("gemvote voting 页面正常工作 @level:p1", () => {
    cy.visit("/gemvote/voting");

    cy.document().its("body").should("not.be.empty");

    cy.get('#voteVotingListPage').should('exist');

    cy.get('div[data-inspector="inspector_votehub_voting_list"]').should("exist");

  });
});