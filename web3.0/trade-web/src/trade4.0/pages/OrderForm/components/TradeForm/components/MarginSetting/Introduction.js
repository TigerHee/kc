/*
  * owner: borden@kupotech.com
 */
import React, { useState, useCallback, Fragment } from 'react';
import { map } from 'lodash';
import styled from '@emotion/styled';
import Dialog from '@mui/Dialog';
import { ICQuestionOutlined } from '@kux/icons';
import TooltipWrapper from '@/components/TooltipWrapper';
import SvgComponent from '@/components/SvgComponent';
import { _t, _tHTML } from 'utils/lang';

/** 样式开始 */
const StyledDialog = styled(Dialog)`
  .KuxDialog-content {
    max-height: 390px;
  }
`;
const StyledICQuestionOutlined = styled(ICQuestionOutlined)`
  cursor: pointer;
  color: ${props => props.theme.colors.icon60};
`;
const TooltipContent = styled.a`
  color: #fff;
`;
const IntroductionItem = styled.div`
  display: flex;
  &:not(:first-of-type) {
    margin-top: 24px;
  }
`;
const IconBox = styled.div`
  color: ${props => props.theme.colors.text};
`;
const IntroductionContent = styled.div`
  margin-left: 16px;
`;
const IntroductionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;
const IntroductionDesc = styled.div`
  font-size: 14px;
  line-height: 130%;
  color: ${props => props.theme.colors.text60};
  margin-top: 8px;
`;
/** 样式结束 */

const Introduction = React.memo(({ data, title }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Fragment>
      <TooltipWrapper
        className="ml-4"
        disabledOnMobile
        title={
          <TooltipContent onClick={handleOpen}>
            {title}
          </TooltipContent>
        }
      >
        <StyledICQuestionOutlined
          size={14}
          onClick={handleOpen}
          className="horizontal-flip-in-arabic"
        />
      </TooltipWrapper>
      <StyledDialog
        open={open}
        size="medium"
        title={title}
        cancelText={null}
        onOk={handleCancel}
        onCancel={handleCancel}
        okText={_t('confirmed')}
        footerProps={{
          border: true,
        }}
      >
        {map(data, ({ value, Icon, iconId, label, describe }) => {
          const iconProps = { size: 20 };
          const IconComp = Icon ? (
            <Icon {...iconProps} />
          ) : iconId ? (
            <SvgComponent type={iconId} {...iconProps} />
          ) : null;
          return (
            <IntroductionItem key={value}>
              {IconComp && <IconBox>{IconComp}</IconBox>}
              <IntroductionContent>
                <IntroductionTitle>{label}</IntroductionTitle>
                <IntroductionDesc>{describe}</IntroductionDesc>
              </IntroductionContent>
            </IntroductionItem>
          );
        })}
      </StyledDialog>
    </Fragment>
  );
});

export default Introduction;
