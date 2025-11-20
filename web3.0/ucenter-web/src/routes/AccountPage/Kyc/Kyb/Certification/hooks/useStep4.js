/**
 * Owner: vijay.zhou@kupotech.com
 * 新版 kyb 步骤 4 （可选验证文件）的信息
 * 包含 title、状态、布局和表单元素
 */
import { difference, keys, pickBy } from 'lodash-es';
import { useMemo } from 'react';
import { _t } from 'src/tools/i18n';
import { COMPANY_TYPE, KYB_CERT_TYPES, TOTAL_FIELDS } from '../../../config';
import useKybStatus from '../../../hooks/useKybStatus';
import DirectorCertificate from '../components/customFields/DirectorCertificate';
import ShareholdersList from '../components/customFields/ShareholdersList';
import UploadField from '../components/UploadField';
import filterRejectedField from '../utils/filterRejectedField';

const useStep4 = ({ size, kybType, ...props }) => {
  const { kybStatus, kybStatusEnum } = useKybStatus();

  const sections = useMemo(() => {
    const { formData, rejectedReasons } = props;
    const { companyType, additionOperatorAttachment, additionOperatorAttachmentList } =
      formData ?? {};
    const commonSectionProps = {
      label: `${_t('ccb36ed70d284000a1ad')} ${_t('bce448f70a354000a28c')}`,
      description: _t('eff782f0f8b04000a80c'),
    };
    let res = [];

    const isRejected = kybStatus === kybStatusEnum.REJECTED;

    // 股东名单的子材料是否展示
    // 状态是拒绝且补充材料（第五步）里有相应的子材料时，隐藏这里的
    const noIndividual =
      isRejected &&
      (!rejectedReasons[TOTAL_FIELDS.actualController] ||
        (additionOperatorAttachment &&
          additionOperatorAttachmentList?.includes(TOTAL_FIELDS.actualController)));
    const noInstitutional =
      isRejected &&
      (!rejectedReasons[TOTAL_FIELDS.shareholdingExceedsOneFourth] ||
        (additionOperatorAttachment &&
          additionOperatorAttachmentList?.includes(TOTAL_FIELDS.shareholdingExceedsOneFourth)));

    if (kybType === KYB_CERT_TYPES.KUCOIN_PAY) {
      if (companyType === COMPANY_TYPE.NORMAL) {
        res = [];
      }
    } else {
      switch (companyType) {
        case COMPANY_TYPE.NORMAL:
          res = [
            {
              ...commonSectionProps,
              children: [
                {
                  name: TOTAL_FIELDS.dueDiligence,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.dueDiligence}
                      size={size}
                      required={false}
                      {...props}
                    />
                  ),
                },
              ],
            },
          ];
          break;
        case COMPANY_TYPE.LARGE_ENTERPRISES:
          res = [
            {
              ...commonSectionProps,
              children: [
                {
                  name: TOTAL_FIELDS.directorAttachment,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.directorAttachment}
                      size={size}
                      required={false}
                      {...props}
                    />
                  ),
                },
                {
                  name: TOTAL_FIELDS.dueDiligence,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.dueDiligence}
                      size={size}
                      required={false}
                      {...props}
                    />
                  ),
                },
              ],
            },
          ];
          break;
        case COMPANY_TYPE.INDIVIDUAL_ENTERPRISE:
          res = [
            {
              ...commonSectionProps,
              children: [
                {
                  name: TOTAL_FIELDS.dueDiligence,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.dueDiligence}
                      size={size}
                      required={false}
                      {...props}
                    />
                  ),
                },
                {
                  name: TOTAL_FIELDS.operatorIdentificationCertificate,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.operatorIdentificationCertificate}
                      size={size}
                      required={false}
                      {...props}
                    />
                  ),
                },
              ],
            },
          ];
          break;
        case COMPANY_TYPE.PARTNERSHIP:
          res = [
            {
              ...commonSectionProps,
              children: [
                {
                  name: TOTAL_FIELDS.dueDiligence,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.dueDiligence}
                      size={size}
                      required={false}
                      {...props}
                    />
                  ),
                },
                {
                  name: TOTAL_FIELDS.confirmationCapitalContribution,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.confirmationCapitalContribution}
                      size={size}
                      required={false}
                      {...props}
                    />
                  ),
                },
              ],
            },
          ];
          break;
        case COMPANY_TYPE.FINANCIAL_INSTITUTION:
          res = [
            {
              ...commonSectionProps,
              children: [
                {
                  name: TOTAL_FIELDS.financialBusinessOperationPermit,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.financialBusinessOperationPermit}
                      size={size}
                      required={false}
                      {...props}
                    />
                  ),
                },
              ],
            },
          ];
          break;
        case COMPANY_TYPE.OTHER:
          res = [
            {
              ...commonSectionProps,
              children: [
                {
                  name: TOTAL_FIELDS.directorAttachment,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.directorAttachment}
                      size={size}
                      required={false}
                      {...props}
                    />
                  ),
                },
                {
                  name: TOTAL_FIELDS.directorCertificate,
                  withoutLayout: true,
                  render: () => <DirectorCertificate required={false} {...props} />,
                },
                {
                  name: [
                    TOTAL_FIELDS.shareholdersAttachment,
                    noIndividual ? null : TOTAL_FIELDS.actualController,
                    noInstitutional ? null : TOTAL_FIELDS.shareholdingExceedsOneFourth,
                  ],
                  withoutLayout: true,
                  render: () => (
                    <ShareholdersList
                      required={false}
                      noIndividual={noIndividual}
                      noInstitutional={noInstitutional}
                      {...props}
                    />
                  ),
                },
              ],
            },
          ];
          break;
        default:
          res = [];
      }
    }

    if (kybStatus === kybStatusEnum.REJECTED) {
      return filterRejectedField(
        res,
        difference(
          keys(pickBy(rejectedReasons)),
          // 出现在补充材料（第五步）里的材料都要过滤掉
          isRejected && additionOperatorAttachment ? additionOperatorAttachmentList : [],
        ),
      );
    }
    return res;
  }, [size, props, kybStatus, kybStatusEnum, kybType]);

  const hidden = sections.every((section) => !section.children.length);

  return {
    index: 4,
    name: `${_t('f5cf538081d54000af8d')} ${_t('bce448f70a354000a28c')}`,
    sections,
    hidden,
    error: !hidden && kybStatus === kybStatusEnum.REJECTED,
  };
};

export default useStep4;
