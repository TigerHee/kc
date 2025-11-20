/**
 * Owner: larvide.peng@kupotech.com
 */
import siteConfig from 'utils/siteConfig';
import { addLangToPath } from 'tools/i18n';
import icon1 from 'static/securityV2/light/icon1.png';
import icon2 from 'static/securityV2/light/icon2.png';
import icon3 from 'static/securityV2/light/icon3.png';
import icond1 from 'static/securityV2/dark/icond1.png';
import icond2 from 'static/securityV2/dark/icond2.png';
import icond3 from 'static/securityV2/dark/icond3.png';

const { LANDING_HOST } = siteConfig;

export const helpers = [
  {
    icon: icon1,
    darkIcon: icond1,
    title: 'newhomepage.text15',
    desc: 'newhomepage.text16',
    moreLink: addLangToPath('/support'),
    newTabOpen: true,
  },
  {
    icon: icon2,
    darkIcon: icond2,
    title: 'newhomepage.community',
    desc: 'newhomepage.text17',
    moreLink: addLangToPath(`${LANDING_HOST}/community-collect`),
    newTabOpen: true,
  },
  {
    icon: icon3,
    darkIcon: icond3,
    title: 'newhomepage.text18',
    desc: 'newhomepage.text19',
    moreLink: addLangToPath('/announcement'),
    newTabOpen: false,
  },
];
