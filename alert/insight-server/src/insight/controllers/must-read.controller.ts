import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MustReadInsightService } from '../services/must-read.insight.service';
import { CreateMustWikiDataDto } from '../dto/create-must-wiki.dto';

@Controller('wiki/must-read')
class MustReadController {
  constructor(private readonly mustReadInsightService: MustReadInsightService) {
    //
  }

  /**
   * 获取必读文章列表
   * @returns
   */
  @Get('')
  async getMustReadWikiList() {
    return await this.mustReadInsightService.getMustReadWikiList();
  }

  /**
   * 添加必读文章
   * @param data
   * @returns
   */
  @Post('')
  async addMustReadWiki(@Body() data: CreateMustWikiDataDto) {
    return await this.mustReadInsightService.addMustReadWiki(data);
  }

  /**
   * 获取用户必读文章列表
   * @param userId
   * @returns
   */
  @Get('user/:userId')
  async getMustReadWikiByUser(@Param('userId') userId: string) {
    return await this.mustReadInsightService.getMustReadWikiReadStatusByUserId(userId);
  }

  @Put('refresh')
  async refreshMustReadWikiList() {
    return await this.mustReadInsightService.refreshMustReadWikiList();
  }

  @Put('refresh/:pageId')
  async refreshMustReadWiki(@Param('pageId') pageId: string) {
    return await this.mustReadInsightService.refreshMustReadWiki(pageId);
  }

  @Delete(':pageId')
  async deleteMustReadWiki(@Param('pageId') pageId: string) {
    return await this.mustReadInsightService.deleteMustReadWiki(pageId);
  }

  // @Get(':pageId')
  // async getMustReadWiki(@Param('pageId') pageId: string) {
  //   console.log('pageId:', pageId);
  //   return await this.mustReadInsightService.getMustReadWiki(pageId);
  // }
}

export default MustReadController;
