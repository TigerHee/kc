/**
 * Owner: garuda@kupotech.com
 */

import React, { memo } from 'react';

import { useCompliantShow, useDisplayRule } from '@/components/CompliantRule/hook';

import NoSSG from '@/components/NoSSG';

const CompliantBoxInner = memo(({ spm, children }) => {
  // 显示控制逻辑
  const show = useCompliantShow(spm, { track: true });
  return show ? children : null;
});

/**
 * 判断顺序会先判断 ruleId （多租户控制），可以为空，为空不判断，ruleId 存在且为 true，为不显示
 * 传入 spm 参数会使用展业逻辑进行判断，可以为空，为空不判断
 * @description 多站点权限控制组件
 * @param {string} props.ruleId 权限模块id
 * @param {string} props.spm 展业模块id
 * @param {ReactNode} props.fallback [default:null] 权限匹配结果不通过展示的内容
 * @param {ReactNode} props.children 权限匹配结果通过展示的children内容
 * @returns
 */

const CompliantRule = (props) => {
  const { ruleId, spm, fallback, children } = props;
  const isDisplay = useDisplayRule(ruleId);
  return (
    <NoSSG fallback={fallback}>
      {isDisplay ? !spm ? children : <CompliantBoxInner {...props} /> : null}
    </NoSSG>
  );
};

export default memo(CompliantRule);
