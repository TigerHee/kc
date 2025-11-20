export const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const generateQueryUserInfoErrorMsg = ({
  error,
  attempt,
  maxAttempts,
}) => {
  const isMaxLimit = attempt === maxAttempts - 1;
  const isLoginExpiredCode = +error?.code === 401;
  // 调整 未达到重试三次不上报
  let msg = '';
  if (isMaxLimit) {
    msg = isLoginExpiredCode
      ? 'useFetchSafeguard-queryUserInfoAndTriggerCallbackError-maxLimit-401'
      : 'useFetchSafeguard-queryUserInfoAndTriggerCallbackError-maxLimit';
  }
  return msg;
};
