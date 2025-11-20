export type UpdatePropAction<T> = {
  updateProp: (payload: Partial<T>) => void;
};