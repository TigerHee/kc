import addLangToPath from 'tools/addLangToPath';
import coinReport from './coinReport';
import { getUtmLink } from './getUtm';

export default function linkToTrade(symbol, formatUrl = (v) => v) {
  if (symbol) {
    coinReport(symbol);
    window.location.href = formatUrl(addLangToPath(getUtmLink(`/trade/${symbol}`)));
  } else {
    window.location.href = formatUrl(addLangToPath(getUtmLink(`/trade`)));
  }
}
