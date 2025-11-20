/**
 * 产物管理，文件目录等新建和删除
 * Owner: hanx.wei@kupotech.com
 */
const path = require('path');
const fse = require('fs-extra');
const { execSync, promisifyExec } = require('@utils/exec');
const robot = require('@app/master/robot');
const logger = require('@app/master/logger');
// const wait = require('@utils/wait');

// 删除逻辑后续会移除掉，不删除文件直接覆盖
class BaseRouteSetRemover {
  constructor(options) {
    const { allLangs, projectConfig, excludeDirs } = options;
    this.projectConfig = projectConfig;
    this.excludeDirsSet = new Set(excludeDirs);
    this.excludeDirsWithLangSet = new Set([...allLangs, ...excludeDirs]);
  }

  removeRouteSetDir(langs, routeSetNames, theme) {
    const projectThemeDistConfig = this.projectConfig.distConfig[theme];
    const projectDistCopyPath = projectThemeDistConfig.projectDistCopyPath;
    const projectMobileDistCopyPath =
      projectThemeDistConfig.projectMobileDistCopyPath;
    if (typeof routeSetNames === 'string') {
      routeSetNames = [routeSetNames];
    }
    for (const routeSetName of routeSetNames) {
      langs.forEach(lang => {
        const dir =
          lang === 'en'
            ? path.join(projectDistCopyPath, routeSetName)
            : path.join(projectDistCopyPath, lang, routeSetName);
        fse.removeSync(dir);
        if (this.projectConfig.mobileGen) {
          const mobileDir =
            lang === 'en'
              ? path.join(projectMobileDistCopyPath, routeSetName)
              : path.join(projectMobileDistCopyPath, lang, routeSetName);
          fse.removeSync(mobileDir);
        }
      });
    }
  }

  removeDefault(langs, theme, isApp = false) {
    const projectThemeDistConfig = this.projectConfig.distConfig[theme];
    if (isApp === false) {
      const projectDistCopyPath = projectThemeDistConfig.projectDistCopyPath;
      this._removeDefaultFiles(langs, projectDistCopyPath);
      if (this.projectConfig.mobileGen) {
        const projectMobileDistCopyPath =
          projectThemeDistConfig.projectMobileDistCopyPath;
        this._removeDefaultFiles(langs, projectMobileDistCopyPath);
      }
    } else {
      const projectAppDistCopyPath =
        projectThemeDistConfig.projectAppDistCopyPath;
      this._removeDefaultFiles(langs, projectAppDistCopyPath);
    }
  }

  _removeDefaultFiles(langs, projectDistCopyPath) {
    for (const lang of langs) {
      if (lang === 'en') {
        const files = fse.readdirSync(projectDistCopyPath);
        files
          .filter(file => !this.excludeDirsWithLangSet.has(file))
          .forEach(file => {
            fse.removeSync(path.join(projectDistCopyPath, file));
          });
      } else {
        const langDir = path.join(projectDistCopyPath, lang);
        if (!fse.existsSync(langDir)) continue;
        const files = fse.readdirSync(langDir);
        files
          .filter(file => !this.excludeDirsSet.has(file))
          .forEach(file => {
            fse.removeSync(path.join(projectDistCopyPath, lang, file));
          });
      }
    }
  }
}

class PublicRouteSetsRemover extends BaseRouteSetRemover {
  constructor(options) {
    super({
      ...options,
      excludeDirs: [],
    });
  }

  removeRouteSetFiles(langs, routeSetName, theme) {
    switch (routeSetName) {
      case 'default':
        this.removeDefault(langs, theme);
        break;
      default:
        logger.error(`invalid public-web routeSet ${routeSetName}`);
    }
  }
}

class KucoinMainWebRouteSetsRemover extends BaseRouteSetRemover {
  constructor(options) {
    super({
      ...options,
      excludeDirs: [],
    });
  }

  removeRouteSetFiles(langs, routeSetName, theme) {
    switch (routeSetName) {
      case 'default':
        this.removeDefault(langs, theme);
        break;
      default:
        logger.error(`invalid kucoin-main-web routeSet ${routeSetName}`);
    }
  }
}

class MarketingGrowthRouteSetsRemover extends BaseRouteSetRemover {
  constructor(options) {
    super({
      ...options,
      excludeDirs: [],
    });
  }

