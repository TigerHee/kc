import { ResponseInterceptor } from '../../types';

const checkBizCode: ResponseInterceptor = () => {
  return {
    name: 'checkBizCode',
    description: '检查业务错误码和success字段',
    priority: 1,
    async onFulfilled(response) {
      const responseData = response.data;
      if (!responseData || typeof responseData !== 'object') {
        return response;
      }
      if (typeof responseData.code === 'number') {
        responseData.code = `${responseData.code}`;
      }
      if (responseData.success !== true) {
        throw response;
      }

      return response;
    },
  };
};

export default checkBizCode;
