import {
  url,
  checkBindPhone,
  checkUpdatePhone,
} from '../common/account_security_phone.cy';

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/account/security');
  });

  it('绑定手机号', () => {
    checkBindPhone('TH');
  });
  it('修改手机号', () => {
    checkUpdatePhone('TH');
  });
});
