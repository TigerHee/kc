/**
 * Owner: garuda@kupotech.com
 */
import React, { Fragment, useMemo, useState } from 'react';

import { find, map } from 'lodash';

import Radio from '@mui/Radio';
import { Tabs } from '@mui/Tabs';

import { _t, addLangToPath, styled } from '../../builtinCommon';

const { Tab } = Tabs;

const IntroduceWrapper = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};
  margin-bottom: 20px;
`;

const DescriptionWrapper = styled.div``;

const ImgWrapper = styled.div`
  .imgWrapper {
    margin: 8px 0;
  }
`;

const TimeWeightedImgInfo = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const TimeWeightedImgItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  margin-right: 8px;
`;

const ItemTitle = styled.div`
  font-size: 10px;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.text60};
  line-height: 130%;
`;

const TypeTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
`;

const TypeRadio = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
  .KuxRadio-wrapper {
    font-size: 12px;
  }
  .KuxRadio-group {
    display: flex;
    align-items: center;
  }
`;

const TabsBar = styled.div`
  margin-bottom: 16px;
  .KuxTabs-container {
    height: 24px;
    div.KuxTab-TabItem {
      height: 24px;
      padding: 0 10px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 500;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
      background: none;
      border: none;
      border-radius: 4px;
      &:not(:first-of-type) {
        margin-left: 4px;
      }
      &.KuxTab-selected {
        color: ${(props) => props.theme.colors.text};
        background: ${(props) => props.theme.colors.cover4};
      }
    }

    .KuxTabs-scrollButton {
      height: 24px;
      padding-top: 4px;
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const DescriptionTitle = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 8px;
  margin-top: 20px;
  color: ${(props) => props.theme.colors.text};
`;

const ImgInfo = React.memo(({ img, imgItems }) => {
  return (
    <ImgWrapper>
      <div className="imgWrapper">
        <img alt="intro img" width="100%" src={img} />
      </div>
      <TimeWeightedImgInfo>
        {imgItems?.map((item, key) => {
          return (
            <TimeWeightedImgItem key={key}>
              {item?.itemIcon}
              <ItemTitle>{item?.itemTitle}</ItemTitle>
            </TimeWeightedImgItem>
          );
        })}
      </TimeWeightedImgInfo>
    </ImgWrapper>
  );
});

const DescriptionComp = React.memo(({ description }) => {
  return (
    <DescriptionWrapper>
      <DescriptionTitle>{_t('a723dec638eb4000a1fb')}</DescriptionTitle>
      {description}
    </DescriptionWrapper>
  );
});

const ContentItem = React.memo(({ illustration, sideIllustration, type, timeWeightedImgItems }) => {
  const [radioValue, setRadioValue] = useState('buy');

  const onRadioValueChange = (e) => {
    setRadioValue(e.target.value);
  };

  const currentItem = useMemo(() => {
    if (illustration) {
      return illustration;
    } else if (sideIllustration) {
      return sideIllustration[radioValue];
    }
  }, [illustration, sideIllustration, radioValue]);

  if (!currentItem) return null;

  return (
    <>
      <div className="flex ksb kvc">
        {type !== 'multi' && <TypeTitle>{_t('e20f82cba1214000a99c')}</TypeTitle>}
        {!!sideIllustration && (
          <TypeRadio>
            <Radio.Group size={'small'} onChange={onRadioValueChange} value={radioValue}>
              <Radio value={'buy'}>{_t('orders.dirc.buy')}</Radio>
              <Radio value={'sell'}>{_t('orders.dirc.sell')}</Radio>
            </Radio.Group>
          </TypeRadio>
        )}
      </div>
      <ImgInfo
        img={currentItem.img}
        imgItems={currentItem.timeWeightedImgItems || timeWeightedImgItems}
      />

      <DescriptionComp description={currentItem.description} />
    </>
  );
});

const InfoContent = React.memo(
  ({ introduce, sideIllustration, illustration, type, timeWeightedImgItems, subChilds }) => {
    const [childValue, setChildValue] = useState('postonly');

    const currentContentItem = useMemo(() => {
      if (subChilds) {
        const _item = find(subChilds, { value: childValue });
        if (_item) {
          return _item;
        }
      }
      return {};
    }, [subChilds, childValue]);

    const changeTabs = (e, v) => {
      setChildValue(v);
      e.stopPropagation();
    };

    return (
      <Fragment>
        <IntroduceWrapper>
          {introduce}
          <a href={addLangToPath('/support/26686562304793')} target="_blank" rel="noopener noreferrer">
            {_t('vgifMW83A6cpCuyPg7Hm9X')}
          </a>
        </IntroduceWrapper>
        {type === 'multi' && (
          <>
            <TabsBar>
              <Tabs
                size="xsmall"
                value={childValue}
                onChange={changeTabs}
                variant="bordered"
                bordered={!0}
              >
                {map(subChilds, (v) => {
                  return <Tab label={v.itemTitle} value={v.value} key={v.value} />;
                })}
              </Tabs>
            </TabsBar>
            <IntroduceWrapper>{currentContentItem?.itemInfo}</IntroduceWrapper>
          </>
        )}
        <ContentItem
          key={childValue}
          type={type}
          timeWeightedImgItems={timeWeightedImgItems}
          illustration={illustration}
          sideIllustration={sideIllustration}
          {...currentContentItem}
        />
      </Fragment>
    );
  },
);

export default InfoContent;
