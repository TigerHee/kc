/**
 * Owner: will.wang@kupotech.com
 */
import { _t } from '@/tools/i18n';
import { GridItem } from './PortfolioItem';
import {
  PortfolioContent,
  PortfolioListContainer,
  PortfolioParagraph,
  PortfolioSectionContainer,
  Portfoliotitle,
} from './PortfolioSection.styles';
import { useTheme } from '@kux/mui';

const portfolioList = [
  {
    key: 'POKT',
    title: 'POKT',
    desc: _t('02088f2422e94000a3eb'),
    logo: require('static/ventures/logos/logo_1.png'),
    url: 'https://pocket.network/',
  },
  {
    key: 'Merlin',
    title: 'Merlin',
    desc: _t('f613f66566a54000acf4'),
    logo: require('static/ventures/logos/logo_2.png'),
    url: 'https://merlinchain.io/'
  },
  {
    key: 'UXLINK',
    title: 'UXLINK',
    desc: _t('6ea33259dec64000a53d'),
    logo: require('static/ventures/logos/logo_3.png'),
    url: 'https://www.uxlink.io/'
  },
  {
    key: 'Ultiverse',
    title: 'Ultiverse',
    desc: _t('05e3c1d361f74000abe8'),
    logo: require('static/ventures/logos/logo_4.png'),
    url: 'https://www.ultiverse.io/home'
  },
  {
    key: 'Scallop',
    title: 'Scallop',
    desc: _t('8eb597d442274000a1ee'),
    logo: require('static/ventures/logos/logo_5.png'),
    url: 'https://scallop.io/'
  },
  {
    key: 'Magic Square',
    title: 'Magic Square',
    desc: _t('7d7838da36ea4000a98c'),
    logo: require('static/ventures/logos/logo_6.png'),
    url: 'https://magicsquare.io/'
  },
  {
    key: 'OAS',
    title: 'OAS',
    desc: _t('7fa0d0df97424000a257'),
    logo: require('static/ventures/logos/logo_7.png'),
    url: 'https://www.oasys.games/'
  },
  {
    key: 'XION',
    title: 'XION',
    desc: _t('59faeed1a8cf4000a094'),
    logo: require('static/ventures/logos/logo_8.png'),
    darkLogo: require('static/ventures/logos/logo_8_dark.png'),
    url: 'https://xion.burnt.com/'
  },
  {
    key: 'Cetus',
    title: 'Cetus',
    desc: _t('c44b0e64e2ac4000a85b'),
    logo: require('static/ventures/logos/logo_9.png'),
    url: 'https://www.cetus.zone/',
  },
  {
    key: 'Pudgy Penguins',
    title: 'Pudgy Penguins',
    desc: _t('f44dd159465f4000a8c0'),
    logo: require('static/ventures/logos/logo_10.png'),
    url: 'https://pudgypenguins.com/'
  },
  {
    key: 'Xterio',
    title: 'Xterio',
    desc: _t('b64124e449ee4000a742'),
    logo: require('static/ventures/logos/logo_11.png'),
    darkLogo: require('static/ventures/logos/logo_11_dark.png'),
    logoStyle: { width: 93, height: 26 },
    url: 'https://www.xter.io/'
  },
  {
    key: 'Polyhedra',
    title: 'Polyhedra',
    desc: _t('2ecd9e9b835f4000af50'),
    logo: require('static/ventures/logos/logo_12.png'),
    darkLogo: require('static/ventures/logos/logo_12_dark.png'),
    url: 'https://www.polyhedra.network/'
  },
  {
    key: 'Taiko',
    title: 'Taiko',
    desc: _t('3ced5ea1db9f4000af5b'),
    logo: require('static/ventures/logos/logo_13.png'),
    url: 'https://taiko.xyz/'
  },
  {
    key: 'RateX',
    title: 'RateX',
    desc: _t('a4d0df02a97f4000a741'),
    logo: require('static/ventures/logos/logo_14.png'),
    darkLogo: require('static/ventures/logos/logo_14_dark.png'),
    url: 'https://rate-x.io/',
  },
  {
    key: 'Yotta',
    title: 'Yotta',
    desc: _t('581fedf360194000a8ec'),
    logo: require('static/ventures/logos/logo_15.png'),
    darkLogo: require('static/ventures/logos/logo_15_dark.png'),
    url: 'https://www.yottalabs.ai/',
  },
  {
    key: 'uxuy',
    title: 'uxuy',
    desc: _t('5d0321509ade4000afe7'),
    logo: require('static/ventures/logos/logo_16.png'),
    darkLogo: require('static/ventures/logos/logo_16_dark.png'),
    logoStyle: {
      width: 76,
      height: 38,
    },
    url: 'https://uxuy.com/'
  },
  {
    key: 'TOMO',
    title: 'TOMO',
    desc: _t('86f4b83859364000aaa7'),
    logo: require('static/ventures/logos/logo_17.png'),
    url: 'https://tomo.inc/',
  },
  {
    key: 'Lumoz',
    title: 'Lumoz',
    desc: _t('d7bcc8e004234000ac88'),
    logo: require('static/ventures/logos/logo_18.png'),
    url: 'https://lumoz.org/',
  },
  {
    key: 'web3port',
    title: 'web3port',
    desc: _t('64f878358ab64000a8d0'),
    logo: require('static/ventures/logos/logo_19.png'),
    url: 'https://www.web3port.us/',
  },
  {
    key: 'exabits',
    title: 'EXABITS',
    desc: _t('e354f44e68584000aafa'),
    logo: require('static/ventures/logos/logo_20.png'),
    url: 'https://www.exabits.ai/'
  },
];

export default () => {
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';

  return (
    <PortfolioSectionContainer id="ventures_portfolio_banner" data-inspector="ventures_portfolio">
      <PortfolioContent>
        <Portfoliotitle>{_t("f0f30111507d4000aa73")}</Portfoliotitle>
        <PortfolioParagraph>
          {_t('288ee3f258534000a134')}
        </PortfolioParagraph>

        <PortfolioListContainer>
          {portfolioList.map((item) => (
            <GridItem key={item.key} isDark={isDark} {...item} />
          ))}
        </PortfolioListContainer>
      </PortfolioContent>
    </PortfolioSectionContainer>
  );
};
