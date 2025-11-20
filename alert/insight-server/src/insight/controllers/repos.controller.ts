import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { InsightReposService } from '../services/repos.insight.service';
import { ReposDocument } from '../schemas/repos.schema';
import { REPOS_GROUP_OPTION_DATA } from '../constants/repos.constant';

@Controller('repos')
export class InsightReposController {
  constructor(private readonly reposService: InsightReposService) {
    //
  }

  @Get('')
  async getAllRepos(
    @Query('current') current,
    @Query('pageSize') pageSize,
    @Query('name') name,
    @Query('slug') slug,
    @Query('group') group,
  ) {
    const data = await this.reposService.getAllRepos({ current, pageSize, name, slug, group });
    return data;
  }

  @Get('group')
  async getGroupRepos() {
    return REPOS_GROUP_OPTION_DATA;
  }

  @Get('options')
  async getRepoOptions() {
    return this.reposService.getRepoOptions();
  }

  @Post('')
  async createRepo(@Body() body: ReposDocument) {
    const isExist = await this.reposService.getRepoBySlug(body.slug);
    if (isExist?.id) {
      return await isExist.updateOne({
        body,
        isDeleted: false,
        updatedAt: new Date(),
      });
    } else {
      const res = await this.reposService.createRepo(body);
      return res;
    }
  }

  @Delete(':id')
  async deleteRepo(@Param('id') id: string) {
    return this.reposService.deleteRepo(id);
  }

  @Get(':id')
  async getRepo(@Param('id') id: string) {
    return this.reposService.getRepo(id);
  }

  @Put(':id')
  async updateRepo(@Param('id') id: string, @Body() body: ReposDocument) {
    return this.reposService.updateRepo(id, body);
  }
}
