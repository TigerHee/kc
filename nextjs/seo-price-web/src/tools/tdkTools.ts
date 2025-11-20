import { TDK_EXCLUDE_PATH, TDK_REPLACE_PATH } from "@/config/base";

export const excludeTdkPath = (pathname: string) => {
  if (
    TDK_REPLACE_PATH.some((item) => {
      return item.test(pathname);
    })
  ) {
    return false; // 如果是需要替换tdk的二级路由，则不排除
  }
  return TDK_EXCLUDE_PATH.some((item) => {
    if (typeof item === 'function') {
      return item(pathname);
    }
    return (item as unknown as RegExp).test(pathname);
  });
};

export const replaceTdkPath = (pathname: string) => {
  return pathname.replace(/\/page\/\d+$/, "");
};
