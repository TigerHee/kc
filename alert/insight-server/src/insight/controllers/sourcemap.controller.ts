import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SourcemapService } from '../services/sourcemap.service';

@Controller('sourcemap')
export class SourcemapController {
  constructor(private readonly sourcemapService: SourcemapService) {
    //
  }

  @Get('')
  async parserContent(@Query('url') url: string, @Query('line') line: number, @Query('column') column: number) {
    if (!url.startsWith('https://assets') && !url.endsWith('js')) {
      throw new BadRequestException('url不合法');
    }
    const res = this.sourcemapService.parserContent({ url, line, column });
    return res;
  }
}
