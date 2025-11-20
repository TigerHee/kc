export const filterNilQuery = (q: any) => {
  for (const key in q) {
    if (q[key] === undefined) {
      delete q[key];
    }
  }
  return q;
};

/**
 * 将cookie列表转换为数组
 * @param cookieTree
 * @returns
 */
export const convertCookieListToArr = (cookieTree) => {
  const result = cookieTree.map((item) => item.cookieName);
  // 去重复并按字母排序
  return [...new Set(result)].sort() as string[];
};

/**
 * 格式化输出
 * @param diff
 * @param base
 */
export const formatOutputForJson = (
  diff,
  base,
  opt?: {
    verbose: boolean;
  },
) => {
  const arr: { line: string; color: string }[] = [];
  const verbose = opt?.verbose ?? false;
  base.forEach((item) => {
    const countInArr1 = diff.changed.find((change) => change.item === item);
    const isAdded = diff.added.includes(item);
    const isRemoved = diff.removed.includes(item);
    if (isAdded) {
      // console.log(chalk.green(`+ ${item}`));
      arr.push({ line: `+ ${item}`, color: 'green' });
    } else if (isRemoved) {
      // console.log(chalk.red(`- ${item}`));
      arr.push({ line: `- ${item}`, color: 'red' });
    } else if (countInArr1) {
      // console.log(chalk.yellow(`~ ${item}:`));
      arr.push({ line: `~ ${item}:`, color: 'yellow' });
      // console.log(chalk.red(`  from: ${countInArr1.from}`));
      arr.push({ line: `  from: ${countInArr1.from}`, color: 'red' });
      // console.log(chalk.green(`  to: ${countInArr1.to}`));
      arr.push({ line: `  to: ${countInArr1.to}`, color: 'green' });
    } else {
      if (verbose) {
        // console.log(`  ${item}`); // 没有变化的项
        arr.push({ line: `  ${item}`, color: 'black' });
      }
    }
  });
  return arr;
};
