import { Inject, Injectable, Logger } from '@nestjs/common';
import { PUPPETEER_BROWSER_TOKEN } from '../puppeteer.core.module';
import { ROUTER_PREFIX } from '../constants/puppeteer.constants';
import { ProjectRouteItem, PuppeteerInstance } from '../types/puppeteer.types';

@Injectable()
export class PuppeteerService {
  logger = new Logger(PuppeteerService.name);
  constructor(@Inject(PUPPETEER_BROWSER_TOKEN) private readonly puppeteer) {
    //
  }

  /**
   * 获取路由信息
   * @param url
   * @returns
   */
  async processPageForRoutes(instance: PuppeteerInstance, projectName: string, url: string): Promise<any[]> {
    const page = await instance.browser.newPage();
    try {
      this.logger.log(`Processing URL: ${url}`);
      await page.goto(url);

      await page.waitForFunction(
        () => {
          return window.__KC_CRTS__ && Array.isArray(window.__KC_CRTS__) && window.__KC_CRTS__.length > 0;
        },
        { timeout: 20000 },
      );

      // 检查是否发生了重定向
      const currentUrl = page.url();
      if (currentUrl !== url) {
        throw new Error(`URL redirected to ${currentUrl}`);
      }

      // 获取页面的路由信息
      const kcCertsString = await page.evaluate(() => JSON.stringify(window.__KC_CRTS__));
      const routes = JSON.parse(kcCertsString).flat(1);

      return this.filterProjectRoutes(projectName, routes);
    } finally {
      // 确保页面被关闭
      await page.close();
    }
  }

  // 1. 如果是 deleted 的，则不管
  // 2. 如果在新的路由已经没有了，则删除
  // 3. 如果是新增的，则放进去
  async diffRoutes(
    oldRoutes,
    newRoutes: {
      path: string;
      isIgnore: boolean;
      tenant: string[];
    }[],
  ) {
    const newPathMap = new Map(newRoutes.map((item) => [item.path, item]));

    // 初始化更新和新增列表
    const routesToUpdate = [];
    const routesToAdd = [];

    // 处理旧路由
    oldRoutes.forEach((item) => {
      if (item.isDeleted) {
        return; // 已删除的路由保留，无需操作
      }

      const newRoute = newPathMap.get(item.path);
      if (!newRoute) {
        // 如果新路由中不存在，标记为已删除
        routesToUpdate.push({ ...item, isDeleted: true });
      } else {
        // 检查是否需要更新
        const needsUpdate = (item.tenant || []).join(',') !== newRoute.tenant.join(',');

        if (needsUpdate) {
          routesToUpdate.push({
            ...item,
            tenant: newRoute.tenant,
          });
        }
        // 从新路由中移除，避免后续重复处理
        newPathMap.delete(item.path);
      }
    });

    // 剩下的新路由需要新增
    newPathMap.forEach((newRoute) => {
      routesToAdd.push(newRoute);
    });

    return { routesToUpdate, routesToAdd };
  }

  /**
   * 获取单项目路由信息
   * @param projectName
   * @param accessibleLink
   * @returns
   */
  async getProjectRoutes({ projectName, accessibleLink }: ProjectRouteItem): Promise<any[]> {
    const instance: PuppeteerInstance = await this.puppeteer.launch(projectName);

    try {
      return await this.processPageForRoutes(instance, projectName, accessibleLink);
    } catch (e) {
      this.logger.error(`getProjectRoutes error: ${JSON.stringify(e.message)}, url: ${accessibleLink}`);
      throw new Error(e);
    } finally {
      // 确保浏览器实例被关闭
      if (instance) {
        await this.puppeteer.destroy(instance);
      }
    }
  }

  /**
   * 获取 仓库下所有 routes
   * @param projectName
   * @param routes
   * @returns
   */
  async filterProjectRoutes(projectName, routes) {
    const targetRoutes = routes
      .filter((item) => !!item.path) // 过滤掉没有 path 的路由
      .map((item) => {
        const hasRouterPrefix = ROUTER_PREFIX.find(({ slug }) => slug === projectName);
        const isIgnore = ['/404', '*'].includes(item.path);
        const pathIgnore = '*' === item.path;
        const route = {
          path: hasRouterPrefix && !pathIgnore ? `${hasRouterPrefix.prefix}${item.path}` : item.path,
          isIgnore,
          tenant: item.activeBrandKeys || [],
        };

        return route;
      });

    return targetRoutes;
  }
}
