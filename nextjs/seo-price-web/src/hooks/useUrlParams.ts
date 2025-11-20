import { useSearchParams } from 'next/navigation';

type QueryParams = {
  [key: string]: string | number | boolean | undefined;
};

const parseValue = (value: string): string | number | boolean => {
  if (!isNaN(Number(value))) {
    return Number(value);  // 转换为数字
  }
  if (value === 'true') {
    return true;  // 转换为布尔值
  }
  if (value === 'false') {
    return false;  // 转换为布尔值
  }
  return value;  // 默认为字符串
};

export const useUrlParams = (): QueryParams => {
  const searchParams = useSearchParams();
  const params: QueryParams = {};

  searchParams.forEach((value, key) => {
    params[key] = parseValue(value);
  });

  return params;
};
