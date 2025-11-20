/**
 *   Owner: willen@kupotech.com
 */
import useHtmlToReact from 'hooks/useHtmlToReact';
const Html = (props) => {
  const { component, children, ...others } = props;
  const Component = component || 'div';
  const { eles } = useHtmlToReact({ html: children });
  return <Component {...others}>{eles}</Component>;
};
export default Html;
