/**
 * Owner: sean.shi@kupotech.com
 */

import { bootConfig } from 'kc-next/boot';
import { useEffect, useState } from 'react';
import { pull } from 'tools/request';

/**
 * @description: 仅针对概览-行情模块的多站点兜底配置，接口找 nathan.zhang
 * 行情团队负责具体配置，请勿修改
 * http://10.40.94.222:10240/swagger-ui/#/%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83/ucModuleConfigUsingGET
 */

export const MULTI_SITE_CONFIG = {
  KC: {
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
  },
  TR: {
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
            robotTrading: false,
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
        robotTrading: false,
      },
      subModules: [],
    },
  },
  TH: {
    // 自选
    favorites: {
      name: 'FAV',
      // 开关
      open: false,
      // 交易按钮开关
      operateConfig: {
        // 币币交易
        coinTrading: false,
        // 机器人交易
        robotTrading: false,
      },
      subModules: [],
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
        robotTrading: false,
      },
      subModules: [],
    },
  },
  CL: {
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
  },
};

let targetMultiSiteConfig = null;

let currentPromise = null;

const getMarketMultiSiteConfig = async () => {
  if (targetMultiSiteConfig) {
    return targetMultiSiteConfig;
  }

  // 如果是主站, 用本地写死的
  // TODO: 后端6月19号上线，等下次迭代上线再放开
  if (bootConfig._BRAND_SITE_ === 'KC') {
    targetMultiSiteConfig = MULTI_SITE_CONFIG.KC;
    return MULTI_SITE_CONFIG.KC;
  }

  if (currentPromise) {
    return currentPromise;
  }
  // 发起请求
  currentPromise = pull('/discover-front/v1/market/uc/module/config')
    .then((res) => {
      const { data, success } = res;
      if (success && data) {
        targetMultiSiteConfig = data;
        currentPromise = null;
        return data;
      }
      throw new Error('get site config failed1');
    })
    .catch(() => {

      currentPromise = null;
      // 如果从服务器的配置拉取失败，则使用默认的配置, 兜底是 KC 站配置
      targetMultiSiteConfig = MULTI_SITE_CONFIG[tenant] || MULTI_SITE_CONFIG.KC;
      return targetMultiSiteConfig;
    });
  return currentPromise;
};
// 行情多站点配置
export const useMarketMultiSiteConfig = () => {
  const [marketMultiSiteConfig, setMarketMultiSiteConfig] = useState(targetMultiSiteConfig);

  useEffect(() => {
    getMarketMultiSiteConfig().then((data) => {
      setMarketMultiSiteConfig(() => data);
    });
  }, []);

  return { marketMultiSiteConfig };
};
