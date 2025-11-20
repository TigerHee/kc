import * as crypto from 'crypto';
import { NO_AUTH_WHITE_LIST } from './constants/auth.constant';

// 生成 PKCE 验证器
export function generateCodeVerifier() {
  // URL 安全的 Base64 编码
  return crypto.randomBytes(32).toString('base64url');
}

// 生成 PKCE 挑战
export function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  return Buffer.from(hash).toString('base64url');
}

export function isExistWhiteList(path) {
  for (const route of NO_AUTH_WHITE_LIST) {
    // Strict match
    if (route === path) {
      return true;
    }

    // Fuzzy match for '*'
    if (route.endsWith('*') && path.startsWith(route.slice(0, -1))) {
      return true;
    }

    // Parameter match for ':param'
    const paramPattern = route.replace(/:[^\s/]+/g, '[^/]+');
    const regex = new RegExp(`^${paramPattern}$`);
    if (regex.test(path)) {
      return true;
    }
  }
  return false;
}
