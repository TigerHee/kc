/**
 * 返回包装好使用lark应用打开的链接
 * @param url
 * @returns
 */
export const wrapperLarkAppInterOpenLink = (url: string) => {
  const encodeUrl = encodeURIComponent(url);
  return `https://applink.larksuite.com/client/web_app/open?appId=cli_a889abac3fb8502f&lk_target_url=${encodeUrl}`;
};
