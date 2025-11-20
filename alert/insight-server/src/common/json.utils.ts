import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * 从指定路径读取 JSON 文件并解析成 JavaScript 对象
 * @param filePath 相对路径，指向 JSON 文件
 * @returns 返回解析后的对象
 * @throws 抛出文件读取或解析错误
 */
export async function readJsonFile(filePath: string): Promise<any> {
  try {
    const fullPath = path.resolve(__dirname, filePath); // 获取完整路径
    const data = await fs.readFile(fullPath, 'utf-8'); // 读取文件内容
    return JSON.parse(data); // 解析 JSON 内容
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    throw error; // 把错误抛出以便调用者处理
  }
}
