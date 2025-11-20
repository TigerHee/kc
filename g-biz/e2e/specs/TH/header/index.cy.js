/* eslint-disable no-undef */
import {
  CheckHeaderSearchBox,
  InterceptHeaderSearchApi,
  restrictNoticeApi,
  CheckHeaderSearchInput,
  getNavigation,
} from '../../../common/header';

const url = '/';

describe(`【${url}】`, () => {
  beforeEach(() => {
    // 日本用户访问
    cy.countryJP();
    cy.complianceFree();
    getNavigation();
    restrictNoticeApi();
  });

  it(`${url} 泰国站 header元素检查`, () => {
    cy.waitForSSG(url);
    cy.wait('@restrictNotice');

    // 检查泰国站login
    cy.get('[data-inspector="header_login"]').each(($el) => {
      cy.wrap($el)
        .invoke('attr', 'href')
        .then((href) => {
          expect(href).include('/ucenter/signin');
        });
    });

    // 检查泰国站signup
    cy.get('[data-inspector="header_signup"]').each(($el) => {
      cy.wrap($el)
        .invoke('attr', 'href')
        .then((href) => {
          expect(href).include('/ucenter/signup');
        });
    });
    // 检查泰国站download
    cy.get('[data-inspector="inspector_header_download_box"]').should('exist');
    // inspector_header_theme
    cy.get('[data-inspector="inspector_header_theme"]').should('exist');

    CheckHeaderSearchBox();
  });

  it(`${url} 泰国站 header搜索检查`, () => {
    InterceptHeaderSearchApi();
    cy.waitForSSG(url);
    cy.wait('@restrictNotice');
    CheckHeaderSearchInput();
  });
});
