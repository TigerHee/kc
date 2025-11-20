const goVerify = async ({ onSuccess }) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  onSuccess({ headers: { ['X-VALIDATION-TOKEN']: '1234567890' }, data: {} });
}

module.exports = {
  goVerify: goVerify,
  goVerifyWithToken: goVerify,
  goVerifyWithAddress: goVerify,
  goVerifyLegacy: () => {
    return new Promise(resolve => goVerify({ onSuccess: resolve }));
  },
  checkAvailable: () => true,
}