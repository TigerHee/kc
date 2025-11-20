/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Form, Radio, styled } from '@kux/mui';
import { useEffect, useRef, useState } from 'react';
import { TOTAL_FIELDS, VERIFY_CONTAINER_CLASS_NAME } from 'routes/AccountPage/Kyc/config';
import { _t } from 'src/tools/i18n';
import useRelativeGap from '../../hooks/useRelativeGap';
import useRules from '../../hooks/useRules';
import { Block, Layout, LayoutLeft, LayoutRight, WarningBox } from '../styled';
import { UploadFieldInner } from '../UploadField';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const Content = styled.div`
  padding-top: 20px;
  margin-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.cover4};
`;
const ExGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const RadioWrapper = styled.div`
  .KuxForm-itemHelp {
    display: ${({ hasError }) => (hasError ? 'flex' : 'none')};
  }
`;

/** 有无董事会 */
const DirectorsBoard = (props) => {
  const { form, formData, registerValidate } = props;
  const rv = useResponsiveSSR();
  const [hasError, setHasError] = useState(false);
  const rules = useRules({
    name: TOTAL_FIELDS.detailDirectorSingle,
    required: true,
    formData,
  });

  const { detailDirectorSingle } = formData ?? {};
  const isLG = !rv?.lg;

  const showTips2 = detailDirectorSingle === false;

  const tip1Ref = useRef();
  const { targetRef, parentRef, gap } = useRelativeGap({ disabled: isLG || !showTips2 });

  useEffect(() => {
    const unregister = registerValidate(() => {
      setHasError(Boolean(form.getFieldError('detailDirectorSingle')?.[0]));
    });
    return () => unregister();
  }, [form, registerValidate]);

  const tips2 = <WarningBox>{_t('f17b188922394000a0ee')}</WarningBox>;

  return (
    <Layout ref={parentRef}>
      <LayoutLeft className={VERIFY_CONTAINER_CLASS_NAME}>
        <Block>
          <RadioWrapper hasError={hasError}>
            <Form.FormItem name={TOTAL_FIELDS.detailDirectorSingle} rules={rules}>
              <ExGroup value={formData?.detailDirectorSingle} size="small">
                <Radio value={false}>{_t('abb9d58bddcd4800a240')}</Radio>
                <Radio value={true}>{_t('c6518ce4ddab4000aef0')}</Radio>
              </ExGroup>
            </Form.FormItem>
          </RadioWrapper>
          {typeof detailDirectorSingle === 'boolean' ? (
            <Content>
              <UploadFieldInner
                ref={targetRef}
                name={
                  detailDirectorSingle
                    ? TOTAL_FIELDS.authorizeAttachment
                    : TOTAL_FIELDS.boardResolution
                }
                descWrapper={(children) => (
                  <>
                    {detailDirectorSingle ? (
                      <span>{_t('c2c5a7e92b174800ad5d')}</span>
                    ) : (
                      <span>{_t('8ec8ea97f8fb4000a57a')}</span>
                    )}
                    {children}
                  </>
                )}
                required
                tips={isLG && showTips2 ? tips2 : null}
                {...props}
              />
            </Content>
          ) : null}
        </Block>
      </LayoutLeft>
      <LayoutRight>
        {!isLG && showTips2 ? <div style={{ marginTop: gap }}>{tips2}</div> : null}
      </LayoutRight>
    </Layout>
  );
};

export default DirectorsBoard;
