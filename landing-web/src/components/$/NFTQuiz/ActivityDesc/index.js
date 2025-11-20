/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useRef, useMemo } from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem as _r } from '@kufox/mui/utils';
import { map } from 'lodash';
import { _t } from 'utils/lang';
import { useExpose } from 'utils/ga';
import Card from '../Card';
import { Title } from '../LearnNFT/styled';
import { useQuizContext } from '../context';

const exposeFunc = () => {
  return {
    spm: ['Rules', '1'],
  };
};

const Wrapper = styled(Card)`
  padding: ${_r(16)};
  margin-top: ${_r(16)};
  margin-bottom: ${_r(32)};
  background: rgba(29, 33, 36, 0.4);;
`;

const RuleTitle = styled(Title)`
  margin-bottom: ${_r(16)};
`;

const ListItem = styled.section`
  font-weight: 400;
  color: #fff;
  opacity: 0.4;
  font-size: ${_r(14)};
  margin-bottom: ${_r(12)};
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 105%;
    ::before {
    content: '';
    display: inline-block;
    width: ${_r(6)};
    height: ${_r(6)};
    margin-right: ${_r(6)};
    border-radius: 50%;
    background-color: rgba(255,255,255,.4);
  }
  }
  .content {
    line-height: 140%;
    margin-left: ${_r(12)};
  }
`;


const ActivityDesc = () => {
  const ref = useRef(null);
  useExpose(ref, exposeFunc);
  const { activityConfig } = useQuizContext();
  const { answer } = activityConfig || {};
  const { tradeAmount = '' } = answer || {};
  const list = useMemo(() => {
    return [
      {
        title: 'kJni6r5ZsPNpDigqui2ko6',
        content: [
          {
            title: 'pt98yJQbA4VVNudRdUQDPd',
          },
        ],
      },
      {
        title: 'su16GSvqaqakm9nhi9uwrY',
        content: [
          {
            title: 'h7vx8xJEyMQr9VWVnUgvtP',
          },
          {
            title: '37j5S9B1RHAaVFffq2eLvs',
            data: {
              Amount: tradeAmount,
            }
          },
          {
            title: 'rtzLmZuHZqSoD8uzhpmkKE',
          },
          {
            title: '57GNvGm1WDCdxh5sMXingz',
          },
          {
            title: '6iPUHoWP5DkAEaZJkDtGQk',
          },
          {
            title: '2ScGee9LwXzmKAHnwvb8ua',
          }
        ],
      },
      {
        title: 'jh3Pnvej5wa7qz6N9eR54H',
        content: [
          {
            title: 'r8Q3ddA6SVS7p1iVm8UeEu'
          },
          {
            title: 'hw1vFJfa3q33LqyHcUEH6i'
          },
          {
            title: 'gKVBVeamtPKFCjJtpqdSra',
          },
          {
            title: 'cpZac1sp7TZW8HbQyoskUd',
          },
        ],
      }
    ];
  }, [tradeAmount]);

  return (
    <Wrapper>
      <RuleTitle ref={ref}>
        {_t('vkwNBegPUryGQhnXhcd9g4')}
      </RuleTitle>
      {
        map(list, (item) => {
          const { title, content } = item;
          return (
            <ListItem key={title}>
              <p className='title'>{_t(title)}</p>
              {
                map(content, ({ title: contentTitle, data }) => {
                  return (
                    <p className='content' key={contentTitle}>
                      {_t(contentTitle, data)}
                    </p>
                  )
                })
              }
            </ListItem>
          )
        })
      }
    </Wrapper>
  );
};

export default ActivityDesc;