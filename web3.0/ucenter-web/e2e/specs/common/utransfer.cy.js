import { checkRender } from './utils';

const url = '/utransfer';
const inspectorId = 'utransfer_page';

const mockUserStatus = (status) => {
  cy.intercept('/_api/ucenter/user-info*', (req) => {
    req.reply((res) => {
      res.body.data.status = status;
    });
  });
};

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it('老用户升级提示', () => {
    mockUserStatus(9);
    cy.visit(url);
    checkRender(`[data-inspector="${inspectorId}"]`);
  });

  it('不是老用户，跳到【/account】', () => {
    mockUserStatus(2);
    cy.visit(url);
    cy.url().should('include', '/account');
  });
});