  removeRouteSetFiles(langs, routeSetName, theme) {
    switch (routeSetName) {
      case 'default':
        this.removeDefault(langs, theme);
        break;
      case 'app-default':
        this.removeDefault(langs, theme, true);
        break;
      default:
        logger.error(`invalid marketing-growth-web routeSet ${routeSetName}`);
    }
  }
}

class KucoinSeoWebRouteSetsRemover extends BaseRouteSetRemover {
  constructor(options) {
    super({
      ...options,
      excludeDirs: ['how-to-buy', 'converter'],
    });
  }

  removeRouteSetFiles(langs, routeSetName, theme) {
    switch (routeSetName) {
      case 'how-to-buy':
      case 'converter':
        this.removeRouteSetDir(langs, routeSetName, theme);
        break;
      default:
        logger.error(`invalid kucoin-seo-web routeSet ${routeSetName}`);
    }
  }
}

class SeoSitemapWebRouteSetRemover extends BaseRouteSetRemover {
  constructor(options) {
    super({
      ...options,
      excludeDirs: ['sitemap'],
    });
  }

  removeRouteSetFiles(langs, routeSetName, theme) {
    switch (routeSetName) {
      case 'sitemap':
        this.removeRouteSetDir(langs, routeSetName, theme);
        break;
      default:
        logger.error(`invalid seo-sitemap-web routeSet ${routeSetName}`);
    }
  }
}

class SeoLearnWebRouteSetsRemover extends BaseRouteSetRemover {
  constructor(options) {
    super({
      ...options,
      excludeDirs: ['learn'],
    });
  }

  removeRouteSetFiles(langs, routeSetName, theme) {
    switch (routeSetName) {
      case 'learn':
        this.removeRouteSetDir(langs, routeSetName, theme);
        break;
      default:
        logger.error(`invalid seo-learn-web routeSet ${routeSetName}`);
    }
  }
}
class MarginWebRouteSetsRemover extends BaseRouteSetRemover {
  constructor(options) {
    super({
      ...options,
      excludeDirs: [],
    });
  }

  removeRouteSetFiles(langs, routeSetName, theme) {
    switch (routeSetName) {
      case 'default':
        this.removeDefault(langs, theme);
        break;
      default:
        logger.error(`invalid margin-web-3.0 routeSet ${routeSetName}`);
    }
  }
}
class CustomerWebRouteSetRemover extends BaseRouteSetRemover {
  constructor(options) {
    super({
      ...options,
      excludeDirs: ['support'],
    });
  }

  removeRouteSetFiles(langs, routeSetName, theme) {
    switch (routeSetName) {
      case 'support':
        this.removeRouteSetDir(langs, routeSetName, theme);
        break;
      default:
        logger.error(`invalid customer-web routeSet ${routeSetName}`);
    }
  }
}
class NewsWebRouteSetsRemover extends BaseRouteSetRemover {
  constructor(options) {
    super({
      ...options,
      excludeDirs: ['news'],
    });
  }

  removeRouteSetFiles(langs, routeSetName, theme) {
    switch (routeSetName) {
      case 'news':
        this.removeRouteSetDir(langs, routeSetName, theme);
        break;
      case 'learn-and-earn':
        this.removeRouteSetDir(langs, routeSetName, theme);
        break;
      default:
        logger.error(`invalid news-web routeSet ${routeSetName}`);
    }
  }
}

class SeoCmsWebRouteSetsRemover extends BaseRouteSetRemover {
  constructor(options) {
    super({
      ...options,
      excludeDirs: ['announcement', 'blog'],
    });
  }

  removeRouteSetFiles(langs, routeSetName, theme) {
    switch (routeSetName) {
      case 'announcement':
      case 'blog':
        this.removeRouteSetDir(langs, routeSetName, theme);
        break;
      default:
        logger.error(`invalid seo-cms-web routeSet ${routeSetName}`);
    }
  }
}

class SeoPriceWebRouteSetsRemover extends BaseRouteSetRemover {
  constructor(options) {
    super({
      ...options,
      excludeDirs: ['price'],
    });
  }

  removeRouteSetFiles(langs, routeSetName, theme) {
    switch (routeSetName) {
      case 'default':
        this.removeDefault(langs, theme);
        break;
      case 'price':
        this.removeRouteSetDir(langs, routeSetName, theme);
        break;
      default:
        logger.error(`invalid seo-cms-web routeSet ${routeSetName}`);
    }
  }
}

