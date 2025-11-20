/*
 * @owner: borden@kupotech.com
 */
export default {
  myPoints: 430,
  redemptionLimit: 5,
  invitationCode: '123',
  invitationEffectiveTimes: 3,
  tasks: [
    {
      id: '1',
      completeTimes: 0,
      params: {
        obtainMaxKycPassed: 10,
      },
      rewardTimes: 0,
      taskType: 1,
    },
    {
      id: '2',
      type: 'cycle',
      completeTimes: 0,
      params: {
        buyCoinUnit: 1,
        buyCoinCheckCount: 1,
      },
      rewardTimes: 0,
      taskType: 2,
      refreshTime: Date.now() + 23 * 60 * 60 * 1000,
      taskCompleteValue: 600,
      currentProcessingValue: 500,
      maxCompletedTimes: 5,
    },
  ],
};
