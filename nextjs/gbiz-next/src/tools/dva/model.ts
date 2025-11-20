import extend from 'dva-model-extend';

export const uniqueModel = (dva: any, model: any, initialProps = {}) => {
  const modelIndex = dva._models.findIndex((m: any) => m.namespace === model.namespace);
  if (modelIndex === -1) {
    if (Object.keys(initialProps).includes(model.namespace)) {
      Object.assign(model.state, initialProps[model.namespace]);
    }
    dva.model(model);
  }
};


export const extendModel = (models, model) => {
  if (Array.isArray(models)) {
    const target = models.find((m) => m.namespace === model.namespace);
    if (target) {
      return extend(model, target);
    }
  }

  return model;
};
