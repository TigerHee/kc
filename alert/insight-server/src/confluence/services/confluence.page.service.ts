import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cheerio from 'cheerio';
import { ConfluenceService } from './confluence.service';
import {
  APP_HYBRID_AUDIT_RECORD_PAGE_ID,
  PRD_IS_CONTENT_APP_STORE_KEY,
  PRD_IS_CONTENT_APP_STORE_KEY_VALUE,
  PRD_SEO_KEY,
  PRD_TEMPLATE_PAGE_ID,
  SEO_KEYS,
  TECH_KEYS,
  TECH_TEMPLATE_PAGE_ID,
} from '../constants/document.constants';
import { WikiErrors } from '../types/wiki.types';
import BasePageImplement from './base.page.implement';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const jsdom = require('jsdom');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const he = require('he');
const { JSDOM } = jsdom;

@Injectable()
export class ConfluenceDocumentService extends BasePageImplement {
  constructor(
    private readonly confluenceService: ConfluenceService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  /**
   * 主方法：从 HTML 中提取内容
   * @param element - HTML 内容字符串
   * @returns 解析后的数据数组
   */
  private async getContentFromHTML(
    element: string,
    version: number,
  ): Promise<{ needH5Audit: boolean; errors: WikiErrors[] }> {
    const $ = cheerio.load(element);

    // 获取评审表格内容
    const { prdLink, roleNumbers } = await this.getReviewTableContent($);

    // 解析 HTML 内容
    return this.extractContent($, roleNumbers, prdLink, version);
  }

  /**
   * 提取文档中的技术方案内容
   * @param $ - cheerio 的根对象
   * @param roleNumbers - 评审参与人数
   * @param prdLink - PRD 链接
   * @returns 解析结果数组
   */
  private async extractContent(
    $: cheerio.CheerioAPI,
    roleNumbers: number[],
    prdLink: {
      id: number;
      text: string;
    }[],
    version: number | undefined,
  ): Promise<{ needH5Audit: boolean | undefined; errors: WikiErrors[] }> {
    const parsedData: WikiErrors[] = [];
    const needH5Audit: boolean[] = [];

    for (const element of $('h3, h4')) {
      const title = $(element).text().trim();
      const matchedTitle = TECH_KEYS.find((key) => title.includes(key));
      if (!matchedTitle) continue; // 无匹配标题，跳过

      const contentElement = $(element).next();

      const { content, needH5Audit: _needH5Audit } = await this.processContent(
        matchedTitle,
        contentElement,
        roleNumbers,
        prdLink,
        version,
      );
      if (_needH5Audit) needH5Audit.push(_needH5Audit);
      if (content) parsedData.push({ title: matchedTitle, content });
    }

    const needH5AuditResult = version < 2 ? undefined : needH5Audit.some((audit) => audit);

    return { errors: parsedData, needH5Audit: needH5AuditResult };
  }

  /**
   * 处理标题对应的内容
   * @param title - 当前处理的标题
   * @param contentElement - 标题后的 HTML 元素
   * @param roleNumbers - 评审参与人数
   * @param prdLink - PRD 链接
   * @returns 解析结果或错误信息
   */
  private async processContent(
    title: string,
    contentElement: cheerio.Cheerio<any>,
    roleNumbers: number[],
    prdLink: {
      id: number;
      text: string;
    }[],
    version: number,
  ): Promise<{
    content: string | string[];
    needH5Audit: boolean | undefined;
  }> {
    if (title === '评审参与人') {
      return {
        content: roleNumbers.length < 2 ? '小于两人' : null,
        needH5Audit: version < 2 ? undefined : false,
      };
    }

    if (contentElement.find('li[data-inline-task-id]').length > 0) {
      const checkBoxData = this.extractCheckboxData(contentElement);
      const { content, needH5Audit } = await this.handleSpecialCases(title, checkBoxData, prdLink, version);
      return {
        content,
        needH5Audit: version < 2 ? undefined : needH5Audit,
      };
    }
    if (!this.extractTextContent(contentElement)) {
      return {
        content: '内容为空',
        needH5Audit: version < 2 ? undefined : false,
      };
    }
    return {
      content: null,
      needH5Audit: version < 2 ? undefined : false,
    };
  }

  /**
   * 提取复选框数据
   * @param contentElement - 包含复选框的 HTML 元素
   * @returns 复选框数据数组
   */
  private extractCheckboxData(contentElement: cheerio.Cheerio<any>): { text: string; checked: boolean }[] {
    const checkBox: { text: string; checked: boolean }[] = [];
    contentElement.find('li[data-inline-task-id]').each((_, li) => {
      const $li = cheerio.load(li);
      checkBox.push({
        text: $li('span.placeholder-inline-tasks').text().trim(),
        checked: $li(li).hasClass('checked'),
      });
    });
    return checkBox;
  }

  /**
   * 处理特定场景的逻辑
   * @param title - 当前处理的标题
   * @param checkBoxData - 复选框数据
   * @param prdLink - PRD 链接
   * @returns 错误信息或 null
   */
  private async handleSpecialCases(
    title: string,
    checkBoxData: { text: string; checked: boolean }[],
    prdLink: {
      id: number;
      text: string;
    }[],
    version: number,
  ): Promise<{
    content: string | string[];
    needH5Audit: boolean | undefined;
  }> {
    if (title === 'PRD链接') {
      // 只有在选择了"产品需求"时才请求 PRD 错误内容
      const selectedProductDemand = checkBoxData.some(({ text, checked }) => text.includes('产品需求') && checked);

      if (selectedProductDemand) {
        // 只有选择了产品需求时才请求
        const { prdErrors, needH5Audit } = await this.getPrdsErrors(prdLink, version);
        if (prdErrors.length > 0) {
          return {
            content: prdErrors, // 如果有错误，返回错误
            needH5Audit: version < 2 ? undefined : needH5Audit,
          };
        }
        return {
          content: null,
          needH5Audit: version < 2 ? undefined : needH5Audit,
        };
      }

      if (!checkBoxData.some(({ checked }) => checked)) {
        return {
          content: 'PRD链接未选择技术需求还是产品需求',
          needH5Audit: version < 2 ? undefined : false,
        };
      }

      return {
        content: null,
        needH5Audit: version < 2 ? undefined : false,
      };
    }

    if (title === '评审结果') {
      if (!checkBoxData.some(({ text, checked }) => text.includes('评审通过') && checked)) {
        return {
          content: '评审未通过或未选择',
          needH5Audit: version < 2 ? undefined : false,
        };
      }

      return {
        content: null,
        needH5Audit: version < 2 ? undefined : false,
      };
    }

    return {
      content: '',
      needH5Audit: version < 2 ? undefined : false,
    };
  }

  /**
   * 提取文本内容
   * @param contentElement - HTML 元素
   * @returns 提取到的文本或 null
   */
  private extractTextContent(contentElement: cheerio.Cheerio<any>): string | null {
    const allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul'];
    const tagName = contentElement.prop('tagName')?.toLowerCase() || '';
    if (!allowedTags.includes(tagName)) return null;

    return contentElement.is('ol, ul')
      ? contentElement.find('p').text().trim() || contentElement.text().trim()
      : contentElement.text().trim();
  }

  private getPagedIdFromUrl(url) {
    const match = url.match(/\/pages\/(\d+)/);
    const pageId = match ? match[1] : null;

    return pageId;
  }

  /**
   * 获取评审表格内容
   * @param $
   * @returns
   */
  private async getReviewTableContent($) {
    const prdLink = [];
    const roleNumbers = [];
    // 遍历所有的 table 元素
    $('table').each((index, table) => {
      // 查找当前 table 中包含 '产品PRD' 或 '参与人' 的行
      let roleFound = false;
      let participantFound = false;
      $(table)
        .find('th')
        .each((rowIndex, header) => {
          const headerText = $(header).text().trim(); // 获取该行的文本
          if (headerText === '角色') {
            roleFound = true;
          }
          if (headerText === '参与人') {
            participantFound = true;
          }
        });
      if (roleFound && participantFound) {
        $(table)
          .find('tr')
          .each((rowIndex, row) => {
            const participantText = $(row).find('td:last').text().trim(); // 获取最后一列参与人的文本内容
            if (participantText) {
              roleNumbers.push(participantText);
            }
          });
      } else {
        $(table)
          .find('tr')
          .each((rowIndex, row) => {
            const firstCellText = $(row).find('td:first').text().trim(); // 获取第一列的文本内容
            if (firstCellText.includes('产品PRD')) {
              const linkElement = $(row).find('td:last a'); // 查找最后一列中的链接
              // 检查是否有链接
              if (linkElement.length > 0) {
                prdLink.push({
                  id: this.getPagedIdFromUrl(linkElement.attr('href')),
                  text: $(linkElement).text(),
                });
              }
            }
          });
      }
    });
    return { prdLink, roleNumbers };
  }

  /**
   * 获取seo表格内容
   * 错误内容
   * @param html
   * @returns
   */
  private getSeoTableContent(html): string[] {
    const seoErrors = [];
    const dom = new JSDOM(html);
    let isFoundSeo = false;
    // 找到所有的表格
    const tables = dom.window.document.getElementsByTagName('table');
    if (tables.length > 0) {
      // 遍历所有的表格
      for (const table of tables) {
        // 找到表格中的所有行
        const rows = table.getElementsByTagName('tr');
        // 遍历所有的行
        for (const row of rows) {
          // 找到行中的所有单元格
          const cells = row.getElementsByTagName('td');
          // 如果单元格的数量大于1，检查第二个单元格的内容
          if (cells.length > 1) {
            // 获取单元格的内容
            const tdTag = cells[0].textContent.trim();
            const content = cells[1].textContent.trim();
            // 如果内容为空，输出项目的名称
            if (SEO_KEYS.includes(tdTag)) {
              isFoundSeo = true;
              if (content === '') {
                seoErrors.push('PRD中SEO的' + tdTag + '为空');
              }
            }
          }
        }
      }
    }
    if (isFoundSeo) {
      return seoErrors;
    } else {
      return ['Prd中未找到seo规范'];
    }
  }

  /**
   * 获取rn-h5 AppStore内容
   * 错误内容
   * @param html
   */
  private async getRnH5AppStoreContentAuditContent(html: string): Promise<{
    errors: string[];
    needH5Audit: boolean;
  }> {
    const str = this.removeHtmlTagsAndGetText(html ?? '');
    const trimmed = str.trim();

    const results = trimmed
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    // 找到是否通过APP商店内容审核
    const prdIndex = results.findIndex((prd) => prd.includes(PRD_IS_CONTENT_APP_STORE_KEY));

    if (prdIndex === -1) {
      return {
        errors: ['Prd中未找到「是否通过APP商店内容审核」标题'],
        needH5Audit: false,
      };
    }
    if (!results?.[prdIndex + 1]) {
      return {
        errors: ['Prd中「是否通过APP商店内容审核」内容错误'],
        needH5Audit: false,
      };
    }
    if (!PRD_IS_CONTENT_APP_STORE_KEY_VALUE.includes(results[prdIndex + 1])) {
      return {
        errors: ['Prd中「是否通过APP商店内容审核」值错误'],
        needH5Audit: false,
      };
    }
    const needH5Audit = results[prdIndex + 1].includes('不需要') ? false : true;
    // console.log('single.needH5Audit', needH5Audit);
    return {
      errors: [],
      needH5Audit,
    };
  }

  /**
   * @param html
   * @returns
   */
  private async getRnH5AppStoreAuditStatus(wikiPageId: number): Promise<boolean> {
    const { body } = await this.confluenceService.getArticleContent(APP_HYBRID_AUDIT_RECORD_PAGE_ID);
    const element = body?.view?.value ?? '';
    const $ = cheerio.load(element);
    let currentWikiAuditStatus = false;
    $('table').each((_, table) => {
      const rows = $(table).find('tr');
      rows.each((__, row) => {
        let isFound = false;
        $(row)
          ?.find('td')
          .each((_, cell) => {
            if ($(cell).find('a').attr('data-linked-resource-id') === wikiPageId.toString()) {
              isFound = true;
            }
          });
        if (isFound) {
          const checkboxData = this.extractCheckboxData($(row));
          checkboxData.forEach((checkbox) => {
            if (checkbox.text.includes('审核通过')) {
              currentWikiAuditStatus = checkbox.checked;
            }
          });
        }
      });
    });
    return currentWikiAuditStatus;
  }

  private async getPrdsErrors(
    prds,
    version: number,
  ): Promise<{ prdErrors: string[]; needH5Audit: boolean | undefined }> {
    let prdErrors = [];
    let needH5Audit = [];
    if (prds.length > 0) {
      await Promise.all(
        prds.map(async ({ id: url }) => {
          const pageId = Number(url);
          if (!isNaN(pageId)) {
            if (pageId === PRD_TEMPLATE_PAGE_ID) {
              prdErrors = [...prdErrors, '禁止使用PRD模版'];
            }
            const { errors, needH5Audit: _needH5Audit } = await this.getPrdContentFromUrl(pageId, version);
            prdErrors = [...prdErrors, ...errors];
            if (_needH5Audit) needH5Audit = [...needH5Audit, _needH5Audit];
          }
        }),
      );
    }
    return {
      prdErrors,
      needH5Audit: version < 2 ? undefined : needH5Audit.length === 0 ? false : needH5Audit.some((audit) => audit),
    };
  }

  /**
   * 从url获取prd内容
   * 获取错误信息
   * @param url
   * @returns
   */
  private async getPrdContentFromUrl(
    url,
    version: number,
  ): Promise<{
    errors: string[];
    needH5Audit: boolean | undefined;
  }> {
    const errors = [];
    const prd = await this.confluenceService.getArticleContent(url);
    if (!prd) {
      return {
        errors: [`Invalid Prd PageId ${url}`],
        needH5Audit: version < 2 ? undefined : false,
      };
    }
    const { body } = prd;
    const str = this.removeHtmlTagsAndGetText(body.view.value ?? '');
    const trimmed = str.trim();

    const results = trimmed
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    if (results.length === 0) {
      return {
        errors: ['Prd内容为空'],
        needH5Audit: version < 2 ? undefined : false,
      };
    }

    const prdIndex = results.findIndex((prd) => prd.includes(PRD_SEO_KEY));

    // 需要检查是否登录前可访问页面
    // 如果否（不需要登录），则不需要检查SEO
    if (prdIndex >= 0 && results[prdIndex + 1] && results[prdIndex + 1].includes('否')) {
      // 不需要SEO检查
    } else {
      const _seo_errors = await this.getSeoTableContent(body.view.value ?? '');
      errors.push(..._seo_errors);
    }

    let needH5AuditResult = undefined;
    if (version >= 2) {
      const { errors: _aso_error, needH5Audit } = await this.getRnH5AppStoreContentAuditContent(body.view.value ?? '');
      needH5AuditResult = needH5Audit;
      errors.push(..._aso_error);
    }

    return {
      errors,
      needH5Audit: version < 2 ? undefined : needH5AuditResult,
    };
  }

  private removeHtmlTagsAndGetText(html) {
    const regA = /<a[^>]*data-linked-resource-id=\"(\d+)\"[^>]*>(<u>)?([^<]+)(<\/u>)?<\/a>/g;
    const replaceA = html.replace(regA, (match, id) => id);
    const parsedHTML = replaceA.replace(/<(?:.|\n)*?>/gm, '\n');
    const decodedHTML = he.decode(parsedHTML);
    return decodedHTML;
  }

  /**
   * 检查wiki文档的状态
   * @param wikiPageId
   * @returns
   */
  public async getWikiData(
    wikiPageId: number,
    version: number,
  ): Promise<{
    pageId?: number;
    status: boolean;
    title?: string;
    url?: string;
    errors: {
      title: string;
      content: string | string[];
    }[];
    needH5Audit?: boolean;
    h5AuditStatus?: boolean;
  }> {
    console.log('getWikiData', wikiPageId, version);
    // 中间版本过渡版本 - confluence -> lark
    if (version === 2.1) {
      return {
        status: true,
        errors: [],
        url: this.configService.get<string>('LARK_WIKI_API_URL') + '/' + wikiPageId,
        pageId: wikiPageId,
        title: '',
        needH5Audit: false,
        h5AuditStatus: true,
      };
    }
    const { _links = {}, body, title } = await this.confluenceService.getArticleContent(wikiPageId);
    const element = body?.view?.value ?? '';
    let status = false;
    if (wikiPageId === TECH_TEMPLATE_PAGE_ID) {
      return {
        status,
        errors: [{ title: '禁止使用技术方案模版', content: '禁止使用技术方案模版' }],
      };
    }
    const { needH5Audit, errors } = await this.getContentFromHTML(element, version);
    status = errors.length === 0;
    let h5AuditStatus = undefined;
    if (version === 2) {
      h5AuditStatus = await this.getRnH5AppStoreAuditStatus(wikiPageId);
    }

    const wiki = {
      errors,
      pageId: wikiPageId,
      status,
      url: `${this.configService.get<string>('CONFLUENCE_API_URL')}/wiki${_links.webui}`,
      title: title,
      needH5Audit,
      h5AuditStatus,
    };
    return wiki;
  }
}
