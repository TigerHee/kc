import { checkRender } from './utils';

const url = '/freezing';
const inspectorId = 'freezing_page';
const unfreezeInspectorId = 'unfreeze_page';
const confirmFreezeInspectorId = 'confirm_freeze_page';

const interceptFrozen = (frozen) => cy.intercept('/_api/ucenter/is-frozen*', {
  code: '200',
  success: true,
  data: {
    email: "cy**@**.com",
    frozen,
    remainingTime: 60 * 1000
  }
});
const interceptFreezeUser = () => cy.intercept('/_api/user-biz-front/v2/freeze-user*', {
  statusCode: 200,
  body: {
    success: true,
    code: '200',
    data: null,
  },
}).as('freezeUser');

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());

  it('冻结账号', () => {
    interceptFrozen(false);
    interceptFreezeUser();
    cy.visit(`${url}?code=test`);
    checkRender(`[data-inspector="${inspectorId}"]`);
    checkRender(`[data-inspector="${confirmFreezeInspectorId}"]`);
    interceptFrozen(true);
    cy.get(`[data-inspector="${confirmFreezeInspectorId}"] input[type="checkbox"]`).click();
    cy.get(`[data-inspector="${confirmFreezeInspectorId}"] button.KuxButton-contained`).click();
    cy.wait('@freezeUser').its('response.statusCode').should('eq', 200);
    checkRender(`[data-inspector="${unfreezeInspectorId}"]`);
  });

  it('账号已冻结', () => {
    interceptFrozen(true);
    cy.visit(`${url}?code=test`);
    cy.url().should('include', url);
    checkRender(`[data-inspector="${inspectorId}"]`);
    checkRender(`[data-inspector="${unfreezeInspectorId}"]`);
  });
});
