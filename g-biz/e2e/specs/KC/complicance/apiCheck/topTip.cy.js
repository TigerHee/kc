/* eslint-disable no-undef */

describe('顶飘API Request Test', () => {
  it('检测是否请求了顶飘限制的API', () => {
    const url = '/';

    cy.intercept(
      '/_api/user-dismiss/ip-dismiss/notice?bizType=IP_TOP_MESSAGE,FORCE_KYC_MESSAGE,CLEARANCE_MESSAGE&scene=homepage&lang=en_US',
    ).as('dismissNoticeRequest');

    cy.waitForSSG(url);

    cy.wait('@dismissNoticeRequest', { timeout: 20000 })
      .its('response.statusCode')
      .should('eq', 200);
  });

  it('检测是否请求了弹窗限制的API', () => {
    const url = '/';

    cy.intercept(
      '/_api/user-dismiss/ip-dismiss/notice?bizType=IP_DIALOG&scene=homepage&lang=en_US',
    ).as('dismissNoticeDialogRequest');

    cy.waitForSSG(url);

    cy.wait('@dismissNoticeDialogRequest', { timeout: 20000 })
      .its('response.statusCode')
      .should('eq', 200);
  });
});
