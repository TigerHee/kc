import { checkRender, interceptCheckValidations, interceptUpload } from './utils';

const url = '/account/security/forgetWP';
const inspectorId = 'account_security_forgetWP';

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
  });

  it('未设置交易密码', () => {
    cy.securityMethodsNone();
    cy.visit(url);
    cy.url().should('include', '/account/security');
  });

  it('已设置交易密码', () => {
    cy.securityMethodsAll();
    cy.intercept('/_api/ucenter/reset-trade-password/apply*', {
      code: '200',
      success: true,
      data: {}
    }).as('apply');

    cy.visit(url);
    checkRender(`[data-inspector="${inspectorId}"]`);

    cy.validationCodePassed();

    interceptUpload('#frontPic', () => {
      interceptUpload('#backPic', () => {
        interceptUpload('#handPic', () => {
          cy.wait(100);
          interceptCheckValidations();
          cy.get('.KuxButton-containedPrimary').click();
          return cy.wait('@apply').then(() => {
            checkRender('[data-inspector="sec_form_finish_wait"]');
          })
        });
      });
    });
  });
});
