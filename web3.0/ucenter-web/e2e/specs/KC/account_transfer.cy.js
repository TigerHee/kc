/* eslint-disable no-undef */
const { checkRender } = require('../common/utils');

// const url = '/account/transfer';
const url = '/account/transfer';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    // 页面 正常渲染
    checkRender('[data-inspector="account_transfer_container"]', 60_000);
  });
});