class FileManager {
  constructor(options) {
    this.allLangs = options.allLangs;
    this.globalSupportThemes = options.globalSupportThemes;
    this.rootDistConfigs = options.rootDistConfigs;
    this.projectConfigs = options.projectConfigs;
    this.projectRemovers = {
      'public-web': new PublicRouteSetsRemover({
        allLangs: options.allLangs,
        projectConfig: options.projectConfigs['public-web'],
      }),
      'kucoin-main-web': new KucoinMainWebRouteSetsRemover({
        allLangs: options.allLangs,
        projectConfig: options.projectConfigs['kucoin-main-web'],
      }),
      'kucoin-seo-web': new KucoinSeoWebRouteSetsRemover({
        allLangs: options.allLangs,
        projectConfig: options.projectConfigs['kucoin-seo-web'],
      }),
      'marketing-growth-web': new MarketingGrowthRouteSetsRemover({
        allLangs: options.allLangs,
        projectConfig: options.projectConfigs['marketing-growth-web'],
      }),
      'seo-learn-web': new SeoLearnWebRouteSetsRemover({
        allLangs: options.allLangs,
        projectConfig: options.projectConfigs['seo-learn-web'],
      }),
      'seo-sitemap-web': new SeoSitemapWebRouteSetRemover({
        allLangs: options.allLangs,
        projectConfig: options.projectConfigs['seo-sitemap-web'],
      }),
      'margin-web-3.0': new MarginWebRouteSetsRemover({
        allLangs: options.allLangs,
        projectConfig: options.projectConfigs['margin-web-3.0'],
      }),
      'customer-web': new CustomerWebRouteSetRemover({
        allLangs: options.allLangs,
        projectConfig: options.projectConfigs['customer-web'],
      }),
      'news-web': new NewsWebRouteSetsRemover({
        allLangs: options.allLangs,
        projectConfig: options.projectConfigs['news-web'],
      }),
      'seo-cms-web': new SeoCmsWebRouteSetsRemover({
        allLangs: options.allLangs,
        projectConfig: options.projectConfigs['seo-cms-web'],
      }),
      'seo-price-web': new SeoPriceWebRouteSetsRemover({
        allLangs: options.allLangs,
        projectConfig: options.projectConfigs['seo-price-web'],
      }),
    };
  }

  initDirs() {
    // 创建必要的文件夹
    for (const theme in this.rootDistConfigs) {
      const themeRootDistConfigs = this.rootDistConfigs[theme];
      const {
        distDirPath,
        distDirDefaultPath,
        distDirMobilePath,
        distDirAppPath,
        distCopyDirPath,
        distCopyDirDefaultPath,
        distCopyDirMobilePath,
        distCopyDirAppPath,
        tempDistPath,
        tempDistDefaultPath,
        tempDistMobilePath,
        tempDistAppPath,
      } = themeRootDistConfigs;
      fse.ensureDirSync(distDirPath);
      fse.ensureDirSync(distDirDefaultPath);
      fse.ensureDirSync(distDirMobilePath);
      fse.ensureDirSync(distDirAppPath);
      fse.ensureDirSync(distCopyDirPath);
      fse.ensureDirSync(distCopyDirDefaultPath);
      fse.ensureDirSync(distCopyDirMobilePath);
      fse.ensureDirSync(distCopyDirAppPath);
      fse.ensureDirSync(tempDistPath);
      fse.ensureDirSync(tempDistDefaultPath);
      fse.ensureDirSync(tempDistMobilePath);
      fse.ensureDirSync(tempDistAppPath);
    }
  }

