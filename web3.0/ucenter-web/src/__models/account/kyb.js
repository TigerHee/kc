/**
 * Owner: vijay.zhou@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import moment from 'moment';
import { pullCompanyDetail } from 'services/kyb';
import { fillFailReason } from './kyc';

export default extend(base, {
  namespace: 'kyb',
  state: {
    /** 企业详情 */
    companyDetail: null,
    /** 是否展示企业材料清单 */
    showMaterialList: false,
    /**
     * kyc首页是否启用 kyb 重定向
     * kyc 首页会根据状态重定向到 kyc 或 kyb 落地页
     * kyb 缺少一个重置状态的接口，不能回滚状态
     * 为避免无法从 kyb 落地页返回 kyc 主页
     * 加一个临时状态关闭 kyb 的重定向
     */
    kybRedirect: true,
  },
  effects: {
    *pullCompanyDetail(_, { call, put, select }) {
      try {
        const res = yield call(pullCompanyDetail);
        const { currentLang } = yield select((state) => state.app);
        if (res?.success) {
          const { data = {} } = res;
          data.originVerifyFailReason = data.verifyFailReason;
          data.verifyFailReason = fillFailReason(data.verifyFailReason, currentLang);
          /** @todo 暂时下线「办公地址与注册地址一致的选项」，后面提需求开放 */
          // data.detailSameOfficeAddress = data.detailSameOfficeAddress ?? true;
          data.workCountry = data.workCountry || data.registrationCountry;
          data.registrationDate = data.registrationDate ? moment(data.registrationDate) : moment();
          data.detailContactorPhotoType = data.detailContactorPhotoType ?? 'passport';
          data.idExpireDateIsPermanent = data.idExpireDate === 'permanent';
          data.idExpireDate =
            !data.idExpireDateIsPermanent && data.idExpireDate
              ? moment(data.idExpireDate)
              : moment();
          yield put({
            type: 'update',
            payload: {
              companyDetail: data,
            },
          });
          return data;
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
});
