import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { BitbucketComplianceService } from 'src/bitbucket/services/compliance.bitbucket.service';
import { ComplianceSpmScanResultItem } from 'src/compliance/compliance.types';
import { KunlunLogger } from 'src/common/kunlun.logger';
import { readFile } from 'fs/promises'; // ES6 的异步文件读取
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generator from '@babel/generator';
import * as fs from 'fs';
import * as path from 'path';
import { InsightReposService } from 'src/insight/services/repos.insight.service';
import { ComplianceAtomic, ComplianceAtomicDocument } from '../schemas/compliance-atomic.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ComplianceScanReport, ComplianceScanReportDocument } from '../schemas/compliance-scan-report.schema';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';
import { wrapperLarkAppInterOpenLink } from 'src/lark/utils';

@Injectable()
export class ComplianceScanService {
  logger = new KunlunLogger(ComplianceScanService.name);

  // 国家代码数组
  AllCountryCodes = [
    'AE',
    'AL',
    'AM',
    'AR',
    'AT',
    'AU',
    'AZ',
    'BA',
    'BE',
    'BG',
    'BH',
    'BO',
    'BR',
    'CA',
    'CH',
    'CL',
    'CO',
    'CR',
    'CZ',
    'DE',
    'DK',
    'DO',
    'DZ',
    'EC',
    'EE',
    'EG',
    'ES',
    'FI',
    'FR',
    'GB',
    'GE',
    'GR',
    'GT',
    'HK',
    'HN',
    'HR',
    'HU',
    'ID',
    'IE',
    'IL',
    'IN',
    'IQ',
    'IR',
    'IS',
    'IT',
    'JO',
    'JP',
    'KE',
    'KR',
    'KW',
    'LB',
    'LT',
    'LU',
    'LV',
    'LY',
    'MA',
    'MK',
    'MT',
    'MX',
    'MY',
    'NI',
    'NL',
    'NO',
    'NZ',
    'OM',
    'PA',
    'PE',
    'PH',
    'PK',
    'PL',
    'PR',
    'PT',
    'PY',
    'QA',
    'RO',
    'RU',
    'SA',
    'SE',
    'SG',
    'SK',
    'SL',
    'SP',
    'SV',
    'SY',
    'TH',
    'TN',
    'TR',
    'TW',
    'UA',
    'US',
    'VN',
    'YE',
    'ZA',
  ];
  // 例外国家代码
  ExceptCountryCodes = ['TH', 'TR', 'CL', 'AU', 'EU'];
  // 忽略文件
  IgnoreRepoPath = {
    'g-biz': ['packages/gbiz-base/src/Countries.js'],
    'kucoin-main-web': ['src/common/meta/countries.js'],
    'public-web': ['src/common/meta/countries.js'],
    'seo-learn-web': ['src/common/meta/countries.js'],
    'marketing-growth-web': ['src/config/base.js'],
    'platform-operation-web': ['src/common/meta/countries.js', 'src/config/base.js'],
    'landing-web': ['src/meta/countries.js'],
    'ucenter-web': ['src/common/meta/countries.js'],
    'assets-web': [
      'src/routes/AssetsPage/Claim/Withdraw/containers/Main/CoinSelect/WithDrawCoinSelect/common/config.js',
    ],
    'payment-web': ['src/common/meta/countries.js', 'src/config/base.js'],
    'fast-coin-web': ['src/config/base.js'],
  };
  // 处理文件后缀
  ProcessFileSuffix = ['.js', '.jsx', '.ts', '.tsx'];

  constructor(
    private readonly bitbucketComplianceService: BitbucketComplianceService,
    private readonly insightReposService: InsightReposService,
    private readonly notificationLarkService: NotificationLarkService,
    private readonly configService: ConfigService,
    @InjectModel(ComplianceAtomic.name)
    private readonly complianceAtomicModel: Model<ComplianceAtomicDocument>,
    @InjectModel(ComplianceScanReport.name)
    private readonly complianceScanReportModel: Model<ComplianceScanReportDocument>,
  ) {
    //
  }

