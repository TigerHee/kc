import { IGNORE_ACTORS } from './constants/ignore.actor.constants';

/**
 * 接口原始数据转JSON
 * @param obj
 * @returns
 */
export const rawLineObjectToJson = (raw) => {
  // 提取每一行的 text，并拼接成完整的 JSON 字符串
  const jsonString = raw.lines.map((line) => line.text).join('\n');

  // 解析 JSON 字符串为 JavaScript 对象
  let jsonObject;
  try {
    jsonObject = JSON.parse(jsonString);
    return jsonObject;
  } catch (error) {
    // console.error('解析 JSON 失败:', error);
    throw new Error('解析 JSON 失败' + error);
  }
};

/**
 * 检查依赖是否锁定
 * @param sematicVersion
 * @returns
 */
export const checkDependenciesIsLock = (sematicVersion) => {
  const reg = /[\^~]/;
  return !reg.test(sematicVersion);
};

export const normalizeString = (str) => {
  return str.replace(/\s+/g, ' ').trim();
};

export const isIgnoredFile = (name: string): boolean => {
  return name && (name.endsWith('.test.js') || name.endsWith('.md'));
};

export const shouldSkipFile = (
  name: string,
  parent: string,
  {
    parentSrc,
    fileNames,
    ignoredParents,
  }: {
    parentSrc?: string;
    fileNames?: string[];
    ignoredParents?: string[];
  },
): boolean => {
  return (
    isIgnoredFile(name) ||
    (parentSrc && parentSrc !== parent) ||
    (ignoredParents && ignoredParents.includes(parent)) ||
    (fileNames && !fileNames.includes(name))
  );
};
export const handleDiffHunks = (hunks, matchLine, diffTypes) => {
  const diffPath = [];
  hunks.forEach(({ segments }) => {
    const diffLines = segments.filter((item) => diffTypes.includes(item.type));
    diffLines.forEach((item) => {
      if (!matchLine) {
        //如果没有匹配的规则，则代表全部提示
        diffPath.push({ ...item, lines: [] });
      } else {
        const lines = item.lines.filter((li) => {
          return matchLine(li.line);
        });

        if (lines.length > 0) {
          diffPath.push({ ...item, lines });
        }
      }
    });
  });
  return diffPath;
};

export const notMergeAction = (message) =>
  message && !/^(Pull request|Merge|commit|Revert|PRD|JIRA|chore: update version|This reverts)/i.test(message);

export const getEffectiveHashes = (toHash, parents) => {
  let moreToHash = toHash;
  let moreFromHash = parents[0]?.id;

  if (parents.length > 1) {
    const realCommit = parents.find(
      (item) => !IGNORE_ACTORS.includes(item?.author?.emailAddress) && !notMergeAction(item?.message),
    );
    if (realCommit) {
      moreToHash = realCommit?.id;
      moreFromHash = realCommit?.parents?.[0]?.id;
    }
  }
  return { moreToHash, moreFromHash };
};
