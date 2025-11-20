/**
 * Owner: tiger@kupotech.com
 */
import { MAX_RENDER_TIME } from './config';

export const getExist = (support) => (support ? 'exist' : 'not.exist');

export const getSiteConfig = (url, callback) => {
  cy.intercept('GET', '/_api/ucenter/site-config*').as('siteConfig');
  cy.visit(url);
  return cy.wait('@siteConfig').then(({ response }) => {
    callback(response.body.data);
  });
}

// 行情主站配置
export const KCMarketSiteConfig = {
  // 自选
  favorites: {
    name: 'FAV',
    // 开关
    open: true,
    subModules: [
      {
        // 自选现货
        name: 'SPOT',
        // 开关
        open: true,
        // 交易按钮开关
        operateConfig: {
          // 币币交易
          coinTrading: true,
          // 机器人交易
          robotTrading: true,
        },
      },
      {
        // 自选合约
        name: 'FUTURE',
        // 开关
        open: true,
        // 交易按钮开关
        operateConfig: {
          // 币币交易
          coinTrading: true,
          // 机器人交易
          robotTrading: true,
        },
      },
    ],
  },
  // 热门
  hot: {
    name: 'HOT',
    // 开关
    open: true,
    // 交易按钮开关
    operateConfig: {
      // 币币交易
      coinTrading: true,
      // 机器人交易
      robotTrading: true,
    },
    subModules: [],
  },
}

export const getMarketSiteConfig = (tenant = 'KC') => {
  cy.intercept('GET', '/_api/discover-front/v1/market/uc/module/config*').as('marketSiteConfig');
  if (tenant === 'KC') {
    return Promise.resolve(KCMarketSiteConfig);
  } else {
    return cy.wait('@marketSiteConfig').then(({ response }) => {
      return response.body.data;
    });
  }
}

/**
 * @description 容器内死链检查(排除Header上的链接)
 * @param {String} selector 页面容器选择器
 */
export const checkHrefNot404 = (selector) => {
  cy.get(selector)
    .find('a')
    .not('.gbiz-Header a')
    .each(($a) => {
      const url = $a.prop('href');
      if (!url) return;
      cy.visit(url, {
        failOnStatusCode: false,
      });
      cy.url().should('not.contain', '404');
    });
};

/**
 * @description 检查元素是否渲染
 * @param {String} selector 选择器
 * @param {Number} timeout 检测的超时时间
 */
export const checkRender = (selector, timeout = MAX_RENDER_TIME) => {
  cy.get(selector, { timeout }).should('exist');
};

/**
 * @description 检查当前页面跳转到404
 * @param {String} url 页面url
 */
export const checkPageIn404 = (url) => {
  cy.visit(url, {
    failOnStatusCode: false,
  });
  cy.url().should('include', '404');
};

export function createCheckClickTo(path, verifiable = false) {
  return function checkClickTo(id) {
    cy.get(`[data-inspector="${id}"]`)
      .then(($btn) => {
        // Check if button exists
        cy.wrap($btn).should('not.be.disabled');
        cy.wrap($btn).click();
        // 弹窗确认
        if (verifiable) {
          cy
            .get('body')
            .find('.KuxModalFooter-root button.KuxButton-contained')
            .then(($btn) => {
              cy.wrap($btn).should('exist');
              $btn.click();
              cy.url().should('include', path);
            });
        } else {
          cy.url().should('include', path);
        }
      });
  };
}

export function createCheckElementEnable(selector = 'button', enable = true) {
  return (id) => {
    cy.get(`[data-inspector="${id}"] ${selector}`)
      .then(($els) => {
        expect($els).not.to.have.length(0);
      })
      .each(($el) => {
        cy.wrap($el).should('exist');
        cy.wrap($el).should(enable ? 'not.be.disabled' : 'be.disabled');
      });
  };
}

/** 关安全提示弹窗  */
export function closeSecurityPrompt() {
  // 检查class为'KuxModalHeader-close'的元素是否存在
  cy.get('body').then(($body) => {
    if ($body.find('.KuxModalHeader-close').length > 0) {
      // 判断元素是否存在
      // 如果存在，点击它
      cy.get('.KuxModalHeader-close').click();
    }
  });
}

export const getFormDataValue = (formDataStr, key) => {
  const match = formDataStr.match(new RegExp(`Content-Disposition: form-data; name="${key}"\\r\\n\\r\\n([^\\r\\n]*)`));
  return match[1];
}

/** 国家列表 */
export const interceptCountryCode = () => {
  cy.intercept('/_api/ucenter/country-codes*', {
    code: '200',
    success: true,
    data: [
      {
        "code": "CA",
        "en": "Canada",
        "cn": "加拿大",
        "mobileCode": "1",
        "ico": "https://assets.staticimg.com/ucenter/flag/canada.svg",
        "dismiss": false,
        "dismissLogin": false,
        "weight": 10
      }
    ]
  });
}

export const interceptRiskValidation = () => {
  cy.intercept('/_api/risk-validation-center/v1/available/verify*', {
    code: '200',
    success: true,
    data: { permitted: true }
  })
  const MOCK_TOKEN = '1234567890';
  cy.intercept('/_api/risk-validation-center/v1/security/validation/combine*', {
    code: '200',
    success: true,
    data: { needVerify: false, token: MOCK_TOKEN, best: [], others: [], transactionId: '' }
  }).as('riskValidation');
  
  return {
    checkToken: (headers) => {
      expect(headers['x-validation-token']).to.equal(MOCK_TOKEN)
    }
  };
}

const createPngFile = () => {
  const pngBytes = new Uint8Array([
    0x89,
    0x50,
    0x4e,
    0x47, // PNG 文件头（PNG signature）
    0x0d,
    0x0a,
    0x1a,
    0x0a,
    // 下面是简化的 IDAT 结构，可用于测试用途
    0x00,
  ]);
  const blob = new Blob([pngBytes], { type: 'image/png' });
  return new File([blob], 'test.png', { type: 'image/png' });
};

export const interceptUpload = (selector, callback) => {
  cy.intercept('POST', '/_api/ucenter/apply/unload*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: 'MOCK_ID',
    },
  }).as(`upload${selector}`);
  cy.get(selector).then(($input) => {
    const file = createPngFile();
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    $input[0].files = dataTransfer.files;
    const event = new Event('change', { bubbles: true });
    $input[0].dispatchEvent(event);
    cy.wait(`@upload${selector}`).then(() => {
      callback();
    });
  });
};

export const interceptCheckValidations = (data = []) => {
  cy.intercept('/_api/ucenter/check-required-validations*', {
    code: '200',
    success: true,
    data
  }).as('checkValidations')
}