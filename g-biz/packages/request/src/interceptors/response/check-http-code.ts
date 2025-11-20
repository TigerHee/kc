import { ResponseInterceptor } from '../../types';

const checkHttpCode: ResponseInterceptor = () => {
  return {
    name: 'checkHttpCode',
    description: '检查http状态码',
    priority: 10,
    async onFulfilled(response) {
      const code = response.status;
      if (code >= 200 && code < 300) {
        return response;
      }
      throw response;
    },
  };
};

export default checkHttpCode;
