// 解码html字符串
export const decodeHtml = (html: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

// 计算分钟数
const getMinVal = (v: number): number => Number((v / 60000).toFixed(1));

type P90Stats = {
  average: number;
  p90: number;
};
type AverageStats = {
  average: number;
};

// 计算全部数据的平均
export const getAverageMinutes = (data: number[]): AverageStats => {
  if (!data || data?.length === 0) {
    return {
      average: 0,
    };
  }

  const sum = data.reduce((total, val) => total + val, 0);
  const avgMs = sum / data.length;

  return {
    average: getMinVal(avgMs),
  };
};

// 计算 P90 平均耗时
export const getP90AverageMinutes = (data: number[]): P90Stats => {
  if (!data || data?.length === 0)
    return {
      p90: 0,
      average: 0,
    };

  const sorted = [...data].sort((a, b) => a - b);
  // P90 的下标
  const index = Math.max(0, Math.floor(0.9 * sorted.length) - 1);
  // 获取 P90 的值
  const p90Value = sorted[index];
  // 过滤出 <= P90 的数据
  const filtered = sorted.filter((val) => val <= p90Value);
  // 计算平均值（毫秒）
  const avgMs = filtered.reduce((sum, val) => sum + val, 0) / filtered.length;

  return {
    p90: getMinVal(p90Value),
    average: getMinVal(avgMs),
  };
};

// 计算百分比
export const getPercent = (v1: number, v2: number): string =>
  v2 > 0 ? `${((v1 / v2) * 100).toFixed(0)}%` : '0%';
