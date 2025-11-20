abstract class BasePageImplement {
  constructor() {
    // This is a placeholder for the base implementation.
  }

  /**
   * 获取文档数据
   */
  abstract getWikiData(
    wikiPageId: number,
    version: number,
  ): Promise<{
    pageId?: number;
    status: boolean;
    title?: string;
    url?: string;
    errors: {
      title: string;
      content: string | string[];
    }[];
    needH5Audit?: boolean;
    h5AuditStatus?: boolean;
  }>;
}

export default BasePageImplement;
