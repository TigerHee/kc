/**
 * Owner: chris@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRight2Outlined, ICInfoOutlined } from '@kux/icons';
import { Tag, Tooltip as KuxTooltip } from '@kux/mui';
import clsx from 'clsx';
import { useState } from 'react';
import { divide, dropZero } from 'src/helper';
import sensors from 'tools/ext/kc-sensors';
import { addLangToPath, _t } from 'tools/i18n';
import HOST from 'utils/siteConfig';
import { callJump, getScene, percentFormat } from '../../utils';
import Tooltip, { H5Tip } from '../Tooltip';
import { BASE_CURRENCY } from 'config/base';

const { MAINSITE_HOST, POOLX_HOST, M_POOLX_HOST } = HOST;

const fileds = {
  SOPT_GEMPOOL: {
    bizType: 'SOPT_GEMPOOL',
    title: _t('5bbf75d602b64000a980'),
    tip: _t('0cb7bec7512b4000aeee'),
    goText: _t('2f3a419b6d2c4000a102'),
    onClick: () => {
      const url = `${MAINSITE_HOST}/gempool`;
      callJump(
        {
          url: addLangToPath(url),
        },
        url,
      );
    },
  },
  SPOT_SPOTLIGHT: {
    bizType: 'SPOT_SPOTLIGHT',
    title: _t('d4e02825e7ec4000a98f'),
    tip: _t('e9eb9847fc674000a14e'),
    goText: _t('2f3a419b6d2c4000a102'),
    onClick: () => {
      const url = `${MAINSITE_HOST}/spotlight-center`;
      callJump(
        {
          url: addLangToPath(url),
        },
        url,
      );
    },
  },
  SPOT_TRADE_FEE_DISCOUNT: {
    bizType: 'SPOT_TRADE_FEE_DISCOUNT',
    title: _t('89c201c35cf14000a1a3'),
    tip: _t('98ce40f3d7a84000aa93'),
    goText: _t('5f4e99dfc5554000a148'),
    onClick: () => {
      callJump(
        {
          url: `/trade?symbol=BTC-${BASE_CURRENCY}`,
        },
        `${MAINSITE_HOST}/trade/BTC-${BASE_CURRENCY}`,
      );
    },
  },
  EARN_KCS_STAKING: {
    bizType: 'EARN_KCS_STAKING',
    title: _t('a357d011331e4000a8a3'),
    tip: _t('d677dbaa023b4000ac62'),
    goText: _t('02cce4ffe2374000ac4f'),
    onClick: () => {
      callJump(
        {
          url: `${M_POOLX_HOST}/kcs?isBanner=1&loading=2&appNeedLang=true`,
        },
        `${POOLX_HOST}/earn/kcs`,
      );
    },
  },
  EARN_SIMPLE_LOCK: {
    bizType: 'EARN_SIMPLE_LOCK',
    title: _t('493339c17f314000aca5'),
    tip: _t('daf9cae7572f4000af88'),
    goText: _t('08d84cfd9c564000a35d'),
    onClick: () => {
      callJump(
        {
          url: `${M_POOLX_HOST}?isBanner=1&loading=2&appNeedLang=true`,
        },
        `${MAINSITE_HOST}/earn`,
      );
    },
  },
  LOAN_DISCOUNT: {
    bizType: 'LOAN_DISCOUNT',
    title: _t('27ee3adf3fac4000a94f'),
    tip: _t('9329e13e69634000a593'),
    goText: _t('21e82d10f1814000a10a'),
    onClick: () => {
      // todo app 未给出
      callJump(
        {
          url: addLangToPath(`${MAINSITE_HOST}/institution/borrow`),
        },
        `${MAINSITE_HOST}/institution/borrow`,
      );
    },
  },
  PAYMENT_KUCARD_RETURN: {
    bizType: 'PAYMENT_KUCARD_RETURN',
    title: _t('bd2b6d511e944000a55f'),
    tip: _t('d9cc2d8524344000a3e1'),
    goText: _t('21e82d10f1814000a10a'),
    onClick: () => {
      const url = `${MAINSITE_HOST}/kucard`;
      callJump(
        {
          url: addLangToPath(url),
        },
        url,
      );
    },
  },
  ASSET_WITHDRAW_RETURN: {
    bizType: 'ASSET_WITHDRAW_RETURN',
    title: _t('06ce066f11a84000a704'),
    tip: _t('b8c2cb3b87ca4000a51b'),
    goText: _t('3baf930bca714000a52a'),
    onClick: () => {
      callJump(
        {
          url: `/account/withdraw`,
        },
        `${MAINSITE_HOST}/assets/withdraw`,
      );
    },
  },
};

const K0Card = ({ title = '', tip, bizType, rights = '' }) => {
  return (
    <div className="card cardHover" key={bizType}>
      <div className="label">
        {title}
        <div className="infoWrap">
          <Tooltip title={tip}>
            <ICInfoOutlined className="ml-4 help" size={12} />
          </Tooltip>
        </div>
      </div>
      <div className="flex">
        <div className="value">{rights}</div>
        {/* <div className="flex-center">
          <Tag color="complementary">{_t('d201ef4e13a34000a7e2')}</Tag>
        </div> */}
      </div>
    </div>
  );
};

