import { styled, Alert } from '@kux/mui';
import { Parser } from 'html-to-react';
import clsx from 'clsx';
import useCommonData from 'kycCompliance/hooks/useCommonData';
import JsBridge from 'tools/jsBridge';

export const htmlToReactParser = new Parser();

export const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  color: var(--color-text);
`;
export const DescWrapper = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 130%;
  font-weight: 400;
  margin-top: 8px;
  margin-bottom: 24px;
  color: var(--color-text40);
  .descItem {
    font-size: 16px;
    line-height: 130%;
  }
`;
export const FormGroupTipBox = styled.div`
  margin-bottom: 16px;
  .componentGroupTitle {
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%;
    color: var(--color-text);
  }
  .componentGroupDesc {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-top: 4px;
    color: var(--color-text40);
  }
`;
export const FormGroupBox = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  row-gap: 0;
  column-gap: 16px;
  &.FormGroupBoxBorder {
    padding: 24px 24px 0;
    border-radius: 12px;
    margin-bottom: 40px;
    border: 1px solid var(--color-divider8);
  }
`;
export const FormGroupItemBox = styled.div`
  flex: 1;
  flex-shrink: 0;
  max-width: 100%;
  .KuxDatePicker-wrapper svg {
    width: 16px;
    height: 16px;
  }
`;
export const StatementTitle = styled.div`
  position: relative;
  left: 0;
  right: 0;
  text-align: left;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  color: var(--color-text);

  a {
    text-decoration: underline;
    color: var(--color-text);
  }
`;
export const Statement = styled.div`
  position: relative;
  left: 0;
  right: 0;
  text-align: left;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 180%;
  color: var(--color-text40);
  b {
    color: var(--color-text);
    font-weight: 500;
  }
  a {
    text-decoration: underline;
    color: var(--color-text);
  }
  ul {
    list-style: disc;
    padding-left: 8px;
    margin-left: 16px;
  }
  &.isSmStyle {
    padding: 0;
  }
`;

export const StatementEl = ({ componentContent, componentTitle }) => {
  const { isSmStyle } = useCommonData();

  return (
    <>
      {componentTitle && (
        <StatementTitle
          className={clsx({
            isSmStyle,
          })}
        >
          {htmlToReactParser.parse(componentTitle)}
        </StatementTitle>
      )}
      {componentContent && (
        <Statement
          className={clsx({
            isSmStyle,
          })}
          onClick={e => {
            e.preventDefault();
            if (e?.target?.nodeName?.toLocaleUpperCase() === 'A' && e?.target?.href) {
              const url = e?.target?.href?.includes('?')
                ? `${e?.target?.href}&appNeedLang=true`
                : `${e?.target?.href}?appNeedLang=true`;

              if (JsBridge.isApp()) {
                JsBridge.open({
                  type: 'jump',
                  params: {
                    url: `/link?url=${url}`,
                  },
                });
              } else {
                window.open(url, '_blank');
              }
            }
            return false;
          }}
        >
          {htmlToReactParser.parse(componentContent)}
        </Statement>
      )}
    </>
  );
};

export const EmptyCom = ({ componentCode, complianceMetaCode }) => {
  return (
    <Alert
      type="error"
      title={
        <>
          <div>出现了不能识别的组件</div>
          <div>componentCode: {componentCode}</div>
          <div>complianceMetaCode: {complianceMetaCode}</div>
        </>
      }
    />
  );
};
