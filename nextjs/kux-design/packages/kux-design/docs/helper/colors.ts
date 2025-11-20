/**
 * Owner: saiya.lee@kupotech.com
 */
/**
 * 颜色相关的工具函数
 */

/**
 * 解析颜色字符串为 RGB 数组
 * @param input 颜色字符串 hex 或 rgb(a)
 * @returns [r, g, b] 数组
 */
function parseColor(input: string): [number, number, number] {
  input = input.trim().toLowerCase();

  // #fff or #ffffff
  if (input.startsWith('#')) {
    let hex = input.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join(''); // expand #fff → #ffffff
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  }

  // rgb() / rgba()
  const rgbaMatch = input.match(/rgba?\s*\(([^)]+)\)/);
  if (rgbaMatch) {
    const [r, g, b, a = '1'] = rgbaMatch[1]!.split(',').map(s => parseFloat(s.trim()));
    // @ts-expect-error ignore ts error
    const alpha = parseFloat(a);
    // 混合白色背景：C = (1 - a) * 255 + a * original
    const mix = (c: number) => Math.round((1 - alpha) * 255 + alpha * c);
    // @ts-expect-error ignore ts error
    return alpha < 1 ? [mix(r), mix(g), mix(b)] : [r, g, b];
  }

  throw new Error('Unsupported color format: ' + input);
}

/**
 * 根据给定的背景色返回对比对最高的文字颜色
 * @param bgColor 背景色
 * @returns 文字颜色
 */
export function getTextColorBasedBg(bgColor: string): '#000000' | '#ffffff' {
  const [r, g, b] = parseColor(bgColor);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186 ? '#000000' : '#ffffff';
}
