/**
 * Owner: iron@kupotech.com
 */
import dva from 'dva';
import { httpTool as httpToolEntrace, getModels as getModelsEntrace } from '@kc/entrance';
import { httpTool as httpToolKyc, getModels as getModelsKyc } from '@kc/kyc';
import { httpTool as httpToolIM, getModels as getModelsIM } from '@kc/im';
import { httpTool as httpToolSe, getModels as getModelsSe } from '@kc/security';
import * as footer from '@kc/footer';
import * as header from '@kc/header';

// import * as robotTest from '@kc/robot-test';
import createHistory from 'history/createBrowserHistory';
import demoKycModel from './models/kycModel';

function testPush() {}

header.pushTool.setPush(testPush);

const getModelsAll = [
  getModelsEntrace,
  getModelsKyc,
  getModelsIM,
  getModelsSe,
  footer.getModels,
  header.getModels,
  // robotTest.getModels,
];

httpToolEntrace.setHost('http://localhost:2999/next-web/_api');
httpToolEntrace.addParams({ lang: 'en_US' });

httpToolKyc.setHost('http://localhost:2999/next-web/_api');
httpToolKyc.addParams({ lang: 'vi_VN' });

httpToolSe.setHost('http://localhost:2999/next-web/_api');
httpToolSe.addParams({ lang: 'vi_VN' });

footer.httpTool.setHost('http://localhost:2999/next-web/_api');
footer.httpTool.addParams({ lang: 'zh_CN' });

header.httpTool.setHost('http://localhost:2999/next-web/_api');
header.httpTool.addParams({ lang: 'pl_PL' });

// robotTest.httpTool.setHost('http://localhost:2999/next-web/_api');

httpToolIM.setHost('https://v2.kucoin.net/_api');

const app = dva({
  onError(e) {
    console.log(e);
  },
  history: createHistory(),
});

getModelsAll.forEach((sets) => sets().forEach((item) => app.model(item)));
app.model(demoKycModel);

app.router(require('./router').default);

app.start('#root');
