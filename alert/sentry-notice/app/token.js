const kufoxToken = process.env.KUFOX_NOTICE_TOKEN;

function getAuthToken() {
  return kufoxToken;
}

module.exports = getAuthToken;
