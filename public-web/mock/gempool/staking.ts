import type { IMockMethod } from '@kc/mk-plugin-mock';

export default [
  // 协议确认
  {
    url: '/_api/gem-staking/gempool/staking/campaign/order',
    // disabled: true,
    response: (_req, res) => {
      return {
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "data": null
      };
    },
  },
] as IMockMethod[];
