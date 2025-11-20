import { Agent } from 'undici'; // Import the https module
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PKG_ROOT_DIR = path.join(__dirname, '../packages');

/**
 * VPN 环境与服务器(CI)环境使用的host不同
 * * 存在 GIT_URL 环境变量时，认为是在服务器环境中, 使用 kufox-bot.kcprd.com
 */
const PUSH_SEVER_HOST =  process.env.GIT_URL ? 'kufox-bot.kcprd.com' :  'kufox.kcprd.com';

const CONVERSATION_ID = 'oc_bf3f86fe9e21640bf85af59a9f5c56e5';

// 使用 undici 的 Agent 来处理 SSL 证书错误, kcprd.com 的证书是自签名的
const unsafeAgent = new Agent({
  connect: {
    rejectUnauthorized: false
  }
});

async function unsafeFetch(url: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    // @ts-expect-error ignore ssl error
    dispatcher: unsafeAgent,
  });
  // 处理失败的响应
  if (!response.ok) {
    return response.text().then(text => {
      throw new Error(`Server(${url}) responded with: ${response.status} ${response.statusText}. Body: ${text}`);
    }, (e) => {
      throw new Error(`Server(${url}) responded with: ${response.status} ${response.statusText}. Failed to read response body: ${e.message}`);
    });
  }
  return response;
}

async function getToken() {
  const response = await unsafeFetch(`https://${PUSH_SEVER_HOST}/api/lark/notify/tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appId: process.env.LARK_APP_ID,
      secret: process.env.LARK_APP_SECRET,
    }),
  });
  const data = await response.json();
  return data.token;
}

export async function notify2lark(content: string, emails: string[] = []) {
  const atEmails: any[] = emails.map((email) => ({email}));
  const body = {
    message: {
      text: content,
    },
    receiver: atEmails.concat([{ conversationId: CONVERSATION_ID}]),
  }
  try {
    const token = await getToken();
    await unsafeFetch(`https://${PUSH_SEVER_HOST}/api/lark/notify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log("Notification sent successfully.");
  } catch (error) {
    console.error("----------------------------------------");
      console.error("Error sending notification:");
      console.error("Full error object:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error name:", error.name);
        if (error.stack) {
          console.error("Error stack:", error.stack);
        }
        if (error.cause) {
          console.error("Error cause:", error.cause);
        }
      }
      // For errors that might not be instances of Error or have other properties
      if (typeof error === 'object' && error !== null) {
        for (const key in error) {
          if (Object.prototype.hasOwnProperty.call(error, key)) {
            console.error(`Error property - ${key}:`, (error as any)[key]);
          }
        }
      }
      console.error("----------------------------------------");
  }
}

interface GitUserInfo {
  authorEmail: string | null;
  committerEmail: string | null;
}

/**
 * 获取当前 git commit 的作者和提交者(CR)信息
 */
function getCurrentGitUserInfo(): GitUserInfo {
  try {
    const authorEmail = execSync('git log -1 --pretty=format:%ae', { encoding: 'utf-8' }).trim() || null;
    let committerEmail: string | null = null;
    try {
      committerEmail = execSync('git log -1 --pretty=format:%ce', { encoding: 'utf-8' }).trim() || null;
      if (committerEmail === authorEmail) {
        committerEmail = null; // 如果提交者和作者相同，则返回 null
      }
    } catch {
      committerEmail = null;
    }
    return { authorEmail, committerEmail };
  } catch (error) {
    console.error('Failed to get git user info:', error);
    return { authorEmail: null, committerEmail: null };
  }
}

function getCurrentCommitMessage(): string {
  try {
    const message = execSync('git log -1 --pretty=format:%B', { encoding: 'utf-8' }).trim();
    const lines = message.split('\n').map(l => l.trim()).filter(Boolean);
    const startIndex = lines.findIndex(l => l.startsWith('feat(t-ways-stop): prepare versions'));
    if (startIndex === -1) return '';
    return lines.slice(startIndex + 1).join('\n').trim();
  }
  catch (error) {
    console.error('Failed to get current commit message:', error);
    return '';
  }
}

function getPublishedPackages() {
  const changesFile = fs.readFileSync(path.join(__dirname, '../.publish-packages'), 'utf-8');
  const pkgDirNames = changesFile.split(',')
    .map(n => n.trim()).filter(Boolean)
    .map(n => {
      const pkgPath = path.join(PKG_ROOT_DIR, n, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        console.error(`Package ${n} not found at ${pkgPath}`);
        return null;
      }
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      return {
        name: pkg.name,
        version: pkg.version,
      }
    })
    .filter(Boolean) as { name: string; version: string }[];
  return pkgDirNames;
}

export function notifyPackageUpdate() {
  const publishedPackages = getPublishedPackages();
  if (publishedPackages.length === 0) {
    console.log('---- no packages published -----');
    return;
  }
  const authors = getCurrentGitUserInfo();
  const commitMessage = getCurrentCommitMessage();
  const message = `<b>营销组件库发版通知</b><br/>
  ${publishedPackages.map(pkg => `- ${pkg.name}@${pkg.version}`).join('<br/>')}<br/>
  ${commitMessage ? `更新内容:<br/><pre>${commitMessage}</pre>` : ''}
  本次更新由 @${authors.authorEmail || '神秘用户'} 强势推出${authors.committerEmail ? `，@${authors.committerEmail} 赞助` : ''}`;

  notify2lark(message, [authors.authorEmail, authors.committerEmail].filter(Boolean) as string[]);
}
