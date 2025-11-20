/**
 * Owner: jacky@kupotech.com
 */

import { ICInfoOutlined } from '@kux/icons';
import { Button, Dialog, styled } from '@kux/mui';
import { useState } from 'react';
import { _t } from 'tools/i18n';

/**
 * 点击退出或撤销时的弹窗提示，包含被处理的事务信息
 * @param {Object} props
 * @param {string} props.title - 弹窗标题
 * @param {string} props.subtitle - 内容副标题
 * @param {string[]} props.items - 详细信息列表
 * @param {string} props.warning - 风险警告文本
 * @param {string} props.note - 提示说明
 * @param {boolean} props.open - 控制弹窗是否打开
 * @param {Function} props.onOk - 确认按钮的回调函数
 * @param {Function} props.onCancel - 取消按钮的回调函数
 * @param {React.ReactNode} props.footer - 自定义底部内容
 */
export function CardModal(props) {
  const [btnLoading, setBtnLoading] = useState(false);
  return (
    <Dialog
      title={props.title}
      open={props.open}
      onCancel={props.onCancel}
      footer={
        props.footer ? (
          props.footer
        ) : (
          <FooterWrapper>
            <FooterBtn type="default" onClick={props.onCancel}>
              {_t('margin.cancel')}
            </FooterBtn>
            <FooterBtn
              onClick={async () => {
                setBtnLoading(true);
                await props.onOk();
                setBtnLoading(false);
              }}
              loading={btnLoading}
            >
              {_t('margin.confirm')}
            </FooterBtn>
          </FooterWrapper>
        )
      }
    >
      <ContentWrapper>
        {props.subtitle ? <Text>{props.subtitle}</Text> : null}
        {props.items ? (
          <ItemsList>
            {props.items.map((item) => (
              <ListItem key={item}>{item}</ListItem>
            ))}
          </ItemsList>
        ) : null}
        {props.warning ? <Text style={{ marginTop: 12 }}>{props.warning}</Text> : null}
        {props.note ? (
          <NoteBox>
            <IconWrapper>
              <ICInfoOutlined size={16} />
            </IconWrapper>
            <NoteText>{props.note}</NoteText>
          </NoteBox>
        ) : null}
      </ContentWrapper>
    </Dialog>
  );
}

const ContentWrapper = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  padding: 0 0 16px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
`;

export const FooterWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 16px 32px 32px 32px;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const FooterBtn = styled(Button)`
  display: flex;
  padding: 10px 24px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex: 1 0 0;
`;

const Text = styled.p`
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text60};
`;

const ItemsList = styled.ul`
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
  width: 100%;
`;

const ListItem = styled.li`
  margin: 0;
  padding: 0 0 0 20px;
  position: relative;
  font-size: 16px;
  line-height: 160%;
  color: ${({ theme }) => theme.colors.text60};

  &:before {
    position: absolute;
    left: 5px;
    color: ${({ theme }) => theme.colors.text60};
    content: '•';
  }
`;

const NoteBox = styled.div`
  margin-top: 16px;
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.cover4};
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text60};
`;

const NoteText = styled.span`
  font-size: 16px;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text60};
`;
