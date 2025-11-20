/* eslint-disable no-undef */
const { checkRender } = require('../common/utils');

// const url = '/account/transfer';
const url = '/account/guidance-zbx';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    // 页面 正常渲染
    checkRender('[data-inspector="zbx_container"]', 60_000);
  });
});
