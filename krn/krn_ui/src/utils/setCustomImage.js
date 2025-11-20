/**
 * Owner: tiger@kupotech.com
 */
import { Image } from 'react-native';
import cloneDeep from "lodash/cloneDeep";

export default (customProps) => {
  const ImageRender = Image.render;
  const initialDefaultProps = Image.defaultProps;
  Image.defaultProps = {
    ...initialDefaultProps,
    ...customProps,
  };
  Image.render = function render(props) {
    let oldProps = props;

    const { autoRotateDisable } = props;
    const customStyle = cloneDeep(customProps.style);
    if (autoRotateDisable) {
      customStyle.transform = [];
    }

    props = { ...props, style: [customStyle, props.style] };
    try {
      return ImageRender.apply(this, arguments);
    } finally {
      props = oldProps;
    }
  };
};
