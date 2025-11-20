import mockjs from 'mockjs';

export default {
  'GET /category/detail/info': mockjs.mock({
    code: 200,
    success: true,
    data: {
      title: '@word',
    },
  }),
};
