import { Children, isValidElement, Fragment, type ReactNode, type ReactElement } from 'react';

/**
 * 将 React 组件的 children 扁平化, 变为一个一维数组。
 * @param children 需要扁平化的 children
 * @returns 扁平化后的 ReactElement 数组
 */
export function flattenReactChildren(children: ReactNode): ReactElement[] {
  const result: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === Fragment) {
      result.push(...flattenReactChildren(child.props.children));
    } else {
      result.push(child);
    }
  });

  return result;
}
