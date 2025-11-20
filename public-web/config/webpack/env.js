const isDev = process.env.NODE_ENV === 'development';
const isSit = process.env.APP_CDN === 'https://assets-v2.kucoin.net';

module.exports.isDev = isDev;
module.exports.isSit = isSit;
module.exports.isInet = isDev || isSit;
