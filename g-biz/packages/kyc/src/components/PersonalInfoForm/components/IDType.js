/**
 * Owner: lena@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { map } from 'lodash';
import { styled, Spin } from '@kux/mui';
import { ICSuccessFilled, ICSuccessUnselectOutlined } from '@kux/icons';
import IcArrowDownIcon from '../../../../static/images/ic_arrow_down.svg';
import IcArrowUpIcon from '../../../../static/images/ic_arrow_up.svg';
import { IDENTITY_TYPE } from '../../../common/constants';
import { namespace } from '../model';

const Wrapper = styled.div`
  display: block;
`;
const Item = styled.div`
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.colors.divider8};
  &:last-child {
    margin-bottom: 0;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 12px 16px;
  }
`;
const ItemContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;
const ImgBox = styled.div`
  width: 52px;
  height: 52px;
  margin-right: 16px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.cover4};
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
  img {
    height: 30px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    img {
      height: 24px;
    }
  }
  &.special {
    width: 64px;
    height: 64px;
    border-radius: 8px;
    img {
      width: 48px;
      height: 48px;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 60px;
      height: 60px;
      margin-right: 8px;
      img {
        height: 24px;
      }
    }
  }
`;
const More = styled.div`
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  margin: 16px 0;
  cursor: pointer;
  & > img {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-left: 4px;
  }
`;
const Title = styled.div`
  & > p {
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    margin: 0;
    color: ${(props) => props.theme.colors.text};
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
`;
const Tag = styled.div`
  display: inline-block;
  border-radius: 4px;
  padding: 2px 6px;
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  margin-top: 4px;
  margin-right: 16px;
  color: ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.primary8};
`;
const SelectIcon = styled(ICSuccessFilled)`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
const UnSelectIcon = styled(ICSuccessUnselectOutlined)`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.icon40};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const IDType = ({
  _t,
  identityType,
  setFieldsValue,
  handleGA,
  loading,
  handleScroll,
  onChange,
}) => {
  const recommendIdType = useSelector((state) => state[namespace].recommendIdType);
  const specialTypeList = useSelector((state) => state[namespace].specialTypeList || []);
  const [defaultList, setDefaultList] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [showMore, setShowMore] = useState(true);
  const [moreList, setMoreList] = useState([]);
  const [shoMoreText, setShoMoreText] = useState(false);
  const [needScroll, setNeedScroll] = useState(false);

  useEffect(() => {
    if (specialTypeList.length > 0) {
      setDefaultList(specialTypeList);
      setShoMoreText(true);
      setMoreList(IDENTITY_TYPE);
      setNeedScroll(false);
    } else {
      setShoMoreText(false);
      setDefaultList(IDENTITY_TYPE);
    }
  }, [specialTypeList]);

  useEffect(() => {
    setSelectedType(identityType);
  }, [identityType]);

  const onClick = (type) => {
    let locationid = '';
    switch (type) {
      case 'idcard':
        locationid = '1';
        break;
      case 'passport':
        locationid = '2';
        break;
      case 'drivinglicense':
        locationid = '3';
        break;
      case 'nin':
        locationid = '4';
        break;
      case 'bvn':
        locationid = '5';
        break;
      default:
        locationid = type;
        break;
    }
    handleGA('InfoEdit1IDType', locationid);
    setSelectedType(selectedType === type ? '' : type);
    setFieldsValue(type === selectedType ? null : type);
    onChange(type === selectedType ? null : type);
  };

  const handleClickMore = () => {
    setShowMore(!showMore);
    setMoreList(IDENTITY_TYPE);
    setNeedScroll(!showMore);
  };

  useEffect(() => {
    if (showMore && needScroll) {
      handleScroll();
    }
  }, [showMore, needScroll]);

  const RenderList = ({ list, showTag = false, recommendIdType }) => {
    return (
      <>
        {map(list, (item) => {
          return (
            <Item
              key={item?.type}
              selected={item?.type === selectedType}
              onClick={() => {
                onClick(item?.type);
              }}
            >
              <ItemContent>
                <ImgBox
                  className={classnames({
                    special: item?.icon,
                  })}
                >
                  <img src={item?.icon || item?.src} alt="" />
                </ImgBox>

                <Title>
                  <p>{item?.icon ? item?.name : _t(item?.name)}</p>
                  {showTag ? <Tag>{_t('6SBwjkygGqqK5dLf7Q4Szp')}</Tag> : null}
                  {recommendIdType === item?.type ? <Tag>{_t('kyc_process_recommend')}</Tag> : null}
                </Title>
              </ItemContent>
              {item?.type === selectedType ? <SelectIcon /> : <UnSelectIcon />}
            </Item>
          );
        })}
      </>
    );
  };

  return (
    <Wrapper>
      <Spin spinning={loading}>
        <RenderList list={defaultList} showTag={shoMoreText} recommendIdType={recommendIdType} />
        {shoMoreText ? (
          <>
            <More onClick={handleClickMore}>
              {_t('oVc85TNtSoeN9gaKd8s6nd')}
              <img src={showMore ? IcArrowUpIcon : IcArrowDownIcon} alt="" />
            </More>
            {showMore ? <RenderList list={moreList} recommendIdType={recommendIdType} /> : null}
          </>
        ) : null}
      </Spin>
    </Wrapper>
  );
};
export default IDType;
