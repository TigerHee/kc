/**
 * DVA 接入辅助
 *
 * 在 remoteExternal 层做接入，保持 packages/* 目录下代码不变：
 *
 * 1) 注册一个极简 external model
 *    import { registerExternalModel } from 'tools/dva';
 *    await registerExternalModel('$your_namespace', { someKey: 0 });
 *
 * 2) 将 zustand 的指定 keys 同步到该 external model：
 *    - 命令式（非 React 场景）：
 *      import { syncZustand } from 'tools/dva';
 *      const off = syncZustand(useYourStore, '$your_namespace', ['someKey']);
 *      // 需要停止时：off();
 *
 *    - React Hook：
 *      import { useDvaSync } from 'tools/dva';
 *      function Bridge() {
 *        useDvaSync(useYourStore, '$your_namespace', ['someKey']);
 *        return null;
 *      }
 *
 * 说明：
 * - 仅需提供 namespace、store 和 keys。内部会做一次“首次推送”，并用深比较去重，避免重复派发。
 * - 如需手动派发，可用 dispatchTo(type, payload)；
 *   或用 updateNamespace(namespace, payload)（等价于派发 `${namespace}/update`）。
 */

export { useDvaSyncHook } from './sync';
