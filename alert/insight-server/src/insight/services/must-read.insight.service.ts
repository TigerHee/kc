import { Injectable } from '@nestjs/common';
import { MustReadWikiList, MustReadWikiListDocument, ViewerItem } from '../schemas/must-read-wiki-list.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfluenceService } from 'src/confluence/services/confluence.service';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { PageViews, WikiUser } from 'src/confluence/types/wiki.types';
import { ConfigService } from '@nestjs/config';
import { KunlunLogger } from 'src/common/kunlun.logger';
const logger = new KunlunLogger('MustReadInsightService');

@Injectable()
export class MustReadInsightService {
  constructor(
    @InjectModel(MustReadWikiList.name)
    private readonly mustReadWikiListModel: Model<MustReadWikiListDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly confluenceService: ConfluenceService,
    private readonly configService: ConfigService,
  ) {
    //
  }

  /**
   * 获取必读文章列表
   * @returns
   */
  async getMustReadWikiList() {
    const list = await this.mustReadWikiListModel.find({
      status: true,
    });
    const total = await this.mustReadWikiListModel.countDocuments({
      status: true,
    });
    return {
      list,
      total,
    };
  }

  /**
   * 获取所有文章列表
   */
  private async getAllList() {
    return this.mustReadWikiListModel.find({
      status: true,
    });
  }

  /**
   * 获取文章列表状态，通过用户id
   * @param id
   * @returns
   */
  async getMustReadWikiReadStatusByUserId(id: string) {
    const data = await this.getAllList();
    const result = data.map((item) => {
      const viewer = item.viewers
        .filter((viewer) => viewer.userId !== null)
        .find((viewer) => viewer.userId.toString() === new Types.ObjectId(id).toString());
      const readStatus = viewer
        ? viewer.lastVersionViewedNumber === item.lastVersion
          ? 'success'
          : 'warning'
        : 'error';
      return {
        title: item.title,
        url: item.url,
        lastVersion: item.lastVersion,
        updatedAt: item.updatedAt,
        viewers: viewer,
        readStatus: readStatus,
        status: item.status,
      };
    });
    return result;
  }

  /**
   * 新增必读文章
   */
  async addMustReadWiki(data: Pick<MustReadWikiListDocument, 'pageId'>) {
    // 判断是否已经存在
    const exist = await this.mustReadWikiListModel.findOne({
      pageId: data.pageId,
      status: true,
    });
    if (exist) {
      throw new Error('文档已经存在');
    }

    const result = await this.getMustReadWikiService(data.pageId);
    const { version, contentAnalyticsViewsByUser } = result;
    const { pageViews } = contentAnalyticsViewsByUser;
    const viewerItem = await this.getAndCheckUserProfile(pageViews);
    const { _links = {}, title } = await this.confluenceService.getArticleContent(data.pageId);

    return await this.mustReadWikiListModel.create({
      ...data,
      status: true,
      lastVersion: version.number,
      viewers: viewerItem,
      title: title,
      url: `${this.configService.get<string>('CONFLUENCE_API_URL')}/wiki${_links.webui}`,
    });
  }

  /**
   * 刷新必读文章列表
   */
  async refreshMustReadWikiList() {
    const data = await this.getAllList();
    await Promise.all(
      data.map(async (item) => {
        await this.refreshMustReadWiki(item.pageId.toString());
      }),
    );
    return true;
  }

  /**
   * 刷新必读文章(单条)
   * @param id
   * @returns
   */
  async refreshMustReadWiki(pageId: string) {
    const data = await this.getMustReadWikiService(Number(pageId));
    const { version, contentAnalyticsViewsByUser } = data;
    const { pageViews } = contentAnalyticsViewsByUser;
    const viewerItem = await this.getAndCheckUserProfile(pageViews);
    const { _links = {}, title } = await this.confluenceService.getArticleContent(Number(pageId));
    return await this.mustReadWikiListModel.updateOne(
      {
        pageId: Number(pageId),
        status: true,
      },
      {
        lastVersion: version.number,
        viewers: viewerItem,
        title: title,
        url: `${this.configService.get<string>('CONFLUENCE_API_URL')}/wiki${_links.webui}`,
        updatedAt: new Date().toISOString(),
      },
    );
  }

  /**
   * 删除必读文章
   * @param pageId
   * @returns
   */
  async deleteMustReadWiki(pageId: string) {
    return await this.mustReadWikiListModel.updateOne(
      {
        pageId: Number(pageId),
        status: true,
      },
      {
        status: false,
      },
    );
  }

  /**
   * 获取必读文章
   * @param id
   * @returns
   */
  private async getMustReadWikiService(id: number) {
    const data = await this.confluenceService.getArticleViewer(id);
    return data;
  }

  /**
   * 获取用户信息
   * @param pageViews
   * @returns
   */
  private async getAndCheckUserProfile(pageViews: PageViews[]): Promise<ViewerItem[]> {
    // 过滤掉未激活的用户
    const _pageViews = pageViews.filter((pageView) => pageView.userProfile.isActive);
    const viewerItems: ViewerItem[] = await Promise.all(
      _pageViews.map(async (pageView) => {
        // console.log('pageView:', '[displayName]', pageView.userProfile.displayName, '[id]', pageView.userProfile.id);
        let user = await this.userModel.findOne({ wikiId: pageView.userProfile.id });
        if (!user) {
          const wikiUser = await this.confluenceService.getUserInfoByApi(pageView.userProfile.id);
          if (!wikiUser) {
            console.error('woops, DB wikiUser is null', pageView.userProfile.displayName);
            return null;
          }
          logger.log(
            `[请求接口]: displayName' ${wikiUser.displayName}  id' ${wikiUser.accountId}  email' ${wikiUser.email} `,
          );
          await this.verboseUpdateUserOne(wikiUser, pageView.userProfile.id);
          user = await this.userModel.findOne({ wikiId: pageView.userProfile.id });
        }
        if (!user) {
          // console.log('[undefined]:', pageView.userProfile.displayName, pageView.userProfile.id);
          return {
            userId: null,
            displayName: pageView.userProfile.displayName,
            views: pageView.views,
            lastViewedAt: pageView.lastViewedAt,
            lastVersionViewedNumber: pageView.lastVersionViewedNumber,
            lastVersionViewedUrl: pageView.lastVersionViewedUrl,
          };
        }
        return {
          userId: user._id as string,
          displayName: user.name,
          views: pageView.views,
          lastViewedAt: pageView.lastViewedAt,
          lastVersionViewedNumber: pageView.lastVersionViewedNumber,
          lastVersionViewedUrl: pageView.lastVersionViewedUrl,
        };
      }),
    );
    return viewerItems.filter((item) => item !== null);
  }

  /**
   * 更新用户 wikiId 信息
   */
  private async verboseUpdateUserOne(wikiUser: WikiUser, wikiId: string) {
    const res1 = await this.userModel.updateOne(
      {
        // 正则匹配，必须忽略大小写
        email: new RegExp(wikiUser.email, 'i'),
      },
      {
        wikiId: wikiId,
      },
    );
    if (res1.modifiedCount === 0) {
      const res2 = await this.userModel.updateOne(
        {
          name: wikiUser.displayName,
        },
        {
          wikiId: wikiId,
        },
      );

      if (res2.modifiedCount === 0) {
        await this.userModel.updateOne(
          {
            bkEmail: new RegExp(wikiUser.email, 'i'),
          },
          {
            name: wikiUser.displayName,
            wikiId: wikiId,
          },
        );
      }
    }
  }
}
