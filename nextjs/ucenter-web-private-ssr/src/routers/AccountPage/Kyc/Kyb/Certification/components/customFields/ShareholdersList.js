/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Box, Checkbox, Form, styled } from '@kux/mui';
import { TOTAL_FIELDS, VERIFY_CONTAINER_CLASS_NAME } from 'routes/AccountPage/Kyc/config';
import { _t, _tHTML } from 'src/tools/i18n';
import useKybStatus from '../../../../hooks/useKybStatus';
import useRelativeGap from '../../hooks/useRelativeGap';
import { Block, Layout, LayoutLeft, LayoutRight, WarningBox } from '../styled';
import { UploadFieldInner } from '../UploadField';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const { FormItem } = Form;

const CheckboxWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  .KuxForm-itemHelp {
    display: none;
  }
  .upload-inner {
    margin-top: 16px;
    padding: 0 28px;
    > div:first-child {
      font-size: 13px;
      line-weight: 150%;
    }
    > div:nth-child(2) {
      font-size: 12px;
    }
    > div:nth-child(3) {
      margin-top: 16px;
    }
  }
`;
const CheckboxText = styled.span`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%; /* 18.2px */
  b {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
  }
`;
const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.divider4};
`;

/** 股东名单 */
const ShareholdersList = ({
  required = true,
  /** 不展示个人股东选项 */
  noIndividual = false,
  /** 不展示机构股东选项 */
  noInstitutional = false,
  ...props
}) => {
  const { form, formData, rejectedReasons } = props;
  const rv = useResponsiveSSR();
  const { kybStatus, kybStatusEnum } = useKybStatus();
  const isLG = !rv?.lg;
  const isRejected = kybStatus === kybStatusEnum.REJECTED;

  const { targetRef, parentRef, gap } = useRelativeGap({ disabled: isLG, debug: true });

  const noSub = noIndividual && noInstitutional;

  const tips = <WarningBox>{_t('2af54c8fac7b4800a938')}</WarningBox>;

  const tips2 = <WarningBox>{_t('d6db3f24caf04000adc6')}</WarningBox>;

  return (
    <>
      <Layout ref={parentRef}>
        <LayoutLeft className={VERIFY_CONTAINER_CLASS_NAME}>
          <Block>
            <UploadFieldInner
              name={TOTAL_FIELDS.shareholdersAttachment}
              disabled={isRejected && !rejectedReasons[TOTAL_FIELDS.shareholdersAttachment]}
              required={required}
              tips={isLG && !noSub ? tips : null}
              {...props}
            />
            {!noSub ? (
              <CheckboxWrapper>
                <Divider ref={targetRef} />
                {isLG &&
                ((!noIndividual && formData?.detailIndividualShareholdersRatio) ||
                  (!noInstitutional && formData?.detailInstitutionShareholdersRatio)) ? (
                    <>{tips2}</>
                  ) : null}
                {!noIndividual ? (
                  <div>
                    <FormItem name="detailIndividualShareholdersRatio">
                      <Checkbox
                        checked={formData?.detailIndividualShareholdersRatio}
                        onChange={() => {
                          form.setFieldsValue({
                            detailIndividualShareholdersRatio:
                              !formData?.detailIndividualShareholdersRatio,
                          });
                        }}
                      >
                        <CheckboxText>{_tHTML('abb21d0a9a0d4000a2ea')}</CheckboxText>
                      </Checkbox>
                    </FormItem>
                    {formData?.detailIndividualShareholdersRatio ? (
                      <UploadFieldInner
                        name={TOTAL_FIELDS.actualController}
                        disabled={isRejected && !rejectedReasons[TOTAL_FIELDS.actualController]}
                        required={required}
                        onlyImage
                        {...props}
                      />
                    ) : null}
                  </div>
                ) : null}
                {!noInstitutional ? (
                  <div>
                    <FormItem name="detailInstitutionShareholdersRatio">
                      <Checkbox
                        checked={formData?.detailInstitutionShareholdersRatio}
                        onChange={() => {
                          form.setFieldsValue({
                            detailInstitutionShareholdersRatio:
                              !formData?.detailInstitutionShareholdersRatio,
                          });
                        }}
                      >
                        <CheckboxText>{_tHTML('0da144e3ba384800a7cb')}</CheckboxText>
                      </Checkbox>
                    </FormItem>
                    {formData?.detailInstitutionShareholdersRatio ? (
                      <UploadFieldInner
                        name={TOTAL_FIELDS.shareholdingExceedsOneFourth}
                        disabled={
                          isRejected && !rejectedReasons[TOTAL_FIELDS.shareholdingExceedsOneFourth]
                        }
                        required={required}
                        {...props}
                      />
                    ) : null}
                  </div>
                ) : null}
              </CheckboxWrapper>
            ) : null}
          </Block>
        </LayoutLeft>
        <LayoutRight>
          {!isLG && !noSub ? (
            <div style={{ marginTop: gap }}>
              {tips}
              {formData?.detailIndividualShareholdersRatio ||
              formData?.detailInstitutionShareholdersRatio ? (
                  <>
                    <Box size={12} />
                    {tips2}
                  </>
                ) : null}
            </div>
          ) : null}
        </LayoutRight>
      </Layout>
    </>
  );
};

export default ShareholdersList;
