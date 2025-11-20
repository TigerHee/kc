import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { InsightTasksServices } from '../services/tasks.insight.service';
import { TasksRequestDocument } from '../schemas/tasks.schema';
import { RequestWithUser } from 'src/auth/auth.types';

@Controller('tasks')
export class InsightTasksController {
  constructor(private readonly insightTasksService: InsightTasksServices) {
    //
  }

  @Get('list')
  async getTasks(
    @Req() req: RequestWithUser,
    @Query('current') current,
    @Query('pageSize') pageSize,
    @Query('scope') scope: 'all' | 'self',
    @Query('name') name: string,
    @Query('user') user: string[],
    @Query('status') status: string,
    @Query('taskId') taskId: string,
    @Query('createdAt') createdAt: [string, string],
  ) {
    const res = await this.insightTasksService.findAll(req, {
      scope,
      current,
      pageSize,
      name,
      user,
      status,
      taskId,
      createdAt,
    });
    return res;
  }

  @Get('my')
  async getMyTasks(@Req() req: RequestWithUser) {
    const res = await this.insightTasksService.findMyTasks(req.user.email);
    return res;
  }

  @Post('')
  async createTask(@Body() data: TasksRequestDocument, @Req() req: RequestWithUser) {
    const res = await this.insightTasksService.create(req, data);
    return res;
  }

  @Put(':id')
  async updateTask(@Body() data: TasksRequestDocument, @Param('id') id: string) {
    const res = await this.insightTasksService.update(id, data);
    return res;
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    const res = await this.insightTasksService.findOne(id);
    return res;
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    const res = await this.insightTasksService.softDelete(id);
    return res;
  }

  @Post(':id/refresh')
  async refreshTask(@Param('id') id: string) {
    const res = await this.insightTasksService.refresh(id);
    return res;
  }
}
