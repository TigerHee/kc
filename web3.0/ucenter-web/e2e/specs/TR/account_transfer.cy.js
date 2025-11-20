/* eslint-disable no-undef */

const { checkPageIn404 } = require('../common/utils');

const url = '/account/transfer';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    checkPageIn404(url);
  });
});
