/**
 * Owner: willen@kupotech.com
 */
import { useTheme } from '@kux/mui';
import systemDynamic from 'src/utils/systemDynamic';

/**
 * @remote/ 是无效作用域，加载会失败（不渲染）
 * 修复后 ui 不符合当前规范
 * 跟产品 leon 沟通后，结论是暂不处理，待接入安全验证组件后移除
 */
const VoiceCode = systemDynamic('@remote/entrance', 'VoiceCode');

const Index = (props) => {
  const theme = useTheme();
  return <VoiceCode theme={theme.currentTheme} {...props} />;
};

export default Index;
