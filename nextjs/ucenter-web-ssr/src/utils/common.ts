export const getUserNickname = (inviteInfo: { nickname?: string; email?: string; phone?: string }) => {
  const { nickname, email, phone } = inviteInfo;
  return nickname || email || phone || '--';
};
