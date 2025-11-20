/**
 * Owner: borden@kupotech.com
 */

import Perfume from 'perfume.js';
import ReactGA from 'react-ga';

const metricNames = [
  'fp', 'fcp', 'lcp', 'lcpFinal', 'fid',
  'cls', 'clsFinal', 'tbt', 'tbt10S', 'tbtFinal',
];

try {
  const perfume = new Perfume({
    analyticsTracker: ({ metricName, data, navigatorInformation }) => {
      if (metricNames.includes(metricName)) {
        ReactGA.ga('send', 'event', {
          eventCategory: 'Perfume.js',
          eventAction: metricName,
          // Google Analytics metrics must be integers, so the value is rounded
          eventValue: metricName === 'cls' ? data * 1000 : data,
          eventLabel: navigatorInformation.isLowEndExperience ?
            'lowEndExperience' : 'highEndExperience',
          // Use a non-interaction event to avoid affecting bounce rate
          nonInteraction: true,
        });
      }
    },
  });

} catch (e) {
  console.log(e);
}
