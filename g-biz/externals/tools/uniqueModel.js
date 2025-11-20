/**
 * Owner: iron@kupotech.com
 */
export default (dva, model, initialProps = {}) => {
  const modelIndex = dva._models.findIndex((m) => m.namespace === model.namespace);
  if (modelIndex === -1) {
    if (Object.keys(initialProps).includes(model.namespace)) {
      Object.assign(model.state, initialProps[model.namespace]);
    }
    dva.model(model);
  }
};
