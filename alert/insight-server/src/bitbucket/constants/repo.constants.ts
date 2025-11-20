import { RepoData, RepoEnum } from '../types/repo.types';

/**
 * @deprecated 计划移除
 */
const SCAN_REPO_LIST: RepoData = {
  [RepoEnum.BRISK_WEB]: {
    slug: 'KUC',
    repo: 'brisk-web',
  },
  [RepoEnum.PUBLIC_WEB]: {
    slug: 'KUC',
    repo: 'public-web',
  },
  [RepoEnum.KUCOIN_MAIN_WEB]: {
    slug: 'KUC',
    repo: 'kucoin-main-web',
  },
  [RepoEnum.KUCOINE_BASE_WEB]: {
    slug: 'KUC',
    repo: 'kucoin-base-web',
  },
};

export default SCAN_REPO_LIST;
