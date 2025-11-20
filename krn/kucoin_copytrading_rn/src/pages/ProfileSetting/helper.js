import {ValidatePatternRules} from 'constants/public-form-field';

export const validateName = nickName => {
  try {
    return ValidatePatternRules.nickName.test(nickName);
  } catch (error) {
    return true;
  }
};

export const validateIntro = intro => {
  try {
    return ValidatePatternRules.introduction.test(intro);
  } catch (error) {
    return true;
  }
};
