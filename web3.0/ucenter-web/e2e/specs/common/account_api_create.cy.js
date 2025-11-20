export const url = '/account/api/create';
export const leadTradeApiUrl = `${url}?activeTab=leadTradeApi`;

const interceptIsLeadTraderAccount = (isLeadTraderAccount = false) => {
  cy.intercept('/_api/ct-copy-trade/v1/copyTrading/isLeadTraderAccount*', {
    success: true,
    code: '200',
    msg: 'success',
    data: isLeadTraderAccount,
  });
};

const interceptCreateLeadTradeInfo = () => {
  cy.intercept('/_api/cyber-truck-vault/v2/api-key/create-leadtrade-info*', {
    success: true,
    code: '200',
    msg: 'success',
    data: {
      currentIp: '10.40.96.53',
      authGroupMap: {
        API_COMMON: true,
        API_LEADTRADE_FUTURES: false,
      },
      permissionMap: {
        API_COMMON: false,
        API_LEADTRADE_FUTURES: true,
      },
      needCaptcha: false,
    },
  });
};

export const checkLeadTradeApiUrl = (isKC = true) => {
  describe(`${leadTradeApiUrl} route test`, () => {
    beforeEach(() => cy.login());
    it('不是带单母账号，切到【API 交易】tab', () => {
      interceptIsLeadTraderAccount(false);
      cy.visit(leadTradeApiUrl);
      cy.get('[data-inspector="api_create_api_tab"]')
        .should('have.attr', 'aria-selected')
        .and('include', 'true');
    });
    if (isKC) {
      it('是带单母账号，切到【API 带单】tab', () => {
        interceptIsLeadTraderAccount(true);
        interceptCreateLeadTradeInfo();
        cy.visit(leadTradeApiUrl);
        cy.get(`[data-inspector="api_create_lead_trade_tab"]`)
          .should('have.attr', 'aria-selected')
          .and('include', 'true');
      });
    } else {
      it('是带单母账号，非主站暂不支持 API 带单，切到【API 交易】tab', () => {
        interceptIsLeadTraderAccount(true);
        interceptCreateLeadTradeInfo();
        cy.visit(leadTradeApiUrl);
        cy.get(`[data-inspector="api_create_api_tab"]`)
          .should('have.attr', 'aria-selected')
          .and('include', 'true');
      });
    }
  });
};
