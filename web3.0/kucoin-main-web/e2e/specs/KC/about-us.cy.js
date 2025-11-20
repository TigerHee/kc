describe('about-us 页面测试', () => {
    beforeEach(() => {
      cy.login();
    });
  
    it('about-us 页面正常工作', () => {
        cy.visit('/about-us');
        cy.get("[data-inspector='about_us_banner']").should('exist');
        cy.get("[data-inspector='about_us_story']").should('exist');
        cy.get("[data-inspector='about_us_num']").should('exist');
        cy.get("[data-inspector='about_us_info']").should('exist');
        cy.get("[data-inspector='about_us_road_map']").should('exist');
        cy.get("[data-inspector='about_us_rules']").should('exist');
    });
  })
  