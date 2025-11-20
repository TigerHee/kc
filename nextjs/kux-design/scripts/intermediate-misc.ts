/**
 * 开发构建使用的中间信息及工具脚本
 */

import * as path from 'path';
import * as fs from 'fs';

export interface IMiscInfo {
  /**
   * 是否跳过post build script, npm发包时可用
   */
  skipPostBuild?: boolean
}

export const ROOT_DIR = path.resolve(__dirname, '..')

const MISC_CONFIG_FILE = path.resolve(ROOT_DIR, '.turbo/misc.json')

/**
 * 写入中间信息
 */
export async function writeMiscInfo(info: IMiscInfo) {
  const exist = readMiscInfo(true)
  const newInfo = Object.assign({}, exist, info)
  fs.writeFileSync(MISC_CONFIG_FILE, JSON.stringify(newInfo, null, 2))
}

/**
 * 读取中间信息
 * @param createFileIfNotExists 文件夹不存在时是否创建
 * @returns
 */
export function readMiscInfo(createFileIfNotExists = false): IMiscInfo {
  if (fs.existsSync(MISC_CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(MISC_CONFIG_FILE, 'utf-8'))
  } else {
    if (createFileIfNotExists) {
      fs.mkdirSync(path.dirname(MISC_CONFIG_FILE), { recursive: true })
    }
  }
  return {}
}

/**
 * 根据包名获取包的路径
 * @param pkgName 包名
 * @returns 包路径
 */
export function getPackagePath(pkgName: string) {
  return path.dirname(require.resolve(`${pkgName}/package.json`))
}
