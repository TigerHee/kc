/**
 * Owner: jacky@kupotech.com
 */

import { Tabs, useResponsive } from '@kux/mui';

/**
 * Tabs 类型
 * @typedef {Object} TabType
 * @property {string} label - 标签显示文本
 * @property {string} value - 标签值
 */

/**
 * @param {Object} props
 * @param {TabType} props.curTab - 当前选中的标签索引
 * @param {TabType[]} props.tabs - 标签列表，每个标签包含label和可选的count属性
 * @param {(tab: TabType) => void} props.onChange - 切换标签的回调函数
 */
export default function Tab({ curTab, onChange, tabs = [] }) {
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  return tabs?.length && !isH5 ? (
    <Tabs size="medium" indicator={false} value={curTab?.value}>
      {tabs.map((tab) => (
        <Tabs.Tab
          key={tab.label}
          label={tab.label}
          value={tab.value}
          active={curTab.value === tab.value}
          onClick={() => onChange(tab)}
        />
      ))}
    </Tabs>
  ) : null;
}
