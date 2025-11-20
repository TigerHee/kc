/**
 * Owner: willen@kupotech.com
 */
import { TextInput } from "react-native";
import convertFontWeightToFamily from "./convertFontWeightToFamily";

export default (customProps, newFontsAvailable) => {
  const TextInputRender = TextInput.render;
  const initialDefaultProps = TextInput.defaultProps;
  TextInput.defaultProps = {
    ...initialDefaultProps,
    ...customProps,
  };
  TextInput.render = function render(props) {
    let oldProps = props;
    const fontFamily = convertFontWeightToFamily(props, newFontsAvailable);

    const style = [customProps.style, props.style, ...(fontFamily ? [{ fontFamily }] : [])];

    props = { ...props, style: style };
    try {
      return TextInputRender.apply(this, arguments);
    } finally {
      props = oldProps;
    }
  };
};
