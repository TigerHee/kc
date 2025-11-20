/**
 * Owner: willen@kupotech.com
 */
const registerAPI = (component, API) => {
  if (component) {
    const propTypes = {};
    const defaultProps = {};
    Object.keys(API).forEach((key) => {
      propTypes[key] = API[key].propTypes;
      if (API[key].defaultValue) {
        defaultProps[key] = API[key].defaultValue;
      }
    });

    component.propTypes = propTypes;
    component.defaultProps = defaultProps;
  }
};

export default registerAPI;
