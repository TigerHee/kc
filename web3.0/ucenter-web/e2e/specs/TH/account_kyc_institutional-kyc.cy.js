import { checkPageIn404 } from '../common/utils';

const url = '/account/kyc/institutional-kyc';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    checkPageIn404(url);
  });
});
