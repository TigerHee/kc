import type { IMockMethod } from '@kc/mk-plugin-mock';

export default [
  // 协议确认
  {
    url: '/_api/gem-staking-front/gempool/staking/bonus/task',
    disabled: true,
    response: (_req, res) => {
      return {
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "data": {
          "openBonusTask": 1,
          "userBonusTaskFinish": 0,
          "userBonusCoefficient": "0.01",
          "taskCompletion": [
            {
              "taskName": null,
              "taskId": "67eb4f8b9f37cf0001095272",
              "taskState": 0,
              "bonusCoefficient": "0.05",
              "vipLevel": 0,
              "kcsLevel": 0,
              "taskType": 0
            },
            {
              "taskName": null,
              "taskId": "67eb50849f37cf0001095277",
              "taskState": 1,
              "bonusCoefficient": "0.01",
              "vipLevel": 0,
              "kcsLevel": 0,
              "taskType": 1
            },
            {
              "taskName": null,
              "taskId": "67eb50c19f37cf0001095278",
              "taskState": 0,
              "bonusCoefficient": "0",
              "vipLevel": 0,
              "kcsLevel": 0,
              "taskType": 2
            },
            {
              "taskName": null,
              "taskId": "67eb50c19f37cf0001095279",
              "taskState": 0,
              "bonusCoefficient": "0.01",
              inviteActivityPeopleNumber: 1,
              maxBonusCoefficient: 0.5,
              "vipLevel": 0,
              "kcsLevel": 0,
              "taskType": 3
            },
          ]
        }
      };
    },
  },
  {
    url: '/_api/gem-staking-front/gempool/staking/campaign/invite-activity',
    disabled: true,
    response: () => {
      const bonusCoefficientMap = Array.from({length: 5}, (_, i) => i + 1).reduce((acc, _, index) => {
        acc[String((index + 1) * 5)] = 0.02 * (index + 1);
        return acc;
      }, {} as Record<number, string>);

      return {
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "data": {
          activityCode: "gempoolinvte_task10_6",
          bonusCoefficientMap: bonusCoefficientMap,
          campaignId: "67f6164f6752d300017d8caa"
        }
      };
    }
  }
] as IMockMethod[];
