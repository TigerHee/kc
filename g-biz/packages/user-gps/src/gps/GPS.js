/**
 * Owner: iron@kupotech.com
 */
import storage from '@utils/storage';
import { uploadGPS } from './service';
import { GPS_LAST_UPLOAD_KEY } from '../utils/constant';

export default class GPSPicker {
  saveKey = 'gps-location-config';

  static instance;

  requestConfig = {};

  constructor() {
    // 同步localStorage的数据
    this.initConfig(storage.getItem(`${GPS_LAST_UPLOAD_KEY}_${this.saveKey}`));
  }

  initDefault = () => {
    return {
      lastRequestTime: 0, // 上一次调用上传方法的时间
      lastUploadGPSTime: 0, // 上一次成功上传gps的时间
      status: -1, // gps 定位api调用状态（是否授权等）
      latitude: '',
      longitude: '',
      rejectAuthTime: -1, // 连续未授权定位的时间，超过21天则不再上传定位数据
    };
  };

  initConfig = (localConfig) => {
    let config = null;
    if (!localConfig || localConfig.lastRequestTime === undefined) {
      config = this.initDefault();
    } else {
      config = localConfig;
    }
    this.requestConfig = config;
  };

  updateConfig = ({ latitude, longitude }) => {
    this.requestConfig = {
      ...this.requestConfig,
      lastRequestTime: Date.now(),
      lastUploadGPSTime: Date.now(),
      latitude,
      longitude,
    };
    // 记录连续未授权的时间
    const { status, rejectAuthTime } = this.requestConfig;
    if (status !== null || (!latitude && !longitude)) {
      if (rejectAuthTime < 0) {
        this.requestConfig.rejectAuthTime = Date.now();
      }
    } else {
      this.requestConfig.rejectAuthTime = -1;
    }
    storage.setItem(`${GPS_LAST_UPLOAD_KEY}_${this.saveKey}`, this.requestConfig);
  };

  static get = () => {
    if (!GPSPicker.instance) GPSPicker.instance = new GPSPicker();
    return GPSPicker.instance;
  };

  upload = (data) => {
    if (!window.navigator.geolocation) return;
    this.currentParams = data;
    try {
      window.navigator.geolocation.getCurrentPosition(this.onGetSuccess, this.requestError);
    } catch (e) {
      console.error(e);
    }
  };

  handleUpload = async (hasAccess, params = {}) => {
    // 如果连续超过21天为获取到定位数据，后续就不再上报，因为定位数据为空
    const { rejectAuthTime = -1 } = this.requestConfig;
    if (rejectAuthTime > 0 && rejectAuthTime - Date.now() > 21 * 24 * 60 * 60 * 1000) {
      return;
    }
    // web端第一次获取GPS信息后，3小时内不再重复获取
    // 位置变化距离大于10公里进行上报
    const timeDuation = Date.now() - this.requestConfig.lastRequestTime;
    const isTimeOver = timeDuation > 3 * 60 * 60 * 1000;
    const isLocationOver = this.isDistanceOver(params);
    if (isTimeOver && isLocationOver) {
      // 更新参数存储本地，并上传
      let uploadData = {};
      try {
        const userParams = this.currentParams || {};
        const { latitude = '', longitude = '', timestamp = Date.now() } = params;
        uploadData = {
          isAuth: true,
          isGetInfo: hasAccess && latitude > 0 && longitude > 0,
          latitude,
          longitude,
          positioningTime: timestamp,
          ...userParams,
        };
        await uploadGPS(uploadData);
        if (uploadData.isGetInfo) {
          this.requestConfig.rejectAuthTime = -1;
        }
      } catch (e) {
        // 调用失败，也认为未成功上传
        this.requestConfig.status = -1;
        console.error(e);
      } finally {
        // 更新最近一次的上传参数
        this.updateConfig(uploadData);
      }
    }
  };

  rad = (d) => {
    return d * (Math.PI / 180.0);
  };

  isDistanceOver = ({ latitude: lat1 = '', longitude: lng1 = '' } = {}) => {
    try {
      const { latitude: lat2 = '', longitude: lng2 = '' } = this.requestConfig;
      if (!lat1 || !lat2) return true;
      const radLat1 = this.rad(lat1);
      const radLat2 = this.rad(lat2);
      const a = radLat1 - radLat2;
      const b = this.rad(lng1) - this.rad(lng2);
      let s =
        2 *
        Math.asin(
          Math.sqrt(
            // eslint-disable-next-line no-restricted-properties
            Math.pow(Math.sin(a / 2), 2) +
              // eslint-disable-next-line no-restricted-properties
              Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2),
          ),
        );
      s *= 6378.137; // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000; // 输出为公里
      // console.log('isDistanceOver', {lat1, lng1}, {lat2, lng2}, s, s >= 10)
      return s >= 10;
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  onGetSuccess = ({ timestamp, coords } = {}) => {
    const gps = {
      accuracy: coords.accuracy,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
    this.requestConfig.status = null;
    this.handleUpload(true, { ...gps, timestamp });
  };

  // 获取gps失败
  requestError = (error) => {
    this.requestConfig.status = error.code === undefined ? -2 : error.code;
    this.handleUpload(false);
  };
}