  // 暂时所有目录都生成一次
  ensureProjectDistDirLink(projectConfig) {
    for (const theme in projectConfig.distConfig) {
      const themeRootDistConfigs = this.rootDistConfigs[theme];
      const projectThemeDistConfig = projectConfig.distConfig[theme];
      // 建立空目录软链
      if (!fse.existsSync(projectThemeDistConfig.projectDistPath)) {
        let relativeDir = '../temp/default';
        if (theme !== this.globalSupportThemes.THEME_DEFAULT) {
          relativeDir = `../temp/default-${theme}`;
        }

        if (projectConfig.distDirName.includes('/')) {
          const parentDir = projectConfig.distDirName.split('/')[0];
          const lsExecString = `cd ${themeRootDistConfigs.distDirDefaultPath} && ln -sf ${relativeDir}/${parentDir} ./${parentDir}`;
          execSync(lsExecString);
        } else {
          execSync(
            `cd ${themeRootDistConfigs.distDirDefaultPath} && ln -sf ${relativeDir}/${projectConfig.distDirName} ./${projectConfig.distDirName}`
          );
        }
      }
      if (
        projectConfig.mobileGen &&
        !fse.existsSync(projectThemeDistConfig.projectMobileDistPath)
      ) {
        let relativeDir = '../temp/mobile';
        if (theme !== this.globalSupportThemes.THEME_DEFAULT) {
          relativeDir = `../temp/mobile-${theme}`;
        }

        if (projectConfig.distDirName.includes('/')) {
          const parentDir = projectConfig.distDirName.split('/')[0];
          const lsExecString = `cd ${themeRootDistConfigs.distDirMobilePath} && ln -sf ${relativeDir}/${parentDir} ./${parentDir}`;
          execSync(lsExecString);
        } else {
          execSync(
            `cd ${themeRootDistConfigs.distDirMobilePath} && ln -sf ${relativeDir}/${projectConfig.distDirName} ./${projectConfig.distDirName}`
          );
        }
      }
      if (!fse.existsSync(projectThemeDistConfig.projectAppDistPath)) {
        let relativeDir = '../temp/app';
        if (theme !== this.globalSupportThemes.THEME_DEFAULT) {
          relativeDir = `../temp/app-${theme}`;
        }

        if (projectConfig.distDirName.includes('/')) {
          const parentDir = projectConfig.distDirName.split('/')[0];
          const lsExecString = `cd ${themeRootDistConfigs.distDirAppPath} && ln -sf ${relativeDir}/${parentDir} ./${parentDir}`;
          execSync(lsExecString);
        } else {
          execSync(
            `cd ${themeRootDistConfigs.distDirAppPath} && ln -sf ${relativeDir}/${projectConfig.distDirName} ./${projectConfig.distDirName}`
          );
        }
      }
    }
  }

