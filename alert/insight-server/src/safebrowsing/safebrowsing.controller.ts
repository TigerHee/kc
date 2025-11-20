import { Controller, Get, Query } from '@nestjs/common';
import { SafebrowsingService } from './services/safebrowsing.service';

@Controller('safebrowsing')
export class SafebrowsingController {
  constructor(private readonly safebrowsingService: SafebrowsingService) {}

  @Get('check')
  async checkUrls(@Query('urls') urls: string) {
    const urlList = urls.split(',');
    const result = await this.safebrowsingService.checkUrls(urlList);
    return result.length ? result : [];
  }

  @Get('/report/domains')
  async getReportList(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query('domain') domain: string,
    @Query('threatType') threatType: string,
    @Query('platformType') platformType: string,
    @Query('executor') executor: string,
  ) {
    const data = await this.safebrowsingService.getReportDomains({
      current,
      pageSize,
      domain,
      threatType,
      platformType,
      executor,
    });
    return data;
  }
}
