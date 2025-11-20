/**
 * Owner: tiger@kupotech.com
 */
import { useEffect } from 'react';
import { styled } from '@kux/mui';
import classnames from 'classnames';
import { ICSuccessFilled, ICSuccessUnselectOutlined } from '@kux/icons';
import useLang from '../../../../../hookTool/useLang';
import { GetIDTypeList } from '../../../service';
import useFetch from '../../../hooks/useFetch';
import useCommonData from '../../../hooks/useCommonData';
import { getIssueCountryCode } from '../../../config';

const ExtraLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 4px;
  color: ${(props) => props.theme.colors.text};
`;
const ExtraDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 16px;
  color: ${(props) => props.theme.colors.text40};
`;
const Main = styled.div``;
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
  border: 1px solid ${(props) => props.theme.colors.divider8};
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
  background-color: ${(props) => props.theme.colors.cover4};
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
    color: ${(props) => props.theme.colors.text};
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
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.cover8};
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

export default ({ componentGroupTitle, componentGroupDesc, complianceMetaCode, ...props }) => {
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
    <>
      <ExtraLabel>{componentGroupTitle}</ExtraLabel>
      {componentGroupDesc ? <ExtraDesc>{componentGroupDesc}</ExtraDesc> : null}

      <Main>
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
                className={classnames({
                  disabled: isDisabled,
                })}
              >
                <ItemContent>
                  <ImgBox>
                    <img src={icon} alt="" />
                  </ImgBox>

                  <Title
                    className={classnames({
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
    </>
  );
};
