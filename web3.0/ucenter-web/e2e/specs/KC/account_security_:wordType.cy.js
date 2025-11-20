import { checkRender, createCheckElementEnable } from '../common/utils';

const url = '/account/security/safeWord';
const inspectorId = 'account_security_safeword';
const checkInputEnable = createCheckElementEnable('input', true);
const checkButtonEnable = createCheckElementEnable('button', false);

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);

    checkRender(`[data-inspector="${inspectorId}"]`);

    checkInputEnable(inspectorId);
    checkButtonEnable(inspectorId);
  });
});