const VipCard = ({
  isSm,
  title,
  tip,
  goText,
  bizType,
  rights,
  onClick,
  isRTL,
  locationid,
  userLevel,
  currentLevel,
  goUpgradeHandle,
  setTitle,
}) => {
  return (
    <div
      className={clsx('card flex', {
        ['cardHover']: true,
      })}
      role="presentation"
      key={bizType}
      onClick={() => {
        sensors.trackClick([`RightBtn`, `${locationid}`], {
          kcs_level: userLevel,
          pagePosition: `${currentLevel}`,
          type: bizType,
          ...getScene(),
        });
        if (bizType === 'EARN_KCS_STAKING') {
          goUpgradeHandle();
        } else {
          onClick();
        }
      }}
    >
      <div>
        <div className="label">
          {title}
          <div className="infoWrap">
            {isSm ? (
              <ICInfoOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  setTitle(tip);
                }}
                className="ml-4 help"
                size={12}
              />
            ) : (
              <KuxTooltip title={tip}>
                <ICInfoOutlined className="ml-4 help" size={12} />
              </KuxTooltip>
            )}
          </div>
        </div>
        <div className="value">{rights}</div>
      </div>
      <div className="flex-center go">
        <span>{goText}</span>
        <ICArrowRight2Outlined
          className={clsx('ml-4', {
            reverse: isRTL,
          })}
          size={16}
        />
      </div>
    </div>
  );
};

function Benefits({ userLevel, currentLevel, isSm, kcsRights, goUpgradeHandle, originalLevel }) {
  const { isRTL } = useLocale();
  const [title, setTitle] = useState('');
  const isK0 = originalLevel === 0;

  return (
    <>
      {kcsRights.map((props, idx) => {
        const { bizType, kcsRights = [], kcsRightsMap } = props;
        const data = fileds[bizType] || {};
        let rights;
        if (!kcsRightsMap[currentLevel] || !fileds[bizType]) return null;
        rights = getRight(kcsRightsMap[currentLevel]);
        // 没有收益配置返回 null
        if (!rights) return null;

        if (isK0) {
          const k0Rights = getRight(kcsRightsMap[currentLevel]) || '';
          if (!k0Rights) return null;
          return <K0Card key={bizType} {...data} rights={k0Rights} isSm={isSm} />;
        }

        return (
          <VipCard
            key={bizType}
            {...data}
            rights={rights}
            isSm={isSm}
            isRTL={isRTL}
            locationid={idx + 1}
            userLevel={userLevel}
            currentLevel={currentLevel}
            goUpgradeHandle={goUpgradeHandle}
            setTitle={setTitle}
          />
        );
      })}
      <H5Tip
        visible={!!title}
        title={title}
        onClose={() => {
          setTitle('');
        }}
      />
    </>
  );
}
export default Benefits;

const getRight = (props) => {
  const { rightsType, rights } = props || {};
  if (!rightsType || !rights) return null;
  if (
    rightsType === 'weight' ||
    rightsType === 'feeDiscount' ||
    rightsType === 'kcsReturn' ||
    rightsType === 'aprAdd'
  ) {
    return percentFormat(dropZero(divide(rights, 100)));
  } else {
    return `${rights}x`;
  }
};
