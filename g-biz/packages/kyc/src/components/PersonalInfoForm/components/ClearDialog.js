/**
 * Owner: tiger@kupotech.com
 * 打回提示弹窗
 */
import React, { useState, useEffect } from 'react';
import { Dialog, styled, Checkbox } from '@kux/mui';
import classnames from 'classnames';
import { Parser } from 'html-to-react';
import { getKycFrontText } from '../service';

const htmlToReactParser = new Parser();

const StyledDialog = styled(Dialog)`
  & .KuxDialog-body {
    margin: 8px;
  }
  & .KuxModalHeader-root {
  }
  & .KuxDialog-content {
  }
`;
const Wrapper = styled.div`
  .KuxCheckbox-wrapper {
    display: flex;
  }
  .KuxCheckbox-checkbox {
    padding-top: 3px;
  }
  &.isChecked {
    .KuxCheckbox-inner {
      background-color: ${({ theme }) => theme.colors.text};
      border-color: ${({ theme }) => theme.colors.text};
    }
  }
`;
const Content = styled.div`
  margin-bottom: 16px;
`;
const ContentItem = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text60};
  span {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`;
const CheckboxDesc = styled.div`
  display: inline-block;
  font-weight: 400;
  font-size: 13px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  span {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default (props) => {
  const [isChecked, setChecked] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    getKycFrontText({ scence: 1 }).then((res) => {
      setData(res?.data?.kycClearPopUpText || {});
    });
  }, []);

  return (
    <StyledDialog
      {...props}
      cancelText={null}
      okButtonProps={{
        disabled: !isChecked,
      }}
      title={data?.title}
      okText={data?.buttonTxt}
    >
      <Wrapper
        className={classnames({
          isChecked,
        })}
      >
        <Content>
          {[data?.contentTop, data?.contentMid, data?.contentBot].map((item) => (
            <ContentItem key={item}>{htmlToReactParser.parse(item)}</ContentItem>
          ))}
        </Content>
        <Checkbox
          checked={isChecked}
          onChange={(e) => {
            setChecked(e.target.checked);
          }}
        >
          <CheckboxDesc
            onClick={(e) => {
              e.stopPropagation();
              if (data?.statementUrl && e?.target?.nodeName?.toLocaleUpperCase() === 'SPAN') {
                window.open(data?.statementUrl, '_blank');
              }
            }}
          >
            {htmlToReactParser.parse(data?.statement)}
          </CheckboxDesc>
        </Checkbox>
      </Wrapper>
    </StyledDialog>
  );
};
