import { url, checkNormalAPI, checkBrokerAPI, checkLeadTradeAPI } from '../common/account_api';

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
  });

  checkNormalAPI();

  checkBrokerAPI();

  checkLeadTradeAPI('TR');
});