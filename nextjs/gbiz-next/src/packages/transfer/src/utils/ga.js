import remoteEvent from 'tools/remoteEvent';

export const kcsensorsClick = (spm, data = {}) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    sensors.trackClick(spm, data);
  });
};

export const kcsensorsManualTrack = (type = 'expose', spm = [], data = {}) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    const exposeCfg = {
      spm_id: sensors?.spm?.compose(spm),
      ...data,
    };
    sensors?.track(type, exposeCfg);
  });
};
