/**
 * Owner: willen@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { NewVoiceCode } from 'gbiz-next/entrance';

/**
 * @remote/ 是无效作用域，加载会失败（不渲染）
 * 修复后 ui 不符合当前规范
 * 跟产品 leon 沟通后，结论是暂不处理，待接入安全验证组件后移除
 */

const Index = (props) => {
  const theme = useTheme();
  return <NewVoiceCode theme={theme.currentTheme} {...props} />;
};

export default Index;
