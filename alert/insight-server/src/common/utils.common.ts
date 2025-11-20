/**
 * Date 数据转换时区和格式化
 * @param date
 * @returns
 */
export function dateFormate(data: any[], key: string | string[]): any[] {
  function formatDate(item: any, k: string) {
    return new Date(item[k]).toLocaleString('en-US', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  if (key instanceof Array) {
    key.forEach((k) => {
      data = data.map((item) => {
        return {
          ...item,
          [k]: item[k] === '' || item[k] === null || item[k] === undefined ? '' : formatDate(item, k),
        };
      });
    });
    return data;
  }
  return data.map((item) => {
    return {
      ...item,
      [key]: new Date(item[key]).toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };
  });
}

export function safeStringify(obj: any): string {
  const cache = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      // 检查循环引用
      if (cache.has(value)) {
        return;
      }
      cache.add(value);
    }
    return value;
  });
}
