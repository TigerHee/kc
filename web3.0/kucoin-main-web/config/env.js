const isDev = process.env.NODE_ENV === 'development';
const isSit = process.env.APP_CDN === 'https://assets-v2.kucoin.net';
const isProd = process.env.NODE_ENV === 'production' && !isSit;
module.exports.isDev = isDev;
module.exports.isSit = isSit;
module.exports.isProd = isProd;
module.exports.isInet = isDev || isSit;
