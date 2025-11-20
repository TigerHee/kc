/**
 * Owner: Owen.guo@kupotech.com
 */
/*
 * @Author: Owen.guo
 * @Date: 2023-04-11 11:15:09
 * @Description: SensorApm 神策apm监控上报交易体感指标
 * @Wiki:https://wiki.kupotech.com/pages/viewpage.action?pageId=114017511
 */

export default class SensorApm {
  constructor(props) {
    this.time = new Date();
    this.duration_order = 0;
    this.event_name = props.eventName || '';
    this.network_path = '';
    this.is_success = false;
    this.fail_reason = 'none';
  }
  // 上报神策数据
  sendSensorApm(basePayload, others) {
    try {
      const currentTime = new Date();
      this.duration_order = this.time ? Number(currentTime - this.time) : 0;
      const properties = {
        duration_order: this.duration_order,
        interface_duration: basePayload?.api_duration_order || 0,
        start_time: this.time,
        end_time: currentTime,
        event_name: this.event_name,
        network_path: basePayload?.network_path || this.network_path,
        is_success: basePayload?.is_success || this.is_success,
        fail_reason: basePayload?.fail_reason || this.fail_reason,
        ...others,
      };
      return new Promise((resolve, reject) => {
        if (!this.event_name) {
          resolve({
            10000: 'sendSensorApm-send-error:has no event_name',
            done: true,
          });
        }
        if (window.$KcSensors) {
          window.$KcSensors.track(this.event_name, properties, () => {
            resolve({
              0: 'sendSensorApm-send-success',
              done: true,
            });
          });
        } else {
          resolve({
            10000: 'sendSensorApm-send-error',
            done: true,
          });
        }
      });
    } catch (e) {
      console.error(e, 'sendSensorApm-error');
      const message = e?.message || '';
      if (window.$KcSensors) {
        const properties = {
          event_name: this.event_name,
          is_success: false,
          fail_reason: `sendSensorApm-send-error:${message}`,
        };
        window.$KcSensors.track(this.event_name, properties);
      }
    }
  }
  // 初始化神策APM数据
  initSensorApm(props) {
    this.time = new Date();
    this.duration_order = 0;
    this.event_name = props?.eventName || '';
    this.network_path = '';
    this.is_success = false;
    this.fail_reason = 'none';
  }
}
