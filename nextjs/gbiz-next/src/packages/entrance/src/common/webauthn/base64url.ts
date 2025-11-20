export type Base64urlString = string;

export function base64urlToBuffer(
  baseurl64String: Base64urlString,
): ArrayBuffer {
  // Base64url to Base64
  const padding = "==".slice(0, (4 - (baseurl64String.length % 4)) % 4);
  const base64String =
    baseurl64String.replace(/-/g, "+").replace(/_/g, "/") + padding;

  // Base64 to binary string
  const str = atob(base64String);

  // Binary string to buffer
  const buffer = new ArrayBuffer(str.length);
  const byteView = new Uint8Array(buffer);
  for (let i = 0; i < str.length; i++) {
    byteView[i] = str.charCodeAt(i);
  }
  return buffer;
}

export function bufferToBase64url(buffer: ArrayBuffer): Base64urlString {
  // Buffer to binary string
  const byteView = new Uint8Array(buffer);
  let str = "";
  for (const charCode of byteView) {
    str += String.fromCharCode(charCode);
  }

  // Binary string to base64
  const base64String = btoa(str);

  // Base64 to base64url
  // We assume that the base64url string is well-formed.
  const base64urlString = base64String.replace(/\+/g, "-").replace(
    /\//g,
    "_",
  ).replace(/=/g, "");
  return base64urlString;
}

export function base64UrlToBase64(base64UrlString: Base64urlString) {
  // 将 Base64 URL 编码字符串中的 '-' 替换为 '+'
  let base64String = base64UrlString.replace(/-/g, '+');

  // 将 Base64 URL 编码字符串中的 '_' 替换为 '/'
  base64String = base64String.replace(/_/g, '/');

  // 计算需要添加的填充字符 '=' 的数量
  const padding = base64String.length % 4;
  if (padding > 0) {
    base64String += '='.repeat(4 - padding);
  }

  return base64String;
}
