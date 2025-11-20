/**
 * Owner: roger.chen@kupotech.com
 */
import extend from 'dva-model-extend';
import {baseModel} from 'utils/dva';
// import {uploadFile} from 'services/upload';
import Bridge from 'utils/bridge';

export default extend(baseModel, {
  namespace: 'upload',
  effects: {
    *uploadImage({payload}, {call}) {
      // try {
      //   return true;
      //   const {success, data} = yield call(uploadFile, payload);
      //   if (success) {
      //     return data;
      //   }
      // } catch (e) {
      //   console.log('image upload error', e);
      //   e?.msg && Bridge.Toast(e.msg);
      //   return false;
      // }
    },
  },
});
