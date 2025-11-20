/**
 ** Owner: harry.lai@kupotech.com
 */
import MoneyAmountFormat from 'src/components/common/MoneyAmountFormat';
import NumberWithChar from './components/NumberWithChar';
import SupplyFormat from './components/SupplyFormat';

import { _t } from 'src/tools/i18n';
import allTimeIcon from 'static/slothub/project-info-icon-all-time.svg';
import capIcon from 'static/slothub/project-info-icon-cap.svg';
import circulateSupplyIcon from 'static/slothub/project-info-icon-circulate-supply.svg';
import rankIcon from 'static/slothub/project-info-icon-rank.svg';
import supplyIcon from 'static/slothub/project-info-icon-supply.svg';

export const makeSlotProjectInfoList = ({ currency }) => [
  {
    label: () => _t('880a560d62254000a506'),
    key: 'rank',
    icon: rankIcon,
    render: (val) => `No.${val}`,
  },
  {
    label: () => _t('405b91c7e3d14000a279'), //'Market Cap',
    key: 'marketCap',
    icon: capIcon,
    render: (val) => <MoneyAmountFormat needGapChar={false} value={Number(val) ? val : null} />,
  },
  {
    label: () => _t('9d20aad946b44000a990'), //'Max Supply',
    icon: supplyIcon,
    key: 'maxSupply',
    render: (val) => <SupplyFormat value={val} />,
  },
  {
    label: () => _t('6488f704a1394000af7e'), // 'Circulating Supply',
    icon: circulateSupplyIcon,
    key: 'circulatingSupply',
    render: (val) => <SupplyFormat value={val} />,
  },
  {
    label: () => _t('4dbb9894ed1f4000aed9'), //'All-Time High',
    key: 'ath',
    icon: allTimeIcon,
    render: (val) => {
      return val ? (
        <NumberWithChar
          price={val}
          symbol={`${currency}-USDT`}
          needHandlePrice
          needTransfer={false}
        >
          {val}
        </NumberWithChar>
      ) : (
        '--'
      );
    },
  },
];
