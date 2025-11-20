import { Controller, Get, Query } from '@nestjs/common';
import { VirustotalService } from './services/virustotal.service';

@Controller('virustotal')
export class VirustotalController {
  constructor(private readonly virustotalService: VirustotalService) {}

  @Get('domain')
  async checkUrls(@Query('domain') domain: string) {
    const result = await this.virustotalService.checkDomain(domain);
    return result.length ? result : [];
  }
  @Get('/report/domains')
  async getReportList(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query('id') id: string,
    @Query('executor') executor: string,
  ) {
    const data = await this.virustotalService.getReportDomains({
      current,
      pageSize,
      id,
      executor,
    });
    return data;
  }
}