  ensureProjectDirForAll(projectName, ensure = true) {
    const projectConfig = this.projectConfigs[projectName];
    robot.info(`清理 ${projectName} 项目文件`);
    logger.info(`清理 ${projectName} 项目文件`);
    // 更新产物目录
    const timestamp = Date.now();
    for (const theme in projectConfig.distConfig) {
      const projectThemeDistConfig = projectConfig.distConfig[theme];
      // default
      if (fse.existsSync(projectThemeDistConfig.projectDistCopyPath)) {
        fse.moveSync(
          projectThemeDistConfig.projectDistCopyPath,
          `${projectThemeDistConfig.projectDistCopyPath}-${timestamp}`
        );
        promisifyExec(
          `rm -rf ${projectThemeDistConfig.projectDistCopyPath}-${timestamp}`
        )
          .then(() => {
            logger.info(
              `${projectThemeDistConfig.projectDistCopyPath}-${timestamp} removed`
            );
            robot.info(`${projectName} 项目 ${theme} 复制文件已删除`);
          })
          .catch(err => {
            logger.error(
              `remove ${projectThemeDistConfig.projectDistCopyPath}-${timestamp} Error`,
              err
            );
            console.error(err);
          });
      }
      if (fse.existsSync(projectThemeDistConfig.projectTempDistPath)) {
        fse.moveSync(
          projectThemeDistConfig.projectTempDistPath,
          `${projectThemeDistConfig.projectTempDistPath}-${timestamp}`
        );
        promisifyExec(
          `rm -rf ${projectThemeDistConfig.projectTempDistPath}-${timestamp}`
        )
          .then(() => {
            logger.info(
              `${projectThemeDistConfig.projectTempDistPath}-${timestamp} removed`
            );
            robot.info(`${projectName} 项目 ${theme} 生产文件已删除`);
          })
          .catch(err => {
            logger.error(
              `remove ${projectThemeDistConfig.projectTempDistPath}-${timestamp} Error`,
              err
            );
            console.error(err);
          });
      }
      if (ensure) {
        fse.ensureDirSync(projectThemeDistConfig.projectDistCopyPath);
        fse.ensureDirSync(projectThemeDistConfig.projectTempDistPath);
      }
      // mobile
      if (projectConfig.mobileGen) {
        if (fse.existsSync(projectThemeDistConfig.projectMobileDistCopyPath)) {
          fse.moveSync(
            projectThemeDistConfig.projectMobileDistCopyPath,
            `${projectThemeDistConfig.projectMobileDistCopyPath}-${timestamp}`
          );
          promisifyExec(
            `rm -rf ${projectThemeDistConfig.projectMobileDistCopyPath}-${timestamp}`
          )
            .then(() => {
              logger.info(
                `${projectThemeDistConfig.projectMobileDistCopyPath}-${timestamp} removed`
              );
              robot.info(`${projectName} 项目 mobile ${theme} 复制文件已删除`);
            })
            .catch(err => {
              logger.error(
                `remove ${projectThemeDistConfig.projectMobileDistCopyPath}-${timestamp} Error`,
                err
              );
              console.error(err);
            });
        }
        if (fse.existsSync(projectThemeDistConfig.projectMobileTempDistPath)) {
          fse.moveSync(
            projectThemeDistConfig.projectMobileTempDistPath,
            `${projectThemeDistConfig.projectMobileTempDistPath}-${timestamp}`
          );
          promisifyExec(
            `rm -rf ${projectThemeDistConfig.projectMobileTempDistPath}-${timestamp}`
          )
            .then(() => {
              logger.info(
                `${projectThemeDistConfig.projectMobileTempDistPath}-${timestamp} removed`
              );
              robot.info(`${projectName} 项目 mobile ${theme} 生产文件已删除`);
            })
            .catch(err => {
              logger.error(
                `remove ${projectThemeDistConfig.projectMobileTempDistPath}-${timestamp} Error`,
                err
              );
              console.error(err);
            });
        }
        if (ensure) {
          fse.ensureDirSync(projectThemeDistConfig.projectMobileDistCopyPath);
          fse.ensureDirSync(projectThemeDistConfig.projectMobileTempDistPath);
        }
      }
      // app
      if (fse.existsSync(projectThemeDistConfig.projectAppDistCopyPath)) {
        fse.moveSync(
          projectThemeDistConfig.projectAppDistCopyPath,
          `${projectThemeDistConfig.projectAppDistCopyPath}-${timestamp}`
        );
        promisifyExec(
          `rm -rf ${projectThemeDistConfig.projectAppDistCopyPath}-${timestamp}`
        )
          .then(() => {
            logger.info(
              `${projectThemeDistConfig.projectAppDistCopyPath}-${timestamp} removed`
            );
            robot.info(`${projectName} 项目 app ${theme} 复制文件已删除`);
          })
          .catch(err => {
            logger.error(
              `remove ${projectThemeDistConfig.projectAppDistCopyPath}-${timestamp} Error`,
              err
            );
            console.error(err);
          });
      }
      if (fse.existsSync(projectThemeDistConfig.projectAppTempDistPath)) {
        fse.moveSync(
          projectThemeDistConfig.projectAppTempDistPath,
          `${projectThemeDistConfig.projectAppTempDistPath}-${timestamp}`
        );
        promisifyExec(
          `rm -rf ${projectThemeDistConfig.projectAppTempDistPath}-${timestamp}`
        )
          .then(() => {
            logger.info(
              `${projectThemeDistConfig.projectAppTempDistPath}-${timestamp} removed`
            );
            robot.info(`${projectName} 项目 app ${theme} 生产文件已删除`);
          })
          .catch(err => {
            logger.error(
              `remove ${projectThemeDistConfig.projectAppTempDistPath}-${timestamp} Error`,
              err
            );
            console.error(err);
          });
      }
      if (ensure) {
        fse.ensureDirSync(projectThemeDistConfig.projectAppDistCopyPath);
        fse.ensureDirSync(projectThemeDistConfig.projectAppTempDistPath);
      }
    }

    if (ensure) {
      this.ensureProjectDistDirLink(projectConfig);
    }
  }

