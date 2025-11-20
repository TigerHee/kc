/**
 * 从 figma 主题表格中抓取主题 token 信息
 * why: 目前因公司使用的figma 套餐不支持使用 api 获取变量集合, 故使用手动抓取的方式
 * 
 * 使用方法:
 * 1. 打开 https://www.figma.com/design/979O23gM42ADNiDJkoo8fa/KC-Guidelines-2025?node-id=42765-19998&vars=1&m=dev
 * 2. 打开浏览器开发工具, 切换到 Sources 面板, 左侧切换到 Snippets 面板, 新建一个 Snippet, 将以下代码粘贴进去
 * 3. 保存 Snippet, 然后右键点击 Snippet, 选择 "Run Snippet"
 * 4. 滚动到主题表格的底部, 确保所有主题都加载完毕, 再滚动到顶部( figma 做了懒加载, 需要滚动到底部才能加载完所有主题 )
 * 5. 在控制台中输入 `getCurrentToken()` 并回车, 即可获取当前可见区域的主题, 并不完整
 * 6. 滚动页面到底部, 再次输入 `getCurrentToken()` 并回车, 获取剩余部分主题变量
 * 7. 然后再执行 `copy(getCurrentToken())` , 即可合并主题变量, 并复制到剪贴板
 * 8. 将复制的内容粘贴到一个 本文件夹下 raw-theme-tokens.json 文件中, 即可完成抓取任务
 */

const TABLE_ROW_SELECTOR = '.spreadsheet--body--a1SVF tr'

let allTokens = [];

function grabThemeTokens() {
  // 跳过前面三行
  const trs = Array.from(document.querySelectorAll(TABLE_ROW_SELECTOR)) .slice(3)
  if (trs.length === 0) {
    throw new Error('未找到主题表格行，请检查选择器是否正确');
  }
  const tokens = [];
  let currentTokens = null;

  for (const tr of trs) {
    const tds = Array.from(tr.querySelectorAll('td'));
    // 只处理 1 和 3 列的行
    if (tds.length !== 3 && tds.length !== 1) {
      continue;
    }
    // 主题group
    if (tds.length === 1) {
      if (currentTokens) {
        tokens.push(currentTokens);
      }
      currentTokens = { group: tds[0].textContent.trim(), tokens: [] };
      continue; // 跳过主题组行
    }

    if (!currentTokens || !currentTokens.tokens) {
      continue;
      // console.error('当前主题组未定义或无效', tr.innerText, tr);
      // throw new Error('未找到主题名称，请检查表格格式是否正确');
    }
    currentTokens.tokens.push({
      name: tds[0].textContent.trim(),
      light: tds[1].textContent.trim(),
      dark: tds[2].textContent.trim(),
    });
  }
  if (currentTokens) {
    tokens.push(currentTokens);
  }
  return tokens;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCurrentToken() {
  const tokens = grabThemeTokens();
  allTokens.push(...tokens);
  return allTokens;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function combineTokens() {
  const result = {};
  allTokens.forEach(group => {
    const currentGroup = result[group.group];
    if (!currentGroup) {
      result[group.group] = group;
      return;
    }
    currentGroup.tokens.push(...group.tokens);
    currentGroup.tokens = currentGroup.tokens.filter((token, index, self) => {
      // 去重
      return index === self.findIndex(t => t.name === token.name);
    });
  })

  return Object.values(result)
}
