import { styled, Alert } from '@kux/mui';
import { Parser } from 'html-to-react';
import classnames from 'classnames';
import useCommonData from '@kycCompliance/hooks/useCommonData';

export const htmlToReactParser = new Parser();

export const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;
export const DescWrapper = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 130%;
  font-weight: 400;
  margin-top: 8px;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text40};
  .descItem {
    font-size: 16px;
    line-height: 130%;
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
    border: 1px solid ${({ theme }) => theme.colors.divider8};
  }
`;
export const FormGroupItemBox = styled.div`
  flex: 1;
  flex-shrink: 0;
  max-width: 100%;
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
  color: ${(props) => props.theme.colors.text};

  a {
    text-decoration: underline;
    color: ${(props) => props.theme.colors.text};
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
  color: ${(props) => props.theme.colors.text40};
  b {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
  }
  a {
    text-decoration: underline;
    color: ${(props) => props.theme.colors.text};
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
          className={classnames({
            isSmStyle,
          })}
        >
          {htmlToReactParser.parse(componentTitle)}
        </StatementTitle>
      )}
      {componentContent && (
        <Statement
          className={classnames({
            isSmStyle,
          })}
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
