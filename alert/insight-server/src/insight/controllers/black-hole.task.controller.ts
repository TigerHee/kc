import { Body, Controller, Get, Post, Put, Query, Param } from '@nestjs/common';
import { BlackHoleTaskService } from '../services/black-hole.task.service';
import { BlackHoleCommitDocument } from '../schemas/black-hole-commit.tasks.schema';

@Controller('black-hole-task')
export class BlackHoleTaskController {
  constructor(private readonly blackHoleTaskService: BlackHoleTaskService) {
    //
  }

  @Get('')
  async getTasksInfo() {
    const data = await this.blackHoleTaskService.getTasksInfo();
    return data;
  }

  @Get('commits')
  async getTasksCommits(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query('author') author: string,
    @Query('branch') branch: string,
    @Query('commitId') commitId: string,
    @Query('slug') slug: string,
    @Query('createdAt') createdAt: [string, string],
    @Query('readStatus') readStatus: boolean,
  ) {
    const data = await this.blackHoleTaskService.getTasksCommits({
      current,
      pageSize,
      author,
      branch,
      commitId,
      slug,
      createdAt,
      readStatus,
    });
    return data;
  }

  @Post('commits')
  async addTasksCommits(@Body() data: BlackHoleCommitDocument) {
    const res = await this.blackHoleTaskService.addTasksCommits(data);
    return res;
  }

  @Put('commits/read-status/:id')
  async updateReadStatus(@Param('id') id: string, @Body() data: { readStatus: boolean }) {
    const res = await this.blackHoleTaskService.updateReadStatus(id, data.readStatus);
    return res;
  }
}
