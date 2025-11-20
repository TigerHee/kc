/**
 * Owner: iron@kupotech.com
 */
import Http from '@kc/gbiz-base/lib/Http';
import GPSPicker from './gps/GPS';

const uploadGPSLocation = (data) => {
  return GPSPicker.get().upload(data);
};

export const httpTool = Http.create('@kc/user-gps');
export default uploadGPSLocation;
