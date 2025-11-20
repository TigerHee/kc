// import '../common/account_kyc_institutional-kyc.cy';

const url = '/account/kyc/institutional-kyc';
const replaceUrl = '/account/kyb/certification';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it('重定向到新的流程', () => {
    cy.visit(url);
    cy.url().should('include', replaceUrl);
  })
});
