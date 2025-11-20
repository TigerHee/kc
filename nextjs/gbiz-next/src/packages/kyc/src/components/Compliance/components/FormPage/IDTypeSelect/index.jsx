/**
 * Owner: tiger@kupotech.com
 */
import { useEffect } from 'react';
import { styled } from '@kux/mui';
import clsx from 'clsx';
import { ICSuccessFilled, ICSuccessUnselectOutlined } from '@kux/icons';
import { getIssueCountryCode } from 'kycCompliance/config';
import useLang from 'packages/kyc/src/hookTool/useLang';
import { GetIDTypeList } from 'kycCompliance/service';
import useFetch from 'kycCompliance/hooks/useFetch';
import useCommonData from 'kycCompliance/hooks/useCommonData';

const Main = styled.div`
  .componentTitle {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    margin-bottom: 8px;
    color: var(--color-text);
  }
`;
const Item = styled.div`
  border-radius: 8px;
  padding: 16px 16px 14px;
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid var(--color-divider8);
  &:last-child {
    margin-bottom: 0;
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.4;
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
  overflow: hidden;
  background-color: var(--color-cover4);
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
  img {
    width: 100%;
    height: 100%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }
`;
const Title = styled.div`
  display: flex;
  align-items: center;
  & > p {
    font-weight: 500;
    font-size: 18px;
    line-height: 130%;
    margin: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    color: var(--color-text);
  }
  &.isSmStyle {
    & > p {
      font-size: 14px;
    }
  }
`;
const DisabledTag = styled.div`
  display: inline-block;
  border-radius: 4px;
  padding: 2px 6px;
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  margin-left: 8px;
  color: var(--color-text);
  background-color: var(--color-cover8);
`;
const SelectIcon = styled(ICSuccessFilled)`
  font-size: 24px;
  color: var(--color-text);
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
const UnSelectIcon = styled(ICSuccessUnselectOutlined)`
  font-size: 24px;
  color: var(--color-icon40);
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

export default ({
  componentGroupTitle,
  componentGroupDesc,
  complianceMetaCode,
  componentTitle,
  ...props
}) => {
  const { isSmStyle, flowData, formData } = useCommonData();
  const { _t } = useLang();
  const { value, onChange } = props;
  const region = getIssueCountryCode(formData);

  const {
    data: { list: listData = [] },
    onFetchData,
  } = useFetch(GetIDTypeList, { autoFetch: false, cacheKey: 'IDTypeSelect' });

  useEffect(() => {
    onFetchData({
      region,
      metaCode: complianceMetaCode,
      complianceStandardCode: flowData?.complianceStandardCode,
    });
  }, [region]);

  return (
    <Main>
      {componentTitle && <div className="componentTitle">{componentTitle}</div>}
      {(listData || [])
        .filter((i) => i.isDisplay)
        .map((item) => {
          const { name, icon, isOptional } = item;
          const isDisabled = !isOptional;
          const code = String(item?.code);

          return (
            <Item
              key={code}
              onClick={() => {
                if (isDisabled) {
                  return;
                }
                onChange(code);
              }}
              className={clsx({
                disabled: isDisabled,
              })}
            >
              <ItemContent>
                <ImgBox>
                  <img src={icon} alt="" />
                </ImgBox>

                <Title
                  className={clsx({
                    isSmStyle,
                  })}
                >
                  <p>{name}</p>
                  {isDisabled ? <DisabledTag>{_t('uCQNHSVrZKcrqS71dULWqJ')}</DisabledTag> : null}
                </Title>
              </ItemContent>
              {code === value ? <SelectIcon /> : <UnSelectIcon />}
            </Item>
          );
        })}
    </Main>
  );
};
