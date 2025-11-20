import sensors, { kcsensorsManualTrack } from 'gbiz-next/sensors';

export const saTrackForBiz =  (params: { saType?: string }, spm: any[] = [], data: any = {}) => {
  if (!sensors) return;
  const { saType = 'expose' } = params;
  window.requestIdleCallback(() => {
    kcsensorsManualTrack({ spm, data }, saType);
  });
}

export const getPreSpmCode = () => {
  if (!sensors) return '';
  let code = '';
  code = sensors.spm.getPreSpmCode();
  return code;
};

 /**
   * @param url 目标url
   * @param spm 当前界面的spm，作为目标url的来向pre_spm_id
   */
export const saveSpm2NextUrl = (url, spm) => {
  if (!sensors) return '';
  if(sensors.spmStorage && sensors.spmStorage.saveSpm2SessionStorage){
    sensors.spmStorage.saveSpm2SessionStorage(url, spm);
  }
}