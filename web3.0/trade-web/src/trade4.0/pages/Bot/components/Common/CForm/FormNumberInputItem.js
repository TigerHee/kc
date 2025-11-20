/**
 * Owner: mike@kupotech.com
 * Size Form 控件
 */
import React from 'react';
import { useSelector } from 'dva';
import { useYScreen } from '@/pages/OrderForm/config';
import { _t } from 'Bot/utils/lang';
import FormNumberItem from './FormComponent/FormNumberItem';

/**
 * @description: 如果rules中是必填, 手动添加一个提示的rule. 兼容迁移的代码
 * @param {*} rules
 * @return {*}
 */
const mergeRule = (rules = []) => {
  const isRequired = rules.some((rule) => rule.required);
  if (isRequired) {
    rules = rules.slice(0);
    rules.unshift({
      required: true,
      validateTrigger: 'onSubmit',
      validator: (rule, value, cb) => {
        if (!value) {
          // 请输入有效数字
          return cb(_t('form.number.required'));
        }
        return cb();
      },
    });
    return rules;
  }
  return rules;
};
/**
 * @description: 包装的有 <FormItem><Input /></FormItem>
 * @return {*}
 */
const FormNumberInputItem = ({
  name,
  label,
  validator,
  rules,
  unit,
  step,
  placeholder,
  onChange,
  className,
  min,
  max,
  formProps = {},
  maxPrecision, // 为0, 表示整数
  ...rest
}) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const yScreen = useYScreen();

  const isYScreenSM = yScreen === 'sm';
  formProps = rules ? { rules: mergeRule(rules), ...formProps } : formProps;

  return (
    <FormNumberItem
      className={className}
      name={name}
      label={label === false || isYScreenSM ? null : label}
      validator={isLogin ? validator : null}
      formProps={formProps}
      unit={unit}
      placeholder={placeholder}
      inputProps={{
        step,
        maxPrecision,
        onChange,
        min,
        max,
        size: isYScreenSM ? 'small' : 'medium',
      }}
      {...rest}
    />
  );
};

export default React.memo(React.forwardRef(FormNumberInputItem));
