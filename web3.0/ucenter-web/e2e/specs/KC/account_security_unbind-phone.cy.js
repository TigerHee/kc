import { url, checkUnbindPhone } from '../common/account_security_unbind-phone.cy';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it('解绑手机号', () => {
    checkUnbindPhone();
  })
});
