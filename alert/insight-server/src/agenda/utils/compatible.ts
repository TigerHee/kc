/**
 * 深度嵌套的对象
 * 把所有 key 为 _id 的值转换为字符串
 * _id的 值 new ObjectId('675832a0abba7e093961ad33') 转换为字符串 '675832a0abba7e093961ad33'，其他值直接返回
 * 删除所有__v字段
 * @param obj
 */
export const convertObjectIdToString = (obj) => {
  // 检查输入是否为对象或数组(数组也是对象)
  if (obj === null || typeof obj !== 'object') {
    return obj; // 直接返回不是对象的值
  }

  // 使用栈来处理深度遍历
  const stack = [obj]; // 初始化栈，存储对象
  const visited = new WeakSet(); // 用来跟踪对象，防止循环引用

  while (stack.length > 0) {
    const current = stack.pop(); // 取出栈顶元素

    // 如果当前对象已经处理过，跳过
    if (visited.has(current)) {
      continue;
    }

    visited.add(current); // 标记当前对象为已访问

    for (const key in current) {
      if (current.hasOwnProperty(key)) {
        if (key === '_id') {
          // 如果键是 _id 并且是 ObjectId，转换为字符串
          current[key] = current[key].toString(); // 假设这里有 toString 方法
        } else if (typeof current[key] === 'object' && current[key] !== null) {
          // 如果是对象或数组，压入栈
          stack.push(current[key]);
        } else if (key === '__v') {
          // 删除 __v 字段
          delete current[key];
        }
      }
    }
  }

  return obj; // 返回修改后的对象
};
