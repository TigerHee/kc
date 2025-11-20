export type RepoData = Record<RepoEnum, { slug: string; repo: string }>;

/**
 * @deprecated 计划移除
 */
export enum RepoEnum {
  BRISK_WEB = 'brisk-web',
  PUBLIC_WEB = 'public-web',
  KUCOIN_MAIN_WEB = 'kucoin-main-web',
  KUCOINE_BASE_WEB = 'kucoin-base-web',
}

export type DependencyItem = {
  name: string;
  version: string;
  isLock: boolean;
  type: 'dependencies' | 'devDependencies' | 'peerDependencies';
};

export type PackageJsonType = {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  scripts: Record<string, string>;
};
