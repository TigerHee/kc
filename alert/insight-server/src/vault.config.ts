// eslint-disable-next-line @typescript-eslint/no-require-imports
const applyNodeSecret = require('vault-webpack-plugin/dist/applyNodeSecret');

/**
 * 从 Vault 获取密钥
 * @returns Promise<Config> 包含密钥的对象
 */
export const getSecrets = async (): Promise<Record<string, string>> => {
  const secrets = await applyNodeSecret({
    valutApp: 'frontend_web_kv',
    valutTls: 'frontend_web_vault_tls',
    sceretKey: 'common',
    nodeEnv: process.env.NODE_ENV,
  });
  return secrets;
};
