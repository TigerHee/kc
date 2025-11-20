/**
 * 提取 src/style/vars.scss 中的主题色变量 到 doc-assets/themeColorsArray.json 中
 *  方便文档中展示主题变量颜色
 */
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import parsedTheme from './themes/parsed-theme-tokens.json';

// ESM compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const outputDir = path.resolve(ROOT, 'docs/assets');
const outputFilePath = path.join(outputDir, 'themeColorsArray.json');

/**
 * 将十六进制颜色转换为 rgba 格式
 */
function hexToRgba(hex: string, alpha: number): string {
  // 确保 hex 值是标准格式
  hex = hex.trim();
  if (hex.startsWith('#')) {
    hex = hex.substring(1);
  }
  
  let r = 0, g = 0, b = 0;
  
  // 处理简写的十六进制颜色 #RGB
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } 
  // 处理标准的十六进制颜色 #RRGGBB
  else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 处理颜色函数 fade
function formatColor(color: string): string {
  if (!color.startsWith('fade')) return color;
  const [hex, alpha] = color.replace('fade(', '')
    .replace(')', '').split(',').map(item => item.trim());
  
  return hexToRgba(hex, parseFloat(alpha));
}

async function extractThemeColorsWithRegex(): Promise<void> {
  const formatted = parsedTheme.map(item => ({
    name: item.name,
    light: formatColor(item.light),
    dark: formatColor(item.dark)
  }));
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  // 写入 JSON 文件
  fs.writeFileSync(outputFilePath, JSON.stringify(formatted, null, 2));
  console.log(`✅ 提取的主题色变量已保存到 ${outputFilePath}`);
}

// 执行脚本
extractThemeColorsWithRegex();
