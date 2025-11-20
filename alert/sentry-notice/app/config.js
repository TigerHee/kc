/**
 * Owner: derrick@kupotech.com
 */

const monitorConfig = {
  conversation: "19:f1f939fdc78040eebe75d272ed3a9c1a@thread.v2",
  mentions: [
    "ella.wang@kupotech.com",
    "victor.ren@kupotech.com",
    "vitace@kupotech.com",
    "chelsey.fan@kupotech.com",
    "hanx.wei@kupotech.com",
    "chris@kupotech.com",
  ],
  // tels: ["18048457867"],
  // domainMentions: ["chris@kupotech.com"],
  tels: [
    "18048457867", // chris
    "18280435149", // vitace
    "18116571026", // gannicus
    "18868875314", // brick
    "13880232310", // hanx
  ],
  domainMentions: [
    "vitace@kupotech.com",
    "jerry.shen@flashdot.com",
    "gannicus.zhou@kupotech.com",
    "chris@kupotech.com",
    "leehom.wang@flashdot.com",
    "tony.chai@flashdot.com",
    "brick.fan@kupotech.com",
    "hanx.wei@kupotech.com",
  ],
};

// 平台
const PLATFORM = "01";
// 资产
const ASSETS = "02";
// 现货
const SPOT = "03";
// 合约
const CONTRACT = "04";
// 理财
const FINANCIAL = "05";
// 机器人
const ROBOT = "06";
// 矿池
const POOL = "07";
// 支付
const PAYMENT = "08";

const bizConfig = {
  conversation: "19:61ec13ec8f2f48fca13a0c878262c7ba@thread.v2",
  [PLATFORM]: {
    mentions: ["willen@kupotech.com"],
    bizType: "平台",
  },
  [ASSETS]: {
    mentions: ["terry@kupotech.com"],
    bizType: "资产",
  },
  [SPOT]: {
    mentions: ["odan.ou@kupotech.com", "borden@kupotech.com"],
    bizType: "现货",
  },
  [CONTRACT]: {
    mentions: ["clyne@kupotech.com"],
    bizType: "合约",
  },
  [FINANCIAL]: {
    mentions: ["chris@kupotech.com"],
    bizType: "理财",
  },
  [ROBOT]: {
    mentions: ["gannicus.zhou@kupotech.com"],
    bizType: "机器人",
  },
  [POOL]: {
    mentions: ["lancelot@kupotech.com"],
    bizType: "矿池",
  },
  [PAYMENT]: {
    mentions: ["jerry.shen@kupotech.com"],
    bizType: "支付",
  },
};

const bizConfigV2 = {
  conversation: "19:ea9f23e2d65f4375b516610677ac8682@thread.v2",
  [PLATFORM]: {
    mentions: [
      "willen@kupotech.com",
      "ella.wang@kupotech.com",
      "victor.ren@kupotech.com",
      "vitace@kupotech.com",
      "chelsey.fan@kupotech.com",
      "hanx.wei@kupotech.com",
    ],
    bizType: "平台",
  },
  [ASSETS]: {
    mentions: [
      "terry@kupotech.com",
      "gannicus.zhou@kupotech.com",
      "judith.zhu@kupotech.com",
    ],
    bizType: "资产",
  },
  [SPOT]: {
    mentions: [
      "odan.ou@kupotech.com",
      "gannicus.zhou@kupotech.com",
      "judith.zhu@kupotech.com",
      "borden@kupotech.com",
      "ray.lee@kupotech.com",
    ],
    bizType: "现货",
  },
  [CONTRACT]: {
    mentions: ["clyne@kupotech.com", "gannicus.zhou@kupotech.com"],
    bizType: "合约",
  },
  [FINANCIAL]: {
    mentions: ["brick.fan@kupotech.com"],
    bizType: "理财",
  },
  [ROBOT]: {
    mentions: ["gannicus.zhou@kupotech.com", "mike@kupotech.com"],
    bizType: "机器人",
  },
  [POOL]: {
    mentions: ["lancelot@kupotech.com"],
    bizType: "矿池",
  },
  [PAYMENT]: {
    mentions: ["jerry.shen@kupotech.com", "eason.wang@flashdot.com"],
    bizType: "支付",
  },
};

module.exports = {
  monitorConfig,
  bizConfig,
  bizConfigV2,
};
