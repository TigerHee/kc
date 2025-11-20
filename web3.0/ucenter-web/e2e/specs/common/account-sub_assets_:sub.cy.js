import { checkRender } from './utils';

const subId = 'xxxxx'; // 随便搞个id，捞不到数据，页面依然能展示
const url = `/account-sub/assets/${subId}`;
const inspectorId = 'account_sub_assets_page';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    checkRender(`[data-inspector="${inspectorId}"]`);
  });
});
