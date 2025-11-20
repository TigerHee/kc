export const convertLeadTrader2UserInfo = leadTrader => {
  const {avatar, nickName, configId: leadConfigId} = leadTrader || {};

  return {
    leadConfigId,
    nickName,
    avatarUrl: avatar,
  };
};
