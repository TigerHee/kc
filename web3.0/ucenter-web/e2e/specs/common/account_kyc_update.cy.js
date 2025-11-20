import { checkRender } from '../common/utils';
const url = '/account/kyc/update';

const PAGE_INSPECTOR_ID = '[data-inspector="account_kyc_update_page"]';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);

    // 页面 正常渲染
    checkRender(PAGE_INSPECTOR_ID);

    // 按钮默认 disabled
    cy.get(`${PAGE_INSPECTOR_ID} button`).should('be.disabled');
    // 点击同意协议
    cy.get(`${PAGE_INSPECTOR_ID} .KuxCheckbox-checkbox`).click();
    // 此时按钮可用
    cy.get(`${PAGE_INSPECTOR_ID} button`).should('not.be.disabled');
  });
});
