import { DiscoveryService, MetadataScanner, ModuleRef } from '@nestjs/core';
import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Agenda } from '@hokify/agenda';
import { AgendaMetadataAccessor } from './agenda.metadata.accessor';
import { KunlunLogger } from 'src/common/kunlun.logger';

@Injectable()
export class AgendaExplorer implements OnModuleInit {
  private readonly logger = new KunlunLogger('InsightAgendaCore');
  public defineJobList = [];

  constructor(
    private readonly modRef: ModuleRef,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly metadataAccessor: AgendaMetadataAccessor,
  ) {
    //
  }

  onModuleInit() {
    this.explore();
  }

  explore() {
    const agenda = this.modRef.get(Agenda);
    const providers = this.discoveryService.getProviders();
    for (const provider of providers) {
      if (!provider.instance) continue;
      if (!provider.metatype) continue;
      if (!this.metadataAccessor.canProcessJobs(provider.metatype)) continue;
      if (!provider.isDependencyTreeStatic()) continue;

      this.metadataScanner.scanFromPrototype(
        provider.instance,
        Object.getPrototypeOf(provider.instance),
        (key: string) => {
          const methodRef = provider.instance[key];
          if (typeof methodRef !== 'function') return;

          // 创建agenda任务定义
          const defineOptions = this.metadataAccessor.getJobDefinitionOptions(methodRef);
          if (!defineOptions) return;
          this.logger.log(`🏠 任务定义 { ${defineOptions.name} }`);
          const processor = (...args: unknown[]) => methodRef.call(provider.instance, ...args);
          agenda.define(
            defineOptions.name,
            processor,
            defineOptions.options || {
              priority: 'normal',
            },
          );
          // 推进定义任务列表
          this.defineJobList.push(defineOptions);

          // 创建agenda任务调度
          const scheduleOptions = this.metadataAccessor.getJobScheduleOptions(methodRef);
          if (!scheduleOptions) return;

          if (!scheduleOptions.when) throw new Error('缺少 `when` 参数');
          if (typeof scheduleOptions.when !== 'string' && !(scheduleOptions.when instanceof Date))
            throw new Error('`when` 参数类型错误');
          if (scheduleOptions.isEvery && typeof scheduleOptions.when !== 'string')
            throw new Error('`when` 参数类型错误, `isEvery` 为 true 时 `when` 必须为 string');

          const logTerm = scheduleOptions.isEvery
            ? `{ every ${scheduleOptions.when} }`
            : scheduleOptions.when instanceof Date
              ? `{ at ${scheduleOptions.when.toISOString()} }`
              : scheduleOptions.when;

          this.logger.log(`🚄 调度任务 { ${defineOptions.name} } 运行 ${logTerm}`);

          if (scheduleOptions.isEvery) {
            agenda.every(scheduleOptions.when as string, defineOptions.name, scheduleOptions.data ?? {}, {
              timezone: 'Asia/Shanghai',
              skipImmediate: true,
            });
          } else {
            agenda.schedule(scheduleOptions.when, defineOptions.name, scheduleOptions.data ?? {});
          }
        },
      );
    }
  }
}
