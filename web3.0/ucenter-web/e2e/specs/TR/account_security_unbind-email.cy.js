import { url, checkUnbindEmail } from '../common/account_security_unbind-email.cy';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it('解绑邮箱', () => {
    checkUnbindEmail();
  });
});
