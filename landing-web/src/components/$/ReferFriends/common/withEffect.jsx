/**
 * Owner: gavin.liu1@kupotech.com
 */
import { useEffect } from 'react';

/**
 * 注意：谨慎使用，谷歌翻译场景存在缺陷
 * * 当传入的`component`是文本（字符串）时，在谷歌翻译场景且存在rerender（如点某个按钮后更新状态 -> rerender）时会出现问题，此时建议用元素标签包裹一下文本
 * @param {JSX.Element} component
 * @param {VoidFunction} callback
 */
export function withEffect(component, callback) {
  function Component() {
    useEffect(() => {
      callback();
    }, []);
    return component;
  }
  return <Component />;
}
