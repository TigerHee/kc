import { addLangToPath } from './addLangToPath';
import coinReport from './coinReport';
import { getUtmLink } from './getUtm';

export default function linkToTrade(symbol, formatUrl = (v) => v) {
  if (symbol) {
    coinReport(symbol, true);
    window.location.href = formatUrl(addLangToPath(getUtmLink(`/trade/${symbol}`)));
  } else {
    window.location.href = formatUrl(addLangToPath(getUtmLink(`/trade`)));
  }
}
