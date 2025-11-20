import { Controller, Get, Param, Res } from '@nestjs/common';
import { ConfluenceService } from 'src/confluence/services/confluence.service';
import { Response } from 'express';
import { Readable } from 'stream';
import { gfm } from 'joplin-turndown-plugin-gfm';

@Controller('rag')
export class RagController {
  constructor(private readonly confluenceService: ConfluenceService) {
    //
  }

  @Get('2html/:pageId')
  async Get(@Param('pageId') pageId: string, @Res() response: Response) {
    const data = await this.confluenceService.getArticleContent(Number(pageId));
    const html = data.body.view.value;

    // 设置响应头，指示浏览器下载文件而不是直接显示
    response.set({
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="${pageId}.html"`,
      'Content-Length': Buffer.byteLength(html),
    });
    // 将流通过响应发送
    response.send(html);
  }

  @Get('2md/:pageId')
  async getPage2Md(@Param('pageId') pageId: string, @Res() response: Response) {
    const data = await this.confluenceService.getArticleContent(Number(pageId));
    const html = data.body.view.value;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const TurndownService = require('turndown');
    const turndownService = new TurndownService();
    // table: http://localhost:3300/rag/2md/720049496
    // 表格支持
    turndownService.use(gfm);
    // image: http://localhost:3300/rag/2md/328565013
    // http://localhost:3300/rag/2md/721984196
    // 图片支持
    turndownService.addRule('img', {
      filter: 'img',
      replacement: function (content, node) {
        const alt = node.alt || '';
        const src = node.getAttribute('src') || '';
        return src ? `![${alt}](${src})` : '';
      },
    });
    // 过滤style标签的内容
    turndownService.addRule('style', {
      filter: 'style',
      replacement: function () {
        return '';
      },
    });
    const markdown = turndownService.turndown(html);

    // 创建一个可读流
    const stream = Readable.from([markdown]);

    // 设置响应头，指示浏览器下载文件而不是直接显示
    response.set({
      'Content-Type': 'text/markdown',
      'Content-Disposition': `attachment; filename="${pageId}.md"`,
      'Content-Length': Buffer.byteLength(markdown),
    });
    // 将流通过响应发送
    stream.pipe(response);
  }
}
