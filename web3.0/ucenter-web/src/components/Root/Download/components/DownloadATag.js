/**
 * Owner: willen@kupotech.com
 */

export default ({ children, onClick, ...restProps }) => {
  return (
    <a rel="nofollow" onClick={onClick} {...restProps}>
      {children}
    </a>
  );
};
