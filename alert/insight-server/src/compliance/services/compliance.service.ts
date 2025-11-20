import { Injectable } from '@nestjs/common';
import { ComplianceAtomic, ComplianceAtomicDocument } from '../schemas/compliance-atomic.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ComplianceDemand, ComplianceDemandDocument } from '../schemas/compliance-demand.schema';
import { ComplianceScanReport, ComplianceScanReportDocument } from '../schemas/compliance-scan-report.schema';
import { Types } from 'mongoose';
import { ComplianceAtomicListItem } from '../types';

@Injectable()
export class ComplianceService {
  constructor(
    @InjectModel(ComplianceAtomic.name)
    private readonly complianceAtomicModel: Model<ComplianceAtomicDocument>,
    @InjectModel(ComplianceDemand.name)
    private readonly complianceDemandModel: Model<ComplianceDemandDocument>,
    @InjectModel(ComplianceScanReport.name)
    private readonly complianceScanReportModel: Model<ComplianceScanReportDocument>,
  ) {
    //
  }

  /**
   * 获取合规原子列表
   * @param query
   * @returns
   */
  async getComplianceAtomicList(query: {
    current: number;
    pageSize: number;
    type: string;
    isScanDeleted: boolean;
    isSkip: boolean;
    path: string;
    spm: string;
    repo: string;
  }): Promise<{
    list: ComplianceAtomicListItem[];
    total: number;
  }> {
    const { current = 1, pageSize = 10, type, isScanDeleted, path, spm, repo, isSkip } = query;

    const _query = {
      isDeleted: false,
    };

    if (type) {
      _query['type'] = type;
    }
    if (isScanDeleted !== undefined && isScanDeleted !== null) {
      _query['isScanDeleted'] = isScanDeleted;
    }
    if (isSkip !== undefined && isSkip !== null) {
      _query['isSkip'] = isSkip;
    }
    if (path) {
      _query['path'] = { $regex: new RegExp(path, 'i') };
    }
    if (spm) {
      _query['spm'] = spm;
    }
    if (repo) {
      _query['repo'] = repo;
    }

    const list = await this.complianceAtomicModel
      .find(_query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const demandList = await this.complianceDemandModel.find({ isDeleted: false }).exec();

    const listWithDemand = list.map((item) => {
      const complianceDemand = demandList.filter((demand) => {
        return demand.codeScan && (demand.codeScan as Types.ObjectId[]).includes(item._id as Types.ObjectId);
      });
      return {
        ...item.toObject(),
        complianceDemand,
      };
    });

    const total = await this.complianceAtomicModel.countDocuments(_query);

    return {
      list: listWithDemand,
      total,
    };
  }

  /**
   * 更新合规原子需求
   * @param id
   * @param data
   * @returns
   */
  async updateComplianceAtomic(id: string, data: Pick<ComplianceAtomic, 'spm' | 'comment'>) {
    const _id = new Types.ObjectId(id);
    const { spm, comment } = data;
    const complianceAtomic = await this.complianceAtomicModel.findById(_id).exec();
    if (!complianceAtomic) {
      throw new Error('合规原子不存在');
    }
    complianceAtomic.spm = spm;
    complianceAtomic.comment = comment;
    await complianceAtomic.save();
    return complianceAtomic;
  }

  /**
   * 更新合规原子的skip状态
   * @param ids
   * @param isSkip
   * @returns
   */
  async updateComplianceAtomicSkip(ids: string[], isSkip: boolean) {
    console.log('isSkip', isSkip, typeof isSkip);
    const _ids = ids.map((id) => new Types.ObjectId(id));
    const result = await this.complianceAtomicModel.updateMany({ _id: { $in: _ids } }, { isSkip }).exec();
    return result;
  }

  /**
   * 更新合规原子的删除状态
   * @param ids
   * @returns
   */
  async updateComplianceAtomicDelete(ids: string[]) {
    const _ids = ids.map((id) => new Types.ObjectId(id));
    const result = await this.complianceAtomicModel.updateMany({ _id: { $in: _ids } }, { isDeleted: true }).exec();
    return result;
  }

  /**
   * 获取合规原子的选项
   * @returns
   */
  async getComplianceAtomicOptions() {
    const complianceAtomicOptions = await this.complianceAtomicModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
    return complianceAtomicOptions;
  }

  /**
   * 获取合规需求列表
   * @param query
   * @returns
   */
  async getComplianceDemandList(query: {
    current: number;
    pageSize: number;
    owner: string;
    createdAt: [string, string];
  }): Promise<{
    list: ComplianceDemand[];
    total: number;
  }> {
    const { current = 1, pageSize = 10, owner, createdAt } = query;
    const _query = {
      isDeleted: false,
    };
    if (owner) {
      _query['owner'] = new Types.ObjectId(owner);
    }
    if (createdAt) {
      _query['createdAt'] = {
        $gte: new Date(createdAt[0].replace('"', '').replace('"', '')),
        $lte: new Date(createdAt[1].replace('"', '').replace('"', '')),
      };
    }
    const list = await this.complianceDemandModel
      .find(_query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: 'codeScan',
        match: { isDeleted: false }, // 只关联未被删除的
      })
      .populate('owner')
      .exec();
    const total = await this.complianceDemandModel.countDocuments(_query);
    return {
      list,
      total,
    };
  }

