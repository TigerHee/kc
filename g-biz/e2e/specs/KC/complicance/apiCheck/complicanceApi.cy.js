/* eslint-disable no-undef */

describe('合规接口观测', () => {
  it('检测是否请求了展业中台的API', () => {
    const url = '/';

    cy.intercept('/_api/compliance-biz/web/compliance/rule*').as('complianceBoxApi');

    cy.waitForSSG(url);

    cy.wait('@complianceBoxApi', { timeout: 20000 }).then((interception) => {
      // 验证状态码
      expect(interception.response.statusCode).to.eq(200);

      // 验证响应体结构
      expect(interception.response.body).to.have.property('success');
      expect(interception.response.body).to.have.property('data');

      // 验证业务数据
      const { data } = interception.response.body;
      expect(data).to.have.property('config');
      const { config } = data;
      expect(config).to.have.property('forbidden_pages');
    });
  });

  it('检测是否请求了获取当前用户国家IP API', () => {
    const url = '/';

    cy.intercept('/_api/universal-core/ip/country*').as('countryIpApi');

    cy.waitForSSG(url);

    cy.wait('@countryIpApi', { timeout: 20000 }).then((interception) => {
      // 验证状态码
      expect(interception.response.statusCode).to.eq(200);

      // 验证响应体结构
      expect(interception.response.body).to.have.property('success');
      expect(interception.response.body).to.have.property('data');

      // 验证业务数据
      const { data } = interception.response.body;
      expect(data).to.have.property('countryCode');
      expect(data).to.have.property('mobileCode');
      const { mobileCode } = data;
      // 确保 mobileCode 是一个有效的数字
      const mobileCodeAsNumber = +mobileCode;
      expect(mobileCodeAsNumber).to.be.greaterThan(0); // 或者其他适合的条件
      expect(Number.isNaN(mobileCodeAsNumber)).to.equal(false); // 确保不是 NaN
    });
  });

  it('检测注册页是否请求了营销配置的API', () => {
    const url = '/ucenter/signup';

    cy.intercept(
      '/_api/growth-config/get/client/config/codes?businessLine=ucenter&codes=web202312homepagePop*',
    ).as('businessConfigApi');

    cy.waitForSSG(url);

    cy.wait('@businessConfigApi', { timeout: 20000 }).then((interception) => {
      // 验证状态码
      expect(interception.response.statusCode).to.eq(200);

      // 验证响应体结构
      expect(interception.response.body).to.have.property('success');
      expect(interception.response.body).to.have.property('data');
    });
  });

  it('检测首页是否请求了营销合规配置的API（后端对接的展业中台）', () => {
    const url = '/';

    cy.intercept('/_api/ucenter/compliance/rules*').as('mktConfigApi');

    cy.waitForSSG(url);

    cy.wait('@mktConfigApi', { timeout: 20000 }).then((interception) => {
      // 验证状态码
      expect(interception.response.statusCode).to.eq(200);

      // 验证响应体结构
      expect(interception.response.body).to.have.property('success');
      expect(interception.response.body).to.have.property('data');

      const { data } = interception.response.body;
      expect(data).to.have.property('signUpGuide');
    });
  });
});
