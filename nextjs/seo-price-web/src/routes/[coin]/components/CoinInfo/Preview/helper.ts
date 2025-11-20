/**
 * Owner: kevyn.yu@kupotech.com
 */
import fp from 'lodash/fp';

const processContent = (arr: { text: string; type?: string }[] = []) => {
  const [question, ...answer] = arr;
  return {
    question: question.text,
    answer: question?.type === 'RICHTEXT' ? [question] : answer,
  };
};

const zipContent = (arr: { text: string; type?: string }[] = []) => {
  let index = -1;
  return fp.reduce((prev, curr: { text: string; type?: string }) => {
    const result = prev;
    if (!curr) return result;
    const isSingleNode = curr.type === 'TITLE' || curr.type === 'RICHTEXT';
    if (isSingleNode) {
      result[++index] = [curr];
    } else {
      result[index] = [...(result[index] ?? []), curr];
    }
    return result;
  }, {})(arr);
};

// 提取内容段落
export const contentHandler = (contentArr) => {
  const zippedArr = fp.pipe(zipContent, fp.map(processContent))(contentArr);
  return zippedArr;
};
