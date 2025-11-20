const axios = require('axios');
const ULID = require('ulid');

const reportTeams = async (msgs, isDev = false) => {
  if (isDev) {
    return;
  }
  const _id = ULID.ulid();
  try {
    const header = process.env.TEAMS_NOTIFY_TOKEN;
    if (!header) {
      console.log('teams token not found');
      return;
    }
    const result = await axios
      .post(
        'https://kufox-bot.kcprd.com/api/notify',
        {
          // [{"text": "数据库:10.30.11.10当前时间数据未进 行备份，请重点关注"}]
          message: msgs instanceof Array ? msgs : [msgs],
          receiver: {
            conversation: '19:daf322fba5c54bc6b97e759d42d92ce9@thread.v2',
          },
          id: _id.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${header}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      )
      .catch((e) => {
        console.log('report teams error: ', e);
      });
    console.log('report teams:', result.data);
  } catch (e) {
    // console.log(e);
  }
};
exports.reportTeams = reportTeams;
