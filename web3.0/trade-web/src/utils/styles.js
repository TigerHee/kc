/**
 * Owner: borden@kupotech.com
 */
/**
 * 合并组件的classes和传入的classes
 * @param {object} classes 组件本身定义的classes
 * @param {object} classesFromProps 传入的classes，组件使用者定义的类名集
 * @returns {string}
 */
 export const mergeClasses = (classes, classesFromProps = {}) => {
  let result;
  const mergeClassesProps = {};
  try {
    for (const key in classesFromProps) {
      if (classes[key]) {
        mergeClassesProps[key] = `${classes[key]} ${classesFromProps[key]}`;
      } else {
        mergeClassesProps[key] = classesFromProps[key];
      }
    }
    result = { ...classes, ...mergeClassesProps };
  } catch (e) {
    result = classes || {};
  }
  return result;
};