  ensureProjectDirForWithLangRoutes(projectName, projectTaskSet) {
    const projectConfig = this.projectConfigs[projectName];
    robot.info(`清理 ${projectName} 项目指定路由文件`);
    logger.info(`清理 ${projectName} 项目指定路由文件`);
    for (const theme in projectTaskSet.routesWithLangMap) {
      const projectThemeDistConfig = projectConfig.distConfig[theme];
      fse.ensureDirSync(projectThemeDistConfig.projectDistCopyPath);
      fse.ensureDirSync(projectThemeDistConfig.projectAppDistCopyPath);
      if (projectConfig.mobileGen) {
        fse.ensureDirSync(projectThemeDistConfig.projectMobileDistCopyPath);
      }
      if (!projectTaskSet.keepDistFile) {
        const { withLangRoutesMap, withLangAppRoutesMap } =
          projectTaskSet.routesWithLangMap[theme];
        if (withLangRoutesMap) {
          Object.keys(withLangRoutesMap).forEach(lang => {
            withLangRoutesMap[lang].forEach(route => {
              const distFilePath = path.join(
                projectThemeDistConfig.projectDistCopyPath,
                route,
                'index.html'
              );
              fse.removeSync(distFilePath);
              if (projectConfig.mobileGen) {
                const mobileDistFilePath = path.join(
                  projectThemeDistConfig.projectMobileDistCopyPath,
                  route,
                  'index.html'
                );
                fse.removeSync(mobileDistFilePath);
              }
            });
          });
        }
        if (withLangAppRoutesMap) {
          Object.keys(withLangAppRoutesMap).forEach(lang => {
            withLangAppRoutesMap[lang].forEach(route => {
              const appDistFilePath = path.join(
                projectThemeDistConfig.projectAppDistCopyPath,
                route,
                'index.html'
              );
              fse.removeSync(appDistFilePath);
            });
          });
        }
      }
      fse.removeSync(projectThemeDistConfig.projectTempDistPath);
      fse.removeSync(projectThemeDistConfig.projectAppTempDistPath);
      fse.ensureDirSync(projectThemeDistConfig.projectTempDistPath);
      fse.ensureDirSync(projectThemeDistConfig.projectAppTempDistPath);
      if (projectConfig.mobileGen) {
        fse.removeSync(projectThemeDistConfig.projectMobileTempDistPath);
        fse.ensureDirSync(projectThemeDistConfig.projectMobileTempDistPath);
      }
    }
    this.ensureProjectDistDirLink(projectConfig);
  }

  ensureProjectDirForRoutes(projectName, projectTaskSet) {
    const projectConfig = this.projectConfigs[projectName];
    robot.info(`清理 ${projectName} 项目指定路由文件`);
    logger.info(`清理 ${projectName} 项目指定路由文件`);
    for (const theme in projectTaskSet.routes) {
      const projectThemeDistConfig = projectConfig.distConfig[theme];
      fse.ensureDirSync(projectThemeDistConfig.projectDistCopyPath);
      fse.ensureDirSync(projectThemeDistConfig.projectAppDistCopyPath);
      if (projectConfig.mobileGen) {
        fse.ensureDirSync(projectThemeDistConfig.projectMobileDistCopyPath);
      }
      if (!projectTaskSet.keepDistFile) {
        const { webRoutes, appRoutes } = projectTaskSet.routes[theme];
        projectTaskSet.langs.forEach(lang => {
          // 删除指定 routes 文件
          if (webRoutes.length !== 0) {
            webRoutes.forEach(route => {
              const filePath =
                lang === 'en' ? route : path.join(`/${lang}`, route);
              const distFile = path.join(
                projectThemeDistConfig.projectDistCopyPath,
                filePath,
                'index.html'
              );
              fse.removeSync(distFile);
              if (projectConfig.mobileGen) {
                const mobileDistFile = path.join(
                  projectThemeDistConfig.projectMobileDistCopyPath,
                  filePath,
                  'index.html'
                );
                fse.removeSync(mobileDistFile);
              }
            });
          }
          if (appRoutes.length !== 0) {
            appRoutes.forEach(route => {
              const filePath =
                lang === 'en' ? route : path.join(`/${lang}`, route);
              const appDistFile = path.join(
                projectThemeDistConfig.projectAppDistCopyPath,
                filePath,
                'index.html'
              );
              fse.removeSync(appDistFile);
            });
          }
        });
      }
      fse.removeSync(projectThemeDistConfig.projectTempDistPath);
      fse.removeSync(projectThemeDistConfig.projectAppTempDistPath);
      fse.ensureDirSync(projectThemeDistConfig.projectTempDistPath);
      fse.ensureDirSync(projectThemeDistConfig.projectAppTempDistPath);
      if (projectConfig.mobileGen) {
        fse.removeSync(projectThemeDistConfig.projectMobileTempDistPath);
        fse.ensureDirSync(projectThemeDistConfig.projectMobileTempDistPath);
      }
    }
    this.ensureProjectDistDirLink(projectConfig);
  }

