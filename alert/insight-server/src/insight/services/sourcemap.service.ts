import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SourceMapConsumer } from 'source-map';

@Injectable()
export class SourcemapService {
  constructor(private readonly configService: ConfigService) {
    //
  }

  private async fetchUrlContent(url: string) {
    try {
      const response = await axios.get(url, {
        httpsAgent:
          process.env.NODE_ENV === 'development'
            ? undefined
            : new HttpsProxyAgent(this.configService.get<string>('MWG_URL')),
        timeout: 30 * 1000,
      });
      const content = response.data;
      return content;
    } catch (error) {
      let errMsg = '';
      if (error.code === 'ECONNABORTED') {
        errMsg = '请求超时';
      } else {
        errMsg = `请求url失败 ${url}`;
      }

      throw new Error(errMsg);
    }
  }

  /**
   * 匹配准确的sourcemap地址
   * @param {*} jsContent
   * @returns
   */
  private extractSourcemapUrl(jsContent): string | null {
    const regex = /\/\/# sourceMappingURL=([^\s]+)/g; // 匹配所有 // sourceMappingURL= 后面的内容
    let match;
    let lastSourceMappingURL;
    // 遍历所有匹配项，保存最后一个匹配项的值
    while ((match = regex.exec(jsContent)) !== null) {
      lastSourceMappingURL = match[1];
    }
    if (lastSourceMappingURL) {
      return lastSourceMappingURL;
    } else {
      return null;
    }
  }

  /**
   * 处理加固代码解析 获取加固代码对应压缩代码的行和列
   * @param {*} params
   * @returns
   */
  private async handleJscramblerAnalysis(params) {
    try {
      const { url, line, column } = params.query || {};
      const data = await this.fetchUrlContent(url);
      const jscramblerSourceMap = data;
      const consumer = await new SourceMapConsumer(jscramblerSourceMap);
      const originalPosition = consumer.originalPositionFor({
        line: +line,
        column: +column,
      });
      if (!originalPosition?.source || !originalPosition?.line) {
        throw new Error('获取加固代码的行列信息失败');
      }
      consumer.destroy();
      return originalPosition;
    } catch (error) {
      const errMsg = `解析加固代码失败 ${error.message || error}`;
      throw new Error(errMsg);
    }
  }
  /**
   * 处理压缩代码解析
   * @param {*} url
   * @param {*} line
   * @param {*} column
   * @returns
   */
  private async handleZipAnalysis(url, line, column) {
    try {
      // console.log("-----压缩代码----", url, line, column);
      const data = await this.fetchUrlContent(url);
      const zipSourceMap = data;
      const consumer = await new SourceMapConsumer(zipSourceMap);
      const originalPosition = consumer.originalPositionFor({
        line: +line,
        column: +column,
      });
      if (!originalPosition.source) {
        throw new Error('获取源代码位置信息失败 请检查输入是否正确');
      }
      const sourceIndex = consumer.sources.findIndex((item) => item === originalPosition.source);
      const sourceContent = consumer?.sourcesContent[sourceIndex];
      const contentRowArr = sourceContent?.split('\n');
      const originalCode = this.getSurroundingCode(
        contentRowArr,
        originalPosition?.line,
        18, //动态指定
      );
      // console.log('----originalCode----', originalCode);
      consumer.destroy();
      return {
        originalPosition,
        originalCode,
      };
    } catch (error) {
      const errMsg = `${error.message || error}`;
      throw new Error(errMsg);
    }
  }

  /**
   * 动态决定返回代码行数
   * @param {*} contentRowArr
   * @param {*} line
   * @param {*} n  代码展示行数
   * @returns
   */
  private getSurroundingCode(contentRowArr, line, n) {
    const startLine = Math.max(0, line - Math.ceil(n / 2) - 1);
    const endLine = Math.min(contentRowArr.length, line + Math.floor(n / 2));
    const surroundingCode = contentRowArr.slice(startLine, endLine);
    return surroundingCode.map((code, index) => ({
      lineNumber: startLine + index + 1,
      code: code,
    }));
  }

  /**
   * 通过sourcemap解析源文件
   * @param params
   */
  async parserContent(params: { url: string; line: number; column: number }) {
    const { url, line, column } = params;
    try {
      // 获取源文件内容
      const data = await this.fetchUrlContent(url);
      // 获取源文件地址
      const baseUrl = url.substr(0, url.lastIndexOf('/'));
      // 获取sourcemap文件地址
      const sourcemapUrl = this.extractSourcemapUrl(data);
      if (!sourcemapUrl) {
        throw new Error('没找到该文件对应的sourcemap文件地址');
      }
      const mapUrl = `${baseUrl}/${sourcemapUrl}`;
      try {
        let originalPosition = {
          line: line,
          column: column,
        };
        let _url = mapUrl;
        const isJscrambler = mapUrl?.indexOf('.jscrambler.') > -1;
        if (isJscrambler) {
          originalPosition = await this.handleJscramblerAnalysis(params);
          _url = _url.replace(/\.jscrambler/g, '');
        }
        const original = await this.handleZipAnalysis(_url, originalPosition?.line, originalPosition?.column);

        return original;
      } catch (error) {
        const errMsg = `出错了: ${error.message || error}`;
        throw new Error(errMsg);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
