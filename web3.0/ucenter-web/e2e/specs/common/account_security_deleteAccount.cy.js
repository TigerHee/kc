import { checkRender } from './utils';

const url = '/account/security/deleteAccount';

const interceptCancellation = () => {
  cy.intercept('/_api/user-biz-front/v2/user-overview/cancellation*', {
    code: '200',
    success: true,
    data: {
      "canCancellation": false,
      "canGiveUp": true,
      "tradeForbidden": false,
      "withdrawForbidden": false,
      "subFreezeNum": 0,
      "principalAmount": 0.00,
      "totalAmount": 0.00,
      "totalDebt": 0.00,
      "debtList": [],
      "balanceCurrency": "USDT",
      "unReceiveEncouragement": 0.00,
      "nftNum": 0.00,
      "activeBizList": [],
      "subNum": 0
    }
  }).as('cancellation')
}

const interceptDelete = () => {
  cy.intercept('/_api/user-biz-front/user/cancellation/v2*', {
    code: '200',
    success: true,
    data: {}
  }).as('delete')
}

const interceptGiveUp = () => {
  cy.intercept('/_api/user-biz-front/user/assets/give-up*', {
    code: '200',
    success: true,
    data: {}
  })
}

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it('注销账号', () => {
    interceptCancellation();
    interceptGiveUp();
    interceptDelete()

    cy.visit(url);
    cy.get('[data-inspector="deleteAccount_next"]').should('be.disabled');
    cy.get('[data-inspector="deleteAccount_agree"]').click();
    cy.wait(100);
    cy.get('[data-inspector="deleteAccount_next"]').click();
    cy.wait('@cancellation').then(() => {
      cy.get('[data-inspector="deleteAccount_next"]').should('be.disabled');
      cy.get('[data-inspector="deleteAccount_agree2"]').click();
      cy.wait(100);
      cy.get('[data-inspector="deleteAccount_next"]').click();
    }).then(() => {
      cy.get('[data-inspector="deleteAccount_next"]').click();
      cy.validationCodePassed();
      return cy.wait('@delete');
    }).then(() => {
      checkRender('[data-inspector="deleteAccount_success"]');
      cy.wait(6000);
      checkRender('[data-inspector="inspector_home_banner"]');
    })
  });
});
