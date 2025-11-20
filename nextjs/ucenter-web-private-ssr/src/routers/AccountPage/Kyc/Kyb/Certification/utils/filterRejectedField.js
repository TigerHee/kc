/**
 * Owner: vijay.zhou@kupotech.com
 * 过滤审核失败的材料字段
 * 重新提交时不展示通过的材料和为空的内容块
 */
import { intersection, isArray } from 'lodash-es';

const isRejected = (name, rejectedKeys) => {
  return isArray(name) ? intersection(rejectedKeys, name).length : rejectedKeys.includes(name);
};

const filterRejectedField = (sections, rejectedKeys) => {
  const newSections = [];

  sections.forEach(({ children, ...s }) => {
    const newChildren = [];
    children.forEach((child) => {
      if (isArray(child)) {
        const newChild = child.filter((c) => isRejected(c.name, rejectedKeys));
        if (newChild.length) {
          newChildren.push(newChild);
        }
      } else {
        if (isRejected(child.name, rejectedKeys)) {
          newChildren.push(child);
        }
      }
    });
    s.children = newChildren;
    if (s.children.length) {
      newSections.push(s);
    }
  });

  return newSections;
};

export default filterRejectedField;
