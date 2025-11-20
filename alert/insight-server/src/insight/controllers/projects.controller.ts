import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { InsightProjectsService } from '../services/projects.insight.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import ProjectWorkflowInsightService from '../services/workflow.projects.insight.service';
import { ProjectsScheduleInsightService } from '../services/schedule.projects.insight.service';
import { ProjectsLogsInsightService } from '../services/logs.projects.insight.service';

@Controller('projects')
export class InsightProjectsController {
  constructor(
    private readonly insightProjectsService: InsightProjectsService,
    private readonly projectWorkflowInsightService: ProjectWorkflowInsightService,
    private readonly projectsScheduleInsightService: ProjectsScheduleInsightService,
    private readonly projectsLogsInsightService: ProjectsLogsInsightService,
  ) {
    //
  }

  /**
   * 获取所有项目
   */
  @Get('list')
  async getProjects(@Query('current') current, @Query('pageSize') pageSize) {
    const res = await this.insightProjectsService.findAll({
      current,
      pageSize,
    });
    return res;
  }

  /**
   * 获取项目配置列表
   */
  @Get('options')
  async getProjectsOptions() {
    const res = await this.insightProjectsService.getProjectsOptions();
    return res;
  }

  /**
   * 创建项目
   * @param data
   */
  @Post('')
  async createProject(@Body() data: CreateProjectDto) {
    const res = await this.insightProjectsService.create(data);
    return res;
  }

  @Get('/gather-route')
  async gatherRoute(
    @Query('current') current,
    @Query('pageSize') pageSize,
    @Query('route') route,
    @Query('owner') owner,
    @Query('createdAt') createdAt,
    @Query('updatedAt') updatedAt,
  ) {
    const res = await this.insightProjectsService.gatherRoute({
      current,
      pageSize,
      route,
      owner,
      createdAt,
      updatedAt,
    });
    return res;
  }

  /**
   * 更新项目
   * @param data
   */
  @Put(':id')
  async updateProject(@Body() data: CreateProjectDto, @Param('id') id: string) {
    const res = await this.insightProjectsService.update(id, data);
    return res;
  }

  /**
   * 获取单个项目
   * @param id
   */
  @Get(':name')
  async getProject(@Param('name') name: string) {
    const res = (await this.insightProjectsService.findOneByName(name)).toJSON();
    const userRelatedProjects = await this.insightProjectsService.findUserRelatedProjects(res.owner._id as string);
    return {
      ...res,
      userRelatedProjects,
    };
  }

  /**
   * 删除项目
   * @param id
   */
  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    const res = await this.insightProjectsService.delete(id);
    return res;
  }

  @Put('reload-routes/:id')
  async reloadRoutes(@Param('id') id: string) {
    const res = await this.insightProjectsService.refreshOneProjectRoute(id);
    return res;
  }

  /**
   * 获取单个项目
   * @param id
   */
  @Get(':name/routes')
  async getProjectRoutes(@Param('name') name: string) {
    const res = await this.insightProjectsService.getProjectRouteDetail(name);
    return res;
  }

  /**
   * 获取项目依赖
   * @param name
   * @returns
   */
  @Get(':name/deps')
  async getProjectDeps(@Param('name') name: string) {
    const res = await this.insightProjectsService.getProjectDepsDetail(name);
    return res;
  }

  /**
   * 获取项目离线配置
   * @param name
   * @returns
   */
  @Get(':name/offline')
  async getProjectOffline(@Param('name') name: string) {
    const res = await this.insightProjectsService.getProjectOfflineDetail(name);
    return res;
  }

  /**
   * 获取项目 jscrambler 配置
   * @param name
   * @returns
   */
  @Get(':name/jscrambler')
  async getProjectJscrambler(@Param('name') name: string) {
    const res = await this.insightProjectsService.getProjectJscramblerDetail(name);
    return res;
  }

  @Get(':id/workflows')
  async getProjectWorkflow(
    @Param('id') id: string,
    // , @Query('current') current, @Query('pageSize') pageSize
  ) {
    const res = await this.projectWorkflowInsightService.getWorkflowList(id);
    return res;
  }

  @Get(':id/records')
  async getProjectWorkflowRecord(
    @Param('id') id: string,
    @Query('current') current = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    const res = await this.projectsScheduleInsightService.getProjectWorkflowRecord(id, {
      current,
      pageSize,
    });
    return res;
  }

  @Get(':id/logs')
  async getProjectJobLogs(@Param('id') id: string, @Query('current') current = 1, @Query('pageSize') pageSize = 20) {
    const res = await this.projectsLogsInsightService.getProjectJobLogs(id, {
      current,
      pageSize,
    });
    return res;
  }
}
