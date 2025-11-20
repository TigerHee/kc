export default function getCookieTheme(ctx: any) {
  const cookies = ctx.req?.headers.cookie || '';
  const themeMatch = cookies.match(/kc_theme=([^;]+)/);
  const cookieTheme = themeMatch ? themeMatch[1] : '';
  // 验证主题值，只允许 'light' 和 'dark'，默认为 'dark'
  const theme = ['light', 'dark'].includes(cookieTheme) ? cookieTheme : 'dark';
  return theme;
}
