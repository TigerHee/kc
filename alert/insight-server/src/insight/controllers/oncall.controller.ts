import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { InsightOncallService } from '../services/oncall.insight.service';
import { OnCallDocument } from '../schemas/oncall.schema';

@Controller('oncall')
export class OncallController {
  constructor(private readonly insightOncallService: InsightOncallService) {
    //
  }

  @Get('')
  async list() {
    const data = await this.insightOncallService.list();
    return data;
  }

  @Put(':id')
  async update(@Param('id') id, @Body() body: OnCallDocument) {
    const data = await this.insightOncallService.update(id, body);
    return data;
  }

  @Post('')
  async create(@Body() body: OnCallDocument) {
    const data = await this.insightOncallService.create(body);
    return data;
  }
}
