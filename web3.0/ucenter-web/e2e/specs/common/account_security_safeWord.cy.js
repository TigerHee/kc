import { getFormDataValue, getSiteConfig, interceptRiskValidation } from "./utils";

const url = '/account/security/safeWord';
const replaceUrl = '/account/security';

const checkReplaceUrl = () => {
  cy.url().should(curUrl => {
    const path = new URL(curUrl).pathname;
    expect(path.endsWith(replaceUrl)).to.be.true;
  });
}

const checkUpdateSafeWord = () => {
  cy.intercept('/_api/ucenter/v2/user/safe-words*', {
    code: '200',
    success: true,
    data: {}
  }).as('update');

  getSiteConfig(url, (siteConfig) => {
    if (!siteConfig.securityConfig.antiPhishingCodeOpt) {
      return checkReplaceUrl();
    }
    cy.get('.KuxButton-containedPrimary').should('be.disabled');
    const loginSafeWord = '11111111';
    const mailSafeWord = '22222222';
    const withdrawalSafeWord = '33333333';
    cy.get('#loginSafeWord input').type(loginSafeWord);
    cy.get('#mailSafeWord input').type(mailSafeWord);
    cy.get('#withdrawalSafeWord input').type(withdrawalSafeWord);
    const { checkToken } = interceptRiskValidation();
    cy.get('.KuxButton-containedPrimary').click();
    cy.wait('@update').then(({ request }) => {
      checkToken(request.headers);
      expect(getFormDataValue(request.body, 'loginSafeWord')).to.equal(loginSafeWord);
      expect(getFormDataValue(request.body, 'mailSafeWord')).to.equal(mailSafeWord);
      expect(getFormDataValue(request.body, 'withdrawalSafeWord')).to.equal(withdrawalSafeWord);
    })
  });
}

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());

  it('修改安全语', () => {
    checkUpdateSafeWord();
  });
});
