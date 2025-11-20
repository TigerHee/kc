/// <reference types="cypress" />

describe('price 热币榜', () => {
  beforeEach(() => {
    cy.intercept(/\/universe-currency\/currency-base-info-page*/).as('searchSPLPriceAPI');
    cy.visit('/price/hot-list');
  });

  it('正常展示', () => {
    cy.get("[data-inspector='inspector_header']").should('exist');
    cy.get("[data-inspector='inspector_FAQ']").should('exist');
    cy.get("[data-inspector='inspector_other_panel']").should('exist');
  });

  it('搜索', () => {
    cy.get('[data-inspector="price-list-search"] input').focus().type('BTC');
    cy.get('[data-inspector="price-list-search"] input').trigger('keydown', {
      keyCode: 13,
      which: 13,
      key: 'Enter',
    });

    cy.wait('@searchSPLPriceAPI').then(({ response }) => {
      // 直接检查元素数量
      cy.get("[data-inspector='detail-link']").then(($elements) => {
        if ($elements.length > 0) {
          // 打印日志
          cy.log('搜索热币: BTC');
          cy.get("[data-inspector='inspector_other_panel']").should('contain', 'BTC');
          cy.get("[data-inspector='detail-link']")
            .first()
            .invoke('attr', 'href')
            .should('match', /\/price\/.*BTC.*/);
        } else {
          cy.get("[data-inspector='inspector_other_panel'] table tbody tr").should('have.length', 1);
          cy.get("[data-inspector='inspector_other_panel'] table tbody tr img[alt='empty']").should(
            'exist',
          );
        }
      });
    });
  });
});