  ensureProjectDirForRouteSets(projectName, projectTaskSet) {
    const projectConfig = this.projectConfigs[projectName];
    robot.info(`清理 ${projectName} 项目指定路由集合文件`);
    logger.info(`清理 ${projectName} 项目指定路由文件`);
    for (const theme in projectConfig.distConfig) {
      const projectThemeDistConfig = projectConfig.distConfig[theme];
      fse.ensureDirSync(projectThemeDistConfig.projectDistCopyPath);
      fse.ensureDirSync(projectThemeDistConfig.projectAppDistCopyPath);
      if (projectConfig.mobileGen) {
        fse.ensureDirSync(projectThemeDistConfig.projectMobileDistCopyPath);
      }
      if (!projectTaskSet.keepDistFile) {
        // 删除指定路由集文件
        const remover = this.projectRemovers[projectName];
        if (!remover) {
          logger.error(`no routeSet remover for ${projectName}`);
        } else {
          for (const routeSet of projectTaskSet.routeSets) {
            if (!projectConfig.routeSets.includes(routeSet)) {
              logger.error(
                `invalid ${projectConfig.projectName} routeSet ${routeSet}`
              );
              continue;
            }
            remover.removeRouteSetFiles(projectTaskSet.langs, routeSet, theme);
          }
        }
      }
      const timestamp = Date.now();
      // default
      if (fse.existsSync(projectThemeDistConfig.projectTempDistPath)) {
        fse.moveSync(
          projectThemeDistConfig.projectTempDistPath,
          `${projectThemeDistConfig.projectTempDistPath}-${timestamp}`
        );
        promisifyExec(
          `rm -rf ${projectThemeDistConfig.projectTempDistPath}-${timestamp}`
        )
          .then(() => {
            logger.info(
              `${projectThemeDistConfig.projectTempDistPath}-${timestamp} removed`
            );
            robot.info(
              `${projectName} 项目 ${theme} 指定路由集合旧版生产文件已删除`
            );
          })
          .catch(err => {
            logger.error(
              `remove ${projectThemeDistConfig.projectTempDistPath}-${timestamp} Error`,
              err
            );
            console.error(err);
          });
      }
      fse.ensureDirSync(projectThemeDistConfig.projectTempDistPath);
      // mobile
      if (projectConfig.mobileGen) {
        if (fse.existsSync(projectThemeDistConfig.projectMobileTempDistPath)) {
          fse.moveSync(
            projectThemeDistConfig.projectMobileTempDistPath,
            `${projectThemeDistConfig.projectMobileTempDistPath}-${timestamp}`
          );
          promisifyExec(
            `rm -rf ${projectThemeDistConfig.projectMobileTempDistPath}-${timestamp}`
          )
            .then(() => {
              logger.info(
                `${projectThemeDistConfig.projectMobileTempDistPath}-${timestamp} removed`
              );
              robot.info(
                `${projectName} 项目 mobile ${theme} 指定路由集合旧版生产文件已删除`
              );
            })
            .catch(err => {
              logger.error(
                `remove ${projectThemeDistConfig.projectMobileTempDistPath}-${timestamp} Error`,
                err
              );
              console.error(err);
            });
        }
        fse.ensureDirSync(projectThemeDistConfig.projectMobileTempDistPath);
      }
      // app
      if (fse.existsSync(projectThemeDistConfig.projectAppTempDistPath)) {
        fse.moveSync(
          projectThemeDistConfig.projectAppTempDistPath,
          `${projectThemeDistConfig.projectAppTempDistPath}-${timestamp}`
        );
        promisifyExec(
          `rm -rf ${projectThemeDistConfig.projectAppTempDistPath}-${timestamp}`
        )
          .then(() => {
            logger.info(
              `${projectThemeDistConfig.projectAppTempDistPath}-${timestamp} removed`
            );
            robot.info(
              `${projectName} 项目 app ${theme} 指定路由集合旧版生产文件已删除`
            );
          })
          .catch(err => {
            logger.error(
              `remove ${projectThemeDistConfig.projectAppTempDistPath}-${timestamp} Error`,
              err
            );
            console.error(err);
          });
      }
      fse.ensureDirSync(projectThemeDistConfig.projectAppTempDistPath);
    }
    this.ensureProjectDistDirLink(projectConfig);
  }
}

module.exports = FileManager;