  /**
   * 获取 JavaScript/TS 文件内容
   * @param {String} dir - 代码仓库根目录
   * @param {Array} fileList - 用于存储文件路径
   */
  private getAllFiles(repo: string, dir: string, fileList = []): string[] {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        this.getAllFiles(repo, filePath, fileList);
      } else if (
        // 符合的文件后缀
        this.ProcessFileSuffix.some((suffix) => filePath.endsWith(suffix)) &&
        // 不在忽略列表中
        !this.IgnoreRepoPath[repo]?.some((ignorePath) => filePath.includes(ignorePath))
      ) {
        fileList.push(filePath);
      }
    });
    return fileList;
  }

  /**
   * 解析组件的注释内容
   * @param path
   * @returns
   */
  static resolveComment(path) {
    // 获取组件的注释内容
    let _comment = null;
    const leadingComments = path.node.leadingComments; // 从整个 JSXElement 节点检查注释
    const innerComments = path.node.innerComments; // 从 JSXElement 的子节点检查注释
    const trailingComments = path.node.trailingComments; // 从 JSXElement 的尾部检查注释
    if (leadingComments && leadingComments.length > 0) {
      // 遍历前置注释
      leadingComments.forEach((comment) => {
        if (comment.type === 'CommentLine') {
          // 提取单行注释的内容
          _comment = comment.value.trim();
        } else if (comment.type === 'CommentBlock') {
          // 提取块注释的内容
          _comment = comment.value.trim();
        }
      });
    } else if (innerComments && innerComments.length > 0) {
      // 遍历子节点注释
      innerComments.forEach((comment) => {
        if (comment.type === 'CommentLine') {
          // 提取单行注释的内容
          _comment = comment.value.trim();
        } else if (comment.type === 'CommentBlock') {
          // 提取块注释的内容
          _comment = comment.value.trim();
        }
      });
    } else if (trailingComments && trailingComments.length > 0 && path.node.loc.start.line === path.node.loc.end.line) {
      // 遍历尾部注释
      trailingComments.forEach((comment) => {
        if (comment.type === 'CommentLine') {
          // 提取单行注释的内容
          _comment = comment.value.trim();
        } else if (comment.type === 'CommentBlock') {
          // 提取块注释的内容
          _comment = comment.value.trim();
        }
      });
    } else {
      _comment = null; // 如果没有找到注释，则返回 null
    }
    return _comment;
  }

  /**
   * 处理合规中台规则
   * @param fileContent
   * @param results
   * @returns
   */
  private async processSpmCode(
    repo: string,
    slug: string,
    filePath: string,
    fileContent: string,
    results: ComplianceSpmScanResultItem[],
  ): Promise<ComplianceSpmScanResultItem[]> {
    let ast;
    try {
      // 将代码解析为 AST
      ast = parse(fileContent, {
        sourceType: 'module',
        plugins: [
          'jsx',
          'typescript', // 支持 JSX 和 TypeScript
          ['decorators', { decoratorsBeforeExport: true }], // 使用现代装饰器
        ],
        attachComment: true, // 附加注释
      });
    } catch (error) {
      this.logger.error(`解析文件 ${filePath} 时出错: ${error}`);
      return results;
    }

    try {
      traverse(ast, {
        /**
         * 提取 JSX 元素，比如
         * /\/\ 新币上线
         * <CompliantBox spam="compliance.homepage.newCoin.1"></CompliantBox>
         * 支持命名空间调用
         * <UI.CompliantBox spam="compliance.homepage.newCoin.1"></UI.CompliantBox>
         * 支持JSX的注释表达式子
         * {**\/ 新币上线 **}
         * <CompliantBox spam="compliance.homepage.newCoin.1" />
         * 支持spam传递变量的形式
         * <CompliantBox spam={newCoinSpm} />
         */
        JSXElement(path) {
          let componentName = null;
          // 从 JSXElement 的 openingElement 提取组件名称
          const openingElement = path.node.openingElement; // 提取开标签的信息
          // 提取组件名称
          if (openingElement.name.type === 'JSXIdentifier') {
            // 普通 JSX 标志符 <CompliantBox />
            componentName = openingElement.name.name;
          } else if (openingElement.name.type === 'JSXMemberExpression') {
            // 命名空间调用 JSX，如 <UI.CompliantBox />
            componentName = openingElement.name.property.name;
          }

          // 检查是否是目标组件（CompliantBox）
          if (componentName === 'CompliantBox') {
            // 获取组件的注释内容
            let _comment = null;
            // 查找前一个兄弟节点
            const siblingPath = path.getPrevSibling().getPrevSibling();
            if (siblingPath && siblingPath.node) {
              // 检查兄弟节点是否是 JSXExpressionContainer
              if (
                t.isJSXExpressionContainer(siblingPath.node) &&
                siblingPath.node.expression &&
                t.isJSXEmptyExpression(siblingPath.node.expression)
              ) {
                // 获取注释内容
                const innerComments = siblingPath.node.expression.innerComments;
                if (innerComments) {
                  _comment = innerComments.map((comment) => comment.value.trim()).join(' ');
                }
              }
            }
            if (!_comment) {
              _comment = null; // 如果没有找到注释，则返回 null
            }

            // 提取 spm 的值
            let spm = null;
            const attributes = openingElement.attributes || []; // 从 openingElement 的 attributes 提取属性
            attributes.forEach((attribute) => {
              if (attribute.type === 'JSXAttribute' && attribute.name.name === 'spm') {
                // 处理 spm 的值
                if (attribute.value.type === 'StringLiteral') {
                  spm = attribute.value.value; // 如果是字符串
                } else if (attribute.value.type === 'JSXExpressionContainer') {
                  const expression = attribute.value.expression;
                  if (expression.type === 'Identifier') {
                    // 如果是变量，如 { newCoinSpm }
                    spm = BitbucketComplianceService.resolveVariableValue(path, expression.name);
                  } else {
                    spm = null;
                  }
                }
              }
            });

            // 获取组件的位置
            const { start } = path.node.loc;

            // 保存结果
            results.push({
              type: 'CompliantBox',
              position: `Line: ${start.line}, Column: ${start.column}`,
              path: filePath,
              line: start.line,
              column: start.column,
              code: generator(path.node).code,
              spm,
              repo,
              slug,
              comment: _comment,
            });
          }
        },
        /**
         * 提取useCompliantShow变量声明, 比如
         * \/\/ 新币上线
         * const show = useCompliantShow('compliance.homepage.stepGuide.1')
         * 支持 spam 传递 变量的形式
         * const show = useCompliantShow(newCoinSpm)
         */
        VariableDeclaration(path) {
          path.node.declarations.forEach((declaration) => {
            if (declaration.init && declaration.init.type === 'CallExpression') {
              const callee = declaration.init.callee;

              // 检查函数调用是否是 useCompliantShow
              if (callee.type === 'Identifier' && callee.name === 'useCompliantShow') {
                const args = declaration.init.arguments || [];
                let spm = null;

                if (args.length > 0) {
                  const firstArg = args[0];

                  // 提取第一个参数的值
                  if (firstArg.type === 'StringLiteral') {
                    spm = firstArg.value; // 字符串直接赋值
                  } else if (firstArg.type === 'Identifier') {
                    // 如果是变量，如 useCompliantShow(newCoinSpm)
                    spm = BitbucketComplianceService.resolveVariableValue(path, firstArg.name);
                  } else {
                    // 其他类型的处理
                    spm = null;
                  }
                }

                // 提取注释
                let _comment = null;
                const leadingComments = path.node.leadingComments;
                if (leadingComments) {
                  leadingComments.forEach((comment) => {
                    if (comment.type === 'CommentLine') {
                      // 提取单行注释的内容，去掉 "//"
                      _comment = comment.value.trim();
                    } else if (comment.type === 'CommentBlock') {
                      // 提取块注释的内容
                      _comment = comment.value.trim();
                    }
                  });
                }

                // 获取位置
                const { start } = path.node.loc;

                // 保存结果
                results.push({
                  type: 'useCompliantShow',
                  spm,
                  position: `Line: ${start.line}, Column: ${start.column}`,
                  path: filePath,
                  line: start.line,
                  column: start.column,
                  code: generator(path.node).code,
                  comment: _comment,
                  repo,
                  slug,
                });
              }
            }
          });
        },
      });
    } catch (error) {
      this.logger.error(`遍历 ${filePath} AST 时出错: ${error}`);
      return results;
    }

    return results;
  }

  /**
   * 处理国家代码规则
   */
  private async processCountryCode(
    repo: string,
    slug: string,
    filePath: string,
    fileContent: string,
    results: ComplianceSpmScanResultItem[],
  ) {
    // 过滤掉例外国家代码
    const countryCodes = this.AllCountryCodes.filter((code) => !this.ExceptCountryCodes.includes(code)); // 过滤掉例外国家代码
    // 动态创建正则表达式: 支持单引号或双引号包裹的目标国家代码
    const regex = new RegExp(`(['"])(${countryCodes.join('|')})\\1`, 'g');
    // 按行拆分文件内容
    const lines = fileContent.split('\n'); // 按行分隔文件内容

    // 遍历每一行
    lines.forEach((line, lineIndex) => {
      let match;
      // 遍历这个行内的所有匹配位置
      while ((match = regex.exec(line)) !== null) {
        results.push({
          type: 'HardCodeCountryCode',
          position: `Line: ${lineIndex + 1}, Column: ${match.index + 1}`, // 行号和列号从 1 开始计数
          line: lineIndex + 1, // 行号从 1 开始计数
          column: match.index + 1, // 列号从 1 开始计数
          code: line,
          path: filePath, // 文件路径
          spm: null, // 没有 spm
          comment: null, // 没有注释
          repo, // 代码仓库
          slug,
        });
      }
    });
    return results;
  }

  /**
   * 解析单个文件，提取组件调用和注释
   * @param {String} filePath - 文件路径
   */
  private async processFile(filePath: string, repo: string, slug: string): Promise<ComplianceSpmScanResultItem[]> {
    // 读取文件内容
    const fileContent = await readFile(filePath, 'utf-8');

    // 结果数组
    const results: ComplianceSpmScanResultItem[] = [];

    // 处理中台合规逻辑
    await this.processSpmCode(repo, slug, filePath, fileContent, results);

    // 处理国家代码逻辑
    await this.processCountryCode(repo, slug, filePath, fileContent, results);

    return results;
  }

  /**
   * 扫描代码仓库的合规性
   * @param root
   * @param dir 默认只处理原代码目录
   * @returns
   */
  private async scanRepoComplianceCode(
    root: string,
    repo: string,
    slug: string,
    dir: string = 'src',
  ): Promise<ComplianceSpmScanResultItem[]> {
    let scanRoot = '';
    if (dir) {
      scanRoot = path.join(root, dir);
    }
    scanRoot = path.join(root, dir);
    // 扫描范围：扫描的文件列表
    const allFiles = this.getAllFiles(repo, scanRoot); // 获取所有 JS/TS 文件
    // 扫描结果数组
    const allResults: ComplianceSpmScanResultItem[] = [];
    for (const filePath of allFiles) {
      const result = await this.processFile(filePath, repo, slug);
      if (result.length > 0) {
        allResults.push(...result);
      }
    }
    // console.log('allResults', allResults);

    // 处理返回内容格式
    // 1. 去除根目录
    const results = allResults.map((item) => {
      return {
        ...item,
        path: BitbucketComplianceService.removeRoot(item.path, root), // 去除根目录
      };
    });
    return results;
  }

  /**
   * 扫描所有代码仓库的合规性
   * @param projects
   * @returns
   */
  async scanRepoComplianceCodeAll(repos: string[]) {
    const result = [];
    console.log('repos', repos);
    for (const repo of repos) {
      let _repo;
      try {
        _repo = await this.insightReposService.getRepoBySlug(repo);
        if (_repo === null) {
          this.logger.error(`「${repo}」代码仓库创建insight的仓库，跳过扫描`);
          continue;
        }
      } catch (error) {
        this.logger.error(`「${repo}」代码仓库读取接口失败，跳过扫描:${error}`);
        continue;
      }
      const { group, slug } = _repo;
      const codeBasePath = await this.bitbucketComplianceService.getProjectArchive(group, slug);
      // const codeBasePath = './.code/brisk-web';
      let dir = 'src';
      if (slug === 'g-biz') {
        dir = '';
      } else {
        dir = 'src';
      }
      this.logger.log(`[合规代码扫描]扫描「${repo}」代码仓库`);
      const res = await this.scanRepoComplianceCode(codeBasePath, repo, group, dir);

      this.logger.log(`[合规代码扫描]扫描「${repo}」处理数据`);
      await this.postprocessingData(res, repos);
      result.push(...res);
    }
    this.logger.log(`[合规代码扫描]全部仓库扫描完成`);
    return result;
  }

  /**
   * 后处理数据
   * @param data
   * @returns
   */
  async postprocessingData(data: ComplianceSpmScanResultItem[], repos: string[]) {
    const _data = await this.complianceAtomicModel
      .find({
        isDeleted: false,
      })
      .lean()
      .exec();
    const _dataWithUnique = _data
      .map((item) => {
        switch (item.type) {
          case 'CompliantBox':
            return { ...item, unique: item.repo + item.path + item.spm };
          case 'useCompliantShow':
            return { ...item, unique: item.repo + item.path + item.spm };
          case 'HardCodeCountryCode':
            return { ...item, unique: item.repo + item.path + item.code };
          default:
            return null;
        }
      })
      .filter((item) => item !== null);

    /**
     * 新增的数据
     */
    const increaseData = [];
    /**
     * 减少的数据
     */
    const decreaseData = [];
    /**
     * 未变更的数据
     */
    const unchangedData = [];

    data.forEach((item) => {
      let atomic = null;
      let _unique = null;
      switch (item.type) {
        case 'CompliantBox':
          _unique = item.repo + item.path + item.spm;
          atomic = _dataWithUnique.find((i) => i.unique === _unique);
          break;
        case 'useCompliantShow':
          _unique = item.repo + item.path + item.spm;
          atomic = _dataWithUnique.find((i) => i.unique === _unique);
          break;
        case 'HardCodeCountryCode':
          _unique = item.repo + item.path + item.code;
          atomic = _dataWithUnique.find((i) => i.unique === _unique);
          break;
        default:
          break;
      }
      // console.log('atomic', atomic);
      if (atomic) {
        if (_unique !== atomic.unique) {
          decreaseData.push(atomic);
        } else {
          unchangedData.push(atomic);
        }
      } else {
        increaseData.push(item);
      }
    });

    const _report = await this.saveReport(
      JSON.stringify({
        scanRepos: repos,
        countryCode: this.getCountryCodes(),
        fileScope: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ignore: Object.fromEntries(Object.entries(this.IgnoreRepoPath).filter(([key, _]) => repos.includes(key))),
          suffix: this.ProcessFileSuffix,
        },
      }),
      JSON.stringify(increaseData),
      JSON.stringify(decreaseData.filter((data) => !data.isSkip)),
      'v1',
    );

    if (increaseData.length > 0 || decreaseData.length > 0) {
      // 通知实现
      await this.notificationLarkService.sendComplianceCodeWarning({
        repos: repos.map((repo) => `- ${repo}`).join('\n'),
        country: this.getCountryCodes()
          .all.filter((code) => !this.ExceptCountryCodes.includes(code))
          .join(','),
        suffix: this.ProcessFileSuffix.join(','),
        ign_files: Object.entries(this.IgnoreRepoPath)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([key, _]) => repos.includes(key))
          .reduce((acc, [key, value]) => {
            value.forEach((item) => {
              acc.push(`- ${key}/${item}`);
            });
            return acc;
          }, [])
          .join('\n'),
        report_url: wrapperLarkAppInterOpenLink(
          this.configService.get('INSIGHT_URL') + '/report/compliance/detail/' + _report,
        ),
        add_num: increaseData.length,
        reduce_num: decreaseData.filter((data) => !data.isSkip).length,
      });
    }

    // console.log('increaseData', increaseData);
    // console.log('decreaseData', decreaseData);
    // console.log('unchangedData', unchangedData);

    // 处理新增的数据
    if (increaseData.length > 0) {
      await this.complianceAtomicModel.insertMany(
        increaseData.map((item) => {
          return {
            ...item,
            unique: undefined,
            isScanDeleted: false,
            isSkip: false,
            isDeleted: false,
            createdAt: new Date(),
          };
        }),
      );
    }

    // 处理未变更的数据
    if (unchangedData.length > 0) {
      await this.complianceAtomicModel.bulkWrite(
        unchangedData.map((item) => ({
          updateOne: {
            filter: { _id: item._id },
            update: {
              ...item,
              unique: undefined,
              isScanDeleted: false,
              updatedAt: new Date(),
            },
          },
        })),
      );
    }
    // 处理减少的数据
    if (decreaseData.length > 0) {
      await this.complianceAtomicModel.bulkWrite(
        decreaseData.map((item) => ({
          updateOne: {
            filter: { _id: item._id },
            update: {
              ...item,
              unique: undefined,
              isScanDeleted: true,
              updatedAt: new Date(),
            },
          },
        })),
      );
    }
  }

  /**
   * 保存合规扫描报告
   * @param addingItems
   * @param deletingItems
   * @param version
   */
  async saveReport(scanParams, addingItems, deletingItems, version = 'v1'): Promise<string> {
    const report = await this.complianceScanReportModel.create({
      scanParams,
      deletingItems,
      addingItems,
      version,
      createdAt: new Date(),
    });

    return report._id.toString();
  }

  /**
   * 获取国家代码
   * @returns
   */
  public getCountryCodes() {
    return {
      all: this.AllCountryCodes,
      except: this.ExceptCountryCodes,
    };
  }

  public getFileScope() {
    return {
      ignore: this.IgnoreRepoPath,
      suffix: this.ProcessFileSuffix,
    };
  }
}
