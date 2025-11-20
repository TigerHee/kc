import { Body, Controller, Get, Param, Post, Query, Req, ValidationPipe } from '@nestjs/common';
import { OnetrustService } from './services/onetrust.service';
import { convertCookieListToArr, formatOutputForJson } from './onetrust.utils';
import { ScanCookieGetColorAndSendMessageDto } from './dto/scan-cookie-get-color-and-send-message.dto';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';
import { OnetrustReportService } from './services/report.onetrust.service';
import { RequestWithUser } from 'src/auth/auth.types';

@Controller('onetrust')
export class OnetrustController {
  constructor(
    private readonly service: OnetrustService,
    private readonly notificationTeamsService: NotificationTeamsService,
    private readonly reportService: OnetrustReportService,
  ) {
    //
  }

  @Get('/report/cookies-scan')
  async getReportList(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query('domain') domain: string,
    @Query('executor') executor: string,
  ) {
    const data = await this.reportService.getReportList({ current, pageSize, domain, executor });
    return data;
  }

  @Get('/cookies/:domain')
  async getCookiesList(
    @Param('domain') domain: string,
    @Query('countryCode') countryCode: string,
    @Query('searchStr') searchStr: string,
  ) {
    const res = await this.service.getCookiesList(
      {
        language: 'en',
        countryCode,
        searchStr,
      },
      [domain],
    );
    return res;
  }

  /**
   * 获取当前域名的Cookie变更
   * @param domain
   */
  @Post('/cookies/:domain/diff')
  async getCookieDiff(@Param('domain') domain: string, @Req() req: RequestWithUser) {
    const executor = req.user.name;
    const currentCookiesList = await this.service.getCookiesList({ language: 'en' }, [domain]);
    const currentCookiesArr = convertCookieListToArr(currentCookiesList.content);
    const { data: latestCookiesArr, createdAt: last_latest_scan_time } =
      await this.service.getCookieLatestCookieArr(domain);
    const diff = this.service.getCookieDiff(latestCookiesArr, currentCookiesArr);
    await this.service.saveLatestCookieArr(domain, currentCookiesArr, executor);
    return {
      ...diff,
      last_latest_scan_time,
    };
  }

  @Post('/cookies/:domain/diff-color')
  async getCookieDiffColor(@Param('domain') domain: string, @Req() req: RequestWithUser) {
    const executor = req.user.name;
    const currentCookiesList = await this.service.getCookiesList({ language: 'en' }, [domain]);
    const currentCookiesArr = convertCookieListToArr(currentCookiesList.content);
    const { data: latestCookiesArr, createdAt: last_latest_scan_time } =
      await this.service.getCookieLatestCookieArr(domain);
    const diff = this.service.getCookieDiff(latestCookiesArr, currentCookiesArr);
    await this.service.saveLatestCookieArr(domain, currentCookiesArr, executor);
    const base = [...new Set([...latestCookiesArr, ...currentCookiesArr])].sort();
    const data = formatOutputForJson(diff, base);
    return {
      data,
      last_latest_scan_time,
    };
  }

  @Post('/cookies/:domain/diff-color-send-message')
  async getCookieDiffColorAndSendMessage(
    @Param('domain') domain: string,
    @Body(new ValidationPipe()) body: ScanCookieGetColorAndSendMessageDto,
    @Req() req: RequestWithUser,
  ) {
    const executor = req.user.name;
    const { mentions, conversation, verbose } = body;
    const data = await this.service.makeCookieDiffAAndSendMessage({
      domain,
      conversation,
      mentions,
      verbose,
      executor,
    });
    return data;
  }
}
