/**
 * Owner: tiger@kupotech.com
 */
import { useState, useMemo } from 'react';
import classnames from 'classnames';
import { Dropdown, Input, styled } from '@kux/mui';
import { ICSearchOutlined, ICTriangleBottomOutlined } from '@kux/icons';
import { GetPhoneArea } from '../../../service';
import useFetch from '../../../hooks/useFetch';
import useCommonData from '../../../hooks/useCommonData';
import useLang from '../../../../../hookTool/useLang';

const CusDropdown = styled(Dropdown)`
  .customDropdown {
    transform: translate(0, 38px) !important;
    width: 100%;
  }
`;
const AddonLine = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  height: 56px;
  color: ${({ theme }) => theme.colors.text};
`;
const DropdownIcon = styled(ICTriangleBottomOutlined)`
  margin-left: 4px;
  font-size: 12px;
  transition: all 0.3s ease;
  transform: ${({ visible }) => (visible ? 'rotate(-180deg)' : 'rotate(0)')};
  color: ${({ theme }) => theme.colors.text60};
`;
const Overlay = styled.div`
  position: absolute;
  border-radius: 8px;
  top: 25px;
  left: 0;
  width: 576px;
  max-width: 736px;
  height: unset;
  background: ${({ theme }) => theme.colors.layer};
  box-shadow: rgba(0, 0, 0, 0.06) 0px 4px 40px;
  &.isSmStyle {
    width: calc(100vw - 32px);
  }
`;
const InputLine = styled.div`
  padding: 16px 16px 8px;
`;
const SearchIcon = styled(ICSearchOutlined)`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
`;
const List = styled.div`
  max-height: 250px;
  overflow: auto;
  margin: 0px;
  flex: 1;
  padding-bottom: unset;
`;
const ListItem = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  cursor: pointer;
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  &:hover {
    background-color: ${({ theme }) => theme.colors.cover2};
  }
  &.active {
    background-color: ${({ theme }) => theme.colors.cover2};
  }
  &.disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.text40};
  }
`;
const ListLeft = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 23px;
    height: 16px;
    margin-right: 8px;
  }
`;

export default (props) => {
  const { isSmStyle, flowData } = useCommonData();
  const { value, onChange, complianceMetaCode } = props;
  const { _t } = useLang();

  const {
    data: { list: listData = [] },
  } = useFetch(GetPhoneArea, {
    cacheKey: 'PhoneArea',
    ready: flowData?.complianceStandardCode && complianceMetaCode,
    params: {
      complianceStandardCode: flowData?.complianceStandardCode,
      metaCode: complianceMetaCode,
    },
  });

  const [visible, setVisible] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const getLocaleLowerVal = (v) => {
    if (!v) {
      return v;
    }
    return v.toLocaleLowerCase();
  };

  const listRenderData = useMemo(() => {
    if (!searchVal) {
      return listData?.filter((i) => i.isDisplay);
    }
    return listData?.filter(
      (i) => i.isDisplay && getLocaleLowerVal(i.name).includes(getLocaleLowerVal(searchVal)),
    );
  }, [searchVal, listData]);

  const OverlayRender = (
    <Overlay
      className={classnames({
        isSmStyle,
      })}
    >
      <InputLine>
        <Input
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            e.target.focus();
          }}
          prefix={<SearchIcon />}
          size="xlarge"
          placeholder={_t('h2nHmo4Fgqf7G5JpsNSTEt')}
          allowClear
        />
      </InputLine>
      <List>
        {listRenderData?.map((item) => {
          const { name, code, icon, isOptional } = item;
          const isDisabled = !isOptional;

          return (
            <ListItem
              key={name + code}
              onClick={() => {
                if (isDisabled) {
                  return;
                }
                onChange(code);
                setVisible(false);
              }}
              className={classnames({ active: code === value, disabled: isDisabled })}
            >
              <ListLeft>
                <img src={icon} alt="" />
                <span>{name}</span>
              </ListLeft>

              <span>{code}</span>
            </ListItem>
          );
        })}
      </List>
    </Overlay>
  );

  return (
    <CusDropdown
      visible={visible}
      trigger="click"
      overlay={OverlayRender}
      popperClassName="customDropdown"
      placement="bottom-start"
      onVisibleChange={(v) => setVisible(v)}
    >
      <AddonLine onClick={() => setVisible(true)}>
        <span>{value || ''}</span>
        <DropdownIcon visible={visible} />
      </AddonLine>
    </CusDropdown>
  );
};
