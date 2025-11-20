export const SharePostSceneType = {
  MyLead: 'MyLead', //带单人
  MyCopy: 'MyCopy', //跟单人
  Common: 'Common', // 通用（带单人介绍页）
};
// 。跟单人：我正在KuCoin跟单，快来参与吧！
// 。带单人：我正在KuCoin带单，快来跟单吧！
// 。通用（带单人介绍页）：KuCoin跟单火热进行中，快来参与吧！

export const FooterTitleTransKeyBySharePostSceneType = {
  [SharePostSceneType.Common]: 'a0b79a20619d4000ad7b',
  [SharePostSceneType.MyLead]: '1c5d3b7bb8214000a8c4',
  [SharePostSceneType.MyCopy]: 'b2c1eeb047734000a244',
};
