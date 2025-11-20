import crypto from 'crypto';
import fs from 'fs';

/**
 * 计算文件的 hash 值（sha384）
 * 通过path读取文件内容，计算哈希值
 * @param {*} filePath
 * @returns
 */
export function calculateIntegrityHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath); // 读取文件内容
    const hash = crypto.createHash('sha384'); // 创建 sha384 哈希对象
    hash.update(fileBuffer); // 更新哈希内容
    return `sha384-${hash.digest('base64')}`; // 返回 Base64 编码后的哈希值
  } catch (err) {
    console.error(`Error calculating integrity hash for ${filePath}:`, err);
    return null;
  }
}

/**
 * 计算内容的 hash 值（sha384）
 * 通过内容计算哈希值
 * @param {*} content
 * @returns
 */
export function calculateIntegrityHashByContent(content) {
  try {
    const hash = crypto.createHash('sha384'); // 创建 sha384 哈希对象
    hash.update(content); // 更新哈希内容
    return `sha384-${hash.digest('base64')}`; // 返回 Base64 编码后的哈希值
  } catch (err) {
    console.error(`Error calculating integrity hash for content:`, err);
    return null;
  }
}