  /**
   * 更新合规需求
   */
  async updateComplianceDemand(id: string, data) {
    const { title, schemeUrl, prdUrl, publicAt, owner } = data;
    const _id = new Types.ObjectId(id);
    const complianceDemand = await this.complianceDemandModel.findById(_id).exec();
    if (!complianceDemand) {
      throw new Error('合规需求不存在');
    }
    complianceDemand.title = title;
    complianceDemand.schemeUrl = schemeUrl;
    complianceDemand.prdUrl = prdUrl;
    complianceDemand.publicAt = publicAt;
    complianceDemand.owner = new Types.ObjectId(owner);
    await complianceDemand.save();
    return complianceDemand;
  }

  /**
   * 更新合规需求的代码扫描字段
   * @param id
   * @param codeScan
   * @returns
   */
  async updateComplianceDemandCodeScan(id: string, codeScan: string[]) {
    const _id = new Types.ObjectId(id);
    const complianceDemand = await this.complianceDemandModel.findById(_id).exec();
    if (!complianceDemand) {
      throw new Error('合规需求不存在');
    }
    complianceDemand.codeScan = codeScan.map((item) => new Types.ObjectId(item));
    await complianceDemand.save();
    return complianceDemand;
  }

  /**
   * 获取合规需求详情
   * @param id
   * @returns
   */
  async getComplianceDemandDetail(id: string): Promise<ComplianceDemandDocument> {
    const _id = new Types.ObjectId(id);
    const complianceDemand = await this.complianceDemandModel
      .findById(_id)
      .populate({
        path: 'codeScan',
        match: { isDeleted: false }, // 只关联未被删除的
      })
      .populate('owner')
      .exec();
    if (!complianceDemand) {
      throw new Error('合规需求不存在');
    }
    return complianceDemand;
  }

  /**
   * 创建合规需求
   * @param data
   * @returns
   */
  async createComplianceDemand(data) {
    const { title, schemeUrl, prdUrl, publicAt, owner } = data;
    const complianceDemand = new this.complianceDemandModel({
      title,
      schemeUrl,
      prdUrl,
      publicAt,
      owner: new Types.ObjectId(owner),
    });
    await complianceDemand.save();
    return complianceDemand;
  }

  /**
   * 删除合规需求
   * @param id
   * @returns
   */
  async deleteComplianceDemand(id: string) {
    const _id = new Types.ObjectId(id);
    const complianceDemand = await this.complianceDemandModel.findById(_id).exec();
    if (!complianceDemand) {
      throw new Error('合规需求不存在');
    }
    complianceDemand.isDeleted = true;
    await complianceDemand.save();
    return complianceDemand;
  }

  /**
   * 获取合规扫描报告列表
   * @param query
   * @returns
   */
  async getComplianceScanReportList(query: {
    current: number;
    pageSize: number;
    version: string;
    createdAt: [string, string];
  }): Promise<{
    list: ComplianceScanReportDocument[];
    total: number;
  }> {
    const { current = 1, pageSize = 10, version, createdAt } = query;
    const _query = {
      isDeleted: false,
    };
    if (version && version !== '') {
      _query['version'] = version;
    }
    if (createdAt && Array.isArray(createdAt)) {
      _query['createdAt'] = {
        $gte: new Date(createdAt[0].replace('"', '').replace('"', '')),
        $lte: new Date(createdAt[1].replace('"', '').replace('"', '')),
      };
    }
    const list = await this.complianceScanReportModel
      .find(_query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .find()
      .exec();
    const total = await this.complianceScanReportModel.countDocuments(_query);
    return {
      list,
      total,
    };
  }

  /**
   * 获取合规扫描报告详情
   * @param id
   * @returns
   */
  async getComplianceScanReportDetail(id: string): Promise<ComplianceScanReportDocument> {
    const _id = new Types.ObjectId(id);
    const complianceScanReport = await this.complianceScanReportModel.findById(_id).exec();
    if (!complianceScanReport) {
      throw new Error('合规扫描报告不存在');
    }
    return complianceScanReport;
  }
}
