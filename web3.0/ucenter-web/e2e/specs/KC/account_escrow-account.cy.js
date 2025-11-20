/* eslint-disable no-undef */
const { checkRender } = require('../common/utils');

const url = '/account/escrow-account';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    // 页面 正常渲染
    checkRender('[data-inspector="escrow_account"]', 60_000);
  });
});
