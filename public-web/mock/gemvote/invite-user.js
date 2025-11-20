export default [
  {
    url: '/_api/activity-rank/v1/invite-activity/query-current',
    // disabled: true,
    response: () => {
      return {
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "data": {
          "activityCode": "mia_test_gemvote1",
          "kycPoint": 3,
          "depositAmount": 10,
          "depositPoint": 4,
          "tradeAmount": 30,
          "tradePoint": 5,
          inviteAmount: 5,
        }
      }
    }
  },
  {
    url: '/_api/activity-rank/v1/invite-activity/query_to_receive',
    // disabled: true,
    response: () => {
      return {
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "data": 10
      }
    }
  },
  {
    url: '/_api/activity-rank/v1/invite-activity/receive',
    // disabled: true,
    timeout: 4000,
    response: () => {
      return {
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "data": 10
      }
    }
  },
]
