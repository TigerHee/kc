/**
 * Owner: tiger@kupotech.com
 */
import { Dialog } from '@kux/mui';
import { _t } from 'tools/i18n';
import { WholesaleDetailWrapper } from './styled';

const currency = 'AUD';

export default (props) => {
  const data = [
    {
      key: 1,
      title: _t('873220b7ba544800a5f2', { num: 25 }),
      list: [
        _t('1bacfd6e13eb4800a0b9', { currency, num: '2.5' }),
        _t('55f5a8236be84800a691', { currency, num: '250,000' }),
        _t('8ac7b00583474800a02d'),
        _t('e04caac2163b4800afd5'),
      ],
    },
    {
      key: 2,
      title: _t('a9630a4855474800aa04'),
      list: [
        _t('81f2ac961fc94000a253'),
        _t('fc78208b8bde4800ae39'),
        _t('c2a0daa730ef4800ae26'),
        _t('4c4e73a5a7fd4800acd1'),
      ],
    },
  ];

  return (
    <Dialog title={_t('6234c89584e54800a36c')} footer={null} size="medium" {...props}>
      <WholesaleDetailWrapper>
        {data.map(({ key, title, list }) => {
          return (
            <div className="item" key={key}>
              <div className="title">{title}</div>
              {list.map((listItem) => (
                <div className="listItem" key={listItem}>
                  {listItem}
                </div>
              ))}
            </div>
          );
        })}
      </WholesaleDetailWrapper>
    </Dialog>
  );
};
