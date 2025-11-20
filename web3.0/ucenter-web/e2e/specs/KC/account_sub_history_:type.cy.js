import { checkRender } from '../common/utils';

const url = '/account/sub/history/transfer';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    checkRender('[data-inspector="account_sub_history_page"]');
  });
});
