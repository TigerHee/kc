/**
 * Owner: willen@kupotech.com
 */
const typeMap = {
  signUp: 0,
  logIn: 1,
};

const platformMap = {
  pc: 20,
  h5: 40,
};

export const getBgUrl = (array) => {
  let signUpBG_pc = '';
  let signUpBG_pc_default = '';
  let signUpBG_h5 = '';
  let signUpBG_h5_default = '';
  let loginBG_pc = '';
  let loginBG_pc_default = '';
  let loginBG_h5 = '';
  let loginBG_h5_default = '';
  for (const item of array) {
    const { isDefault, type, url, platform } = item;
    if (isDefault) {
      if (type === typeMap.signUp) {
        platform === platformMap.pc ? (signUpBG_pc_default = url) : (signUpBG_h5_default = url);
      } else {
        platform === platformMap.pc ? (loginBG_pc_default = url) : (loginBG_h5_default = url);
      }
    } else {
      if (type === typeMap.signUp) {
        platform === platformMap.pc ? (signUpBG_pc = url) : (signUpBG_h5 = url);
      } else {
        platform === platformMap.pc ? (loginBG_pc = url) : (loginBG_h5 = url);
      }
    }
  }
  return {
    signUpBG_pc,
    signUpBG_pc_default,
    signUpBG_h5,
    signUpBG_h5_default,
    loginBG_pc,
    loginBG_pc_default,
    loginBG_h5,
    loginBG_h5_default,
  };
};
