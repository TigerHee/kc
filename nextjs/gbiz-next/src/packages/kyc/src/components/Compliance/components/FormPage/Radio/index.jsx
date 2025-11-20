/**
 * Owner: tiger@kupotech.com
 * 单排单选
 */
import clsx from 'clsx';
import { Parser } from 'html-to-react';
import { Tabs, Tab } from '@kux/mui';
import useFetch from 'kycCompliance/hooks/useFetch';
import { postJsonWithPrefix } from 'kycCompliance/service';
import useCommonData from 'kycCompliance/hooks/useCommonData';
import { RadioWrapper } from './style';

export const htmlToReactParser = new Parser();

export default ({
  componentTitle,
  value,
  onChange,
  complianceMetaCode,
  pageId,
  componentGroupId,
  componentId,
}) => {
  const { flowData, isSmStyle } = useCommonData();

  const { data } = useFetch(
    (param) => {
      return postJsonWithPrefix('/compliance/component/enum/list', param);
    },
    {
      cacheKey: complianceMetaCode || componentId,
      ready: complianceMetaCode || componentId,
      params: {
        complianceStandardCode: flowData?.complianceStandardCode,
        metaCode: complianceMetaCode,
        flowId: flowData?.flowId,
        pageId,
        componentGroupId,
        componentId,
      },
    },
  );

  const list = data?.list || [];

  return (
    <RadioWrapper className={clsx({ isSmStyle })}>
      <h3 className="radioTitle">{htmlToReactParser.parse(componentTitle)}</h3>

      <Tabs
        value={value}
        onChange={(event, newValue) => {
          onChange(newValue);
        }}
        variant="bordered"
        activeType="primary"
        showScrollButtons={false}
      >
        {list.map(({ code, name }) => (
          <Tab key={code} value={code} label={name} />
        ))}
      </Tabs>
    </RadioWrapper>
  );
};
