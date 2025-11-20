describe("/gempool 页面测试", () => {
  it("gempool 页面正常工作 @level:p1", () => {
    cy.waitForSSG("/gempool");

    cy.document().its("body").should("not.be.empty");

    cy.get("#gempoolPage").should("exist");

    cy.get('div[data-inspector="inspector_gempool_banner"]').should("exist");

    cy.wait(10000);
    // 切换到进行中tab
    cy.get('[data-inspector="inspector_gempool_current_tab"]').click();
    cy.wait(2000);
    cy.get(
      'section[data-inspector="inspector_gempool_current_projects"]'
    ).should("exist");


    // 切换到历史tab
    cy.get('[data-inspector="inspector_gempool_history_tab"]').click();
    cy.wait(2000);
    cy.get(
      'section[data-inspector="inspector_gempool_history_projects"]'
    ).should("exist");

    cy.get('section[data-inspector="inspector_gempool_faq"]').should("exist");
  });
});
