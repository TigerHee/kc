import sensors from '@kucoin-base/sensors';

// 添加曝光函数
export const kcsensorsManualTrack = (menuSpm, params = {}, type = 'expose') => {
  if (!menuSpm) return;
    const { pagecate, ...rest } = params;
    const pageId = sensors?.spm?.getPageId?.();
    const exposeCfg = {
      spm_id: sensors?.spm?.compose(menuSpm),
      page_id: pageId,
      ...rest,
      pagecate: pagecate || 'topNavigation',
    };
    sensors.track(type, exposeCfg);
};