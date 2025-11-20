export default function ({ types: t }) {
  return {
    visitor: {
      JSXElement(path) {
        const node = path.node;

        // 提取前置注释 (leadingComments)
        const leadingComments = node.leadingComments?.map((comment) => comment.value.trim()) || [];

        // 提取内部注释 (innerComments)
        let innerComments = [];
        if (t.isJSXElement(node)) {
          innerComments = node.children
            .filter((child) => t.isJSXEmptyExpression(child) && child.innerComments)
            .flatMap((child) => child.innerComments.map((comment) => comment.value.trim()));
        }

        // 提取后置注释 (trailingComments)
        const trailingComments = node.trailingComments?.map((comment) => comment.value.trim()) || [];

        // 提取组件名称
        let componentName = null;
        if (node.openingElement.name.type === 'JSXIdentifier') {
          componentName = node.openingElement.name.name;
        } else if (node.openingElement.name.type === 'JSXMemberExpression') {
          componentName = node.openingElement.name.property.name;
        }

        // 组织结果
        const result = {
          component: componentName,
          leadingComments,
          innerComments,
          trailingComments,
        };

        // 打印结果
        console.log('Extracted Result:', result);
      },
    },
  };
}
