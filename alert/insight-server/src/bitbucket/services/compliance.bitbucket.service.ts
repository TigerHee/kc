import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { BITBUCKET_HTTP_SERVICE_TOKEN } from '../bitbucket.http.module';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom } from 'rxjs'; // 让 Observable 转换成 Promise
import { AxiosResponse } from 'axios';
import * as AdmZip from 'adm-zip';
import { KunlunLogger } from 'src/common/kunlun.logger';

/**
 * REST API 1.0 文档
 * https://docs.atlassian.com/bitbucket-server/rest/5.16.0/bitbucket-rest.html
 */
@Injectable()
export class BitbucketComplianceService {
  version = '/rest/api/latest';
  logger = new KunlunLogger(BitbucketComplianceService.name);

  constructor(@Inject(BITBUCKET_HTTP_SERVICE_TOKEN) private readonly httpService: HttpService) {
    //
  }

  /**
   * 获取文件内容链接
   * @param slug
   * @param repo
   * @param file
   * @param line
   * @returns
   */
  static getProjectFilePositionLink(slug: string, repo: string, file: string, line: number) {
    return `https://bitbucket.kucoin.net/projects/${slug}/repos/${repo}/browse/${file}#${line}`;
  }

  /**
   * 解压 ZIP 文件到同名文件夹
   * @param zipFilePath ZIP 文件路径
   * @param outputDir 解压缩目录的父路径
   * @returns 解压后的文件夹路径
   */
  static unzipToSameNamedFolder(zipFilePath: string, outputDir: string): string {
    // 检查 ZIP 文件是否存在
    if (!fs.existsSync(zipFilePath)) {
      throw new InternalServerErrorException(`解压缩的文件不存在: ${zipFilePath}`);
    }

    // 获取 ZIP 文件的名字（无扩展名）
    const zipFileName = path.basename(zipFilePath, '.zip');

    // 计算解压的目标目录路径
    const targetPath = path.join(outputDir, zipFileName);

    // 如果目标目录不存在，则创建
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    // 解压缩文件到目标目录
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(targetPath, true); // 第二个参数 true 表示覆盖已有文件
    return targetPath;
  }

  /**
   * 解析变量值
   * @param {NodePath} path - 当前 AST 节点路径
   * @param {string} variableName - 要解析的变量名
   */
  static resolveVariableValue(path, variableName) {
    // 在作用域中查找变量
    const binding = path.scope.getBinding(variableName);
    if (binding && binding.path) {
      const bindingNode = binding.path.node;

      // 如果变量是用字符串初始化（const value = 'some-string'）
      if (bindingNode.type === 'VariableDeclarator' && bindingNode.init && bindingNode.init.type === 'StringLiteral') {
        return bindingNode.init.value; // 返回其字符串值
      }
    }

    // 如果无法解析
    return variableName; // 返回变量名本身
  }

  /**
   * 从路径中去除指定的根目录部分
   * @param {string} fullPath - 原始路径
   * @param {string} rootDir - 动态根目录
   * @returns {string} - 去除根目录后的路径
   */
  static removeRoot(fullPath, rootDir) {
    const relativePath = path.relative(rootDir, fullPath);
    return relativePath;
  }

  /**
   * 档案下载并且解压缩
   * 返回解压缩后的路径
   * @returns
   */
  async getProjectArchive(slug: string, repo: string): Promise<string> {
    let response: AxiosResponse = null;
    try {
      // 发送 GET 请求获取 ZIP 文件, 并将响应类型设置为流
      response = await firstValueFrom(
        this.httpService.get(`${this.version}/projects/${slug}/repos/${repo}/archive?format=zip`, {
          headers: {
            Accept: '*/*',
          },
          responseType: 'stream',
        }),
      );
      this.logger.log(`[合规代码扫描]获取「${repo}」压缩文件`);
    } catch (error) {
      throw new InternalServerErrorException(`bitbucket请求仓库接口失败: ${error}`);
    }

    const outputPath = path.join(process.cwd(), '.code');
    // 如果目录不存在
    if (!fs.existsSync(outputPath)) {
      // 创建目录
      fs.mkdirSync(outputPath, { recursive: true });
    }
    // 创建文件路径
    const filePath = path.join(outputPath, `${repo}.zip`);
    // 判断文件存不存在
    if (fs.existsSync(filePath)) {
      // 删除文件
      fs.unlinkSync(filePath);
    }
    // 写入流到文件
    const writer = fs.createWriteStream(filePath);
    // 使用 Promise 来处理流的写入
    await new Promise((resolve, reject) => {
      try {
        response.data.pipe(writer);
        response.data.on('error', (err) => {
          reject(new InternalServerErrorException('解压缩流读取失败:' + err.message));
        });
        writer.on('finish', resolve);
        writer.on('error', reject);
      } catch (error) {
        reject(new InternalServerErrorException('解压缩失败:' + error.message));
      }
    });

    // 解压缩zip文件
    const unzipPath = BitbucketComplianceService.unzipToSameNamedFolder(filePath, outputPath);
    this.logger.log(`[合规代码扫描]解压缩「${repo}」文件到 ${unzipPath}`);

    // 返回解压缩后的代码仓库路径
    return unzipPath;
  }
}
