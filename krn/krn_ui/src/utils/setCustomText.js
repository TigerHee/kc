/**
 * Owner: willen@kupotech.com
 */

import { I18nManager, Text } from 'react-native';
import convertFontWeightToFamily from './convertFontWeightToFamily';

export default (customProps, newFontsAvailable) => {
  const TextRender = Text.render;
  const initialDefaultProps = Text.defaultProps;
  Text.defaultProps = {
    ...initialDefaultProps,
    ...customProps,
  };
  Text.render = function render(props) {
    let oldProps = props;

    // RTL布局下，数值+空格+字符 自动翻转为 字符+空格+数值
    const autoRotateDisable = props.autoRotateDisable;
    let _children = props.children;
    let _alreadyRotate = props._alreadyRotate;
    if (
      // 处于rtl布局
      I18nManager.isRTL &&
      // 内容为字符串
      typeof _children === 'string' &&
      // 手动关闭自动翻转
      !autoRotateDisable &&
      // 已自动做过翻转
      !_alreadyRotate
    ) {
      const match = _children.trim().match(/(^\d+) (\D.*$)/);
      if (match && match[1] && match[2]) {
        _children = `${match[2]} ${match[1]}`;
        _alreadyRotate = true;
      }
    }
    const fontFamily = convertFontWeightToFamily(props, newFontsAvailable);

    const style = [customProps.style, props.style, ...(fontFamily ? [{ fontFamily }] : [])];

    props = {
      ...props,
      style: style,
      children: _children,
      _alreadyRotate,
    };

    try {
      return TextRender.apply(this, arguments);
    } finally {
      props = oldProps;
    }
  };
};
