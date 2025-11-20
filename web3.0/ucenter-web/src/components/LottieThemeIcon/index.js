/**
 * Owner: john.zhang@kupotech.com
 */

import { useTheme } from '@kux/mui';

const { default: LottieProvider } = require('../LottieProvider');

/**
 * Lottie 自动识别暗色模式的Icon组件
 * 注: 需要添加一份暗色模式icon的json
 * @param {*} props
 * @returns
 */
const LottieThemeIcon = (props) => {
  const theme = useTheme();
  let iconName = theme?.currentTheme === 'dark' ? `${props.iconName}_dark` : props.iconName;
  return <LottieProvider {...props} iconName={iconName} />;
};

export default LottieThemeIcon;
