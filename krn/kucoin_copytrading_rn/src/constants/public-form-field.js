export const MaxLengthMap = {
  modifyTraderIntro: 300, // 修改交易员介绍最大长度 300
  modifyTraderNickName: 24, // 修改交易员名称最大长度 24
};

/** 校验正则规则 */
export const ValidatePatternRules = {
  nickName: /^[\p{L}\p{N}_]+$/u, //支持数字、字母、下划线
  introduction:
    /^[\p{L}\p{N}\s.,、？：；（）¥@：%!“”——｜～《》$&…‘!()?;:'"\-_，。！]+$/u, //支持数字、字母、空格及常见标点符号
};
