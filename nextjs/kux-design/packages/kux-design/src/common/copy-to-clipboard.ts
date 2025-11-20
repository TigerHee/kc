/**
 * 复制文本到剪贴板
 * @param text 需要复制的文本
 * @returns 成功复制返回 true，失败返回 false
 */
export async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true  
    } catch (error) {
      console.error('Failed to copy with clipboard.writeText: ', error);
      // 部分安卓设备可能因为权限问题导致写入失败, 使用回退方法
      return fallbackCopy(text);
    }
  } else {
    return fallbackCopy(text);
  }
}

function fallbackCopy(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';  // Avoid scrolling to bottom
  textArea.style.opacity = '0';  // Make it invisible
  textArea.readOnly = true;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.setSelectionRange(0, text.length);
  let result = false
  try {
    result = document.execCommand('copy');
  } catch (err) {
    console.error('Fallback method for older browsers failed', err);
  }
  document.body.removeChild(textArea);
  return result
}