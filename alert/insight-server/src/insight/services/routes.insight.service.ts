import { InsightProjectsService } from './projects.insight.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Routes, RoutesDocument } from '../schemas/route.schema';
import { RequestWithUser } from 'src/auth/auth.types';
import { Model, Types } from 'mongoose';

@Injectable()
export class InsightRoutesService {
  constructor(
    @InjectModel(Routes.name) private readonly routeModel: Model<RoutesDocument>,
    private readonly insightProjectsService: InsightProjectsService,
  ) {
    //
  }

  /**
   * 获取路由列表
   * @returns
   */
  async getRoutesList({
    current = 1,
    pageSize = 10,
    path,
    title,
    accessibleLink,
    isNeedLogin,
    isIgnore,
    isWaitingConfig,
    user,
    tenant,
    project,
  }: {
    current?: number;
    pageSize?: number;
    isIgnore?: string;
    isWaitingConfig?: string;
  } & Partial<Omit<RoutesDocument, 'isIgnore'>>) {
    const query = {
      isDeleted: false,
    };
    if (path) {
      query['path'] = { $regex: new RegExp(path, 'i') };
    }
    if (title) {
      query['title'] = { $regex: new RegExp(title, 'i') };
    }
    if (accessibleLink) {
      query['accessibleLink'] = { $regex: new RegExp(accessibleLink, 'i') };
    }
    if (isNeedLogin) {
      query['isNeedLogin'] = isNeedLogin;
    }
    if (isIgnore === 'true') {
      query['isIgnore'] = isIgnore;
    }
    if (user) {
      query['user'] = new Types.ObjectId(user as unknown as string);
    }
    if (tenant) {
      // 数组内包含
      query['tenant'] = { $in: tenant };
    }
    if (project) {
      query['project'] = new Types.ObjectId(project as unknown as string);
    }
    if (isWaitingConfig === 'true') {
      query['isIgnore'] = false;
      query['accessibleLink'] = '';
    }
    const list = await this.routeModel
      .find(query)
      .populate('user')
      .populate('project')
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize);
    const total = await this.routeModel.countDocuments(query);
    return {
      list,
      total,
    };
  }

  /**
   * 创建路由
   * @param req
   * @param data
   * @returns
   */
  async createRoute(req: RequestWithUser, data: RoutesDocument) {
    console.log('data', data, data.project);
    const project = await this.insightProjectsService.findOne(new Types.ObjectId(data.project as unknown as string));
    console.log('project', project);
    const res = await this.routeModel.create({
      ...data,
      projectName: project.name,
      project: data.project,
    });
    return res;
  }

  /**
   * 更新路由
   */
  async updateRoute(
    id: string,
    data: Pick<RoutesDocument, 'user' | 'title' | 'accessibleLink' | 'isNeedLogin' | 'isIgnore'>,
  ) {
    const res = await this.routeModel.findByIdAndUpdate(id, {
      ...data,
      user: new Types.ObjectId(data.user as unknown as string),
      updatedAt: new Date(),
    });
    return res;
  }

  /**
   * 通过projectName重新绑定project
   * @param projectName
   * @param projectId
   * @returns
   */
  async linkProjectToRoute(projectName: string, projectId: string) {
    const res = await this.routeModel.updateMany({ projectName }, { project: projectId });
    return res;
  }
}
