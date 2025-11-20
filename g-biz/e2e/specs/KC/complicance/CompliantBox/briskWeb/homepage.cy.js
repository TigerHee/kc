/* eslint-disable no-undef */

// brisk-web 展业中台合规巡检基础配置
const briskWebSpmConfig = {
  'compliance.homepage.h5.topDownload': true, // 首页h5吸顶下载引导
  'compliance.homepage.rightBanner.download': true, // pc首页banner右侧下载
  'compliance.homepage.news.1': true, // 登录后首页新闻部分
  'compliance.homepage.notice.1': true, // 登录后首页通知部分
  'compliance.homepage.stepGuide.1': true, // 首页步骤引导
  'compliance.homepage.introduction.1': true, // 首页 ProductSuite卡片
  'compliance.homepage.faq.1': true, // 首页FAQ
  'compliance.homepage.startjourney.1': true, // 首页底部quick start模块
  'compliance.homepage.newCoin.1': true, // 首页 coming soon coins模块
  'compliance.homepage.topList.1': true, // 首页 三种类型的币榜单
  'compliance.homepage.flip.community': true, // 首页右侧固定的社区模块
  'compliance.homepage.flip.download': true, // 首页右侧固定的下载模块
};

const homePage = '/';

describe(`【${homePage}】未登录合规检查`, () => {
  beforeEach(() => {
    // setAllCompliance();
    cy.setComplianceApi({
      ...briskWebSpmConfig,
    });
  });

  it(`${homePage} 主站合规元素检查`, () => {
    cy.waitForSSG(homePage);

    // compliance.homepage.rightBanner.download
    cy.get('[data-inspector="homepage.rightBanner.download"]').should('not.exist');
    // compliance.homepage.stepGuide.1
    cy.get('[data-inspector="inspector_home_guide"]').should('not.exist');
    // compliance.homepage.introduction.1
    cy.get('[data-inspector="inspector_home_productsuite"]').should('not.exist');
    // compliance.homepage.faq.1
    cy.get('[data-inspector="inspector_faq"]').should('not.exist');
    // compliance.homepage.startjourney.1
    cy.get('[data-inspector="inspector_home_quick"]').should('not.exist');
    // compliance.homepage.newCoin.1
    cy.get('[data-inspector="inspector_home_coming_coins"]').should('not.exist');
    // compliance.homepage.topList.1
    cy.get('[data-inspector="inspector_home_top_coins_list"]').should('not.exist');
    // compliance.homepage.flip.community
    cy.get('[data-inspector="inspector_fixed_community"]').should('not.exist');
    // compliance.homepage.flip.download
    cy.get('[data-inspector="inspector_fixed_download_app"]').should('not.exist');
  });
});

describe(`【${homePage}】已登录合规检查`, () => {
  beforeEach(() => {
    cy.setComplianceApi({
      ...briskWebSpmConfig,
    });
    cy.login();
  });

  it(`${homePage} 主站 合规元素检查`, () => {
    cy.waitForSSG(homePage);

    // compliance.homepage.news.1  需要登录才展示
    cy.get('[data-inspector="inspector_home_news"]').should('not.exist');
    // compliance.homepage.notice.1  需要登录才展示
    cy.get('[data-inspector="inspector_home_notice"]').should('not.exist');
  });
});
