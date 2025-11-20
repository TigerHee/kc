import type API from './index';
export namespace ComplianceAPI {
  export type ComplianceDemandItem = {
    _id: string;
    /**
     * 需求名称
     */
    title: string;

    /**
     * 方案地址
     */
    schemeUrl: string;

    /**
     * PRD地址
     */
    prdUrl: string;

    /**
     * 上线时间
     */
    publicAt: string;

    /**
     * 创建时间
     */
    createdAt: string;

    /**
     * 负责人
     */
    owner: string | API.UserItem;

    /**
     * 巡检说明
     */
    patrol?: string;

    /**
     * 需求备注
     */
    remark?: string;

    /**
     * 软删除
     */
    isDeleted: boolean;

    /**
     * 关联原子扫描内容
     */
    codeScan: ComplianceAtomicItem[];
  };

  export type getComplianceDemandList = {
    list: ComplianceDemandItem[];
    total: number;
  };

  export type ComplianceAtomicItem = {
    _id: string;
    type: 'useCompliantShow' | 'CompliantBox' | 'HardCodeCountryCode';
    position: string;
    line: number;
    column: number;
    path: string;
    spm: string | null;
    repo: string;
    code: string;
    slug: string;
    comment: string;
    isSkip: boolean;
    complianceDemand: ComplianceDemandItem[];
  };

  export type ComplianceAtomicReportItem = {
    _id: string;
    scanParams: string;
    scanParams: string;
    version: string;
    createdAt: string;
    deletingItems: string;
    addingItems: string;
  };
}
