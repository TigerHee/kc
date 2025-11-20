/**
 * Owner: vijay.zhou@kupotech.com
 * 新版 kyb 步骤 3 （验证文件）的信息
 * 包含 title、状态、布局和表单元素
 */
import { styled } from '@kux/mui';
import { difference, keys, pickBy } from 'lodash-es';
import { useMemo } from 'react';
import { _t, _tHTML } from 'src/tools/i18n';
import { PDF_LINk } from '../../../../../../components/Account/Kyc/common/constants';
import { COMPANY_TYPE, KYB_CERT_TYPES, TOTAL_FIELDS } from '../../../config';
import useKybStatus from '../../../hooks/useKybStatus';
import BoardResolution from '../components/customFields/BoardResolution';
import DirectorCertificate from '../components/customFields/DirectorCertificate';
import DirectorsBoard from '../components/customFields/DirectorsBoard';
import PartnerID from '../components/customFields/PartnerID';
import PerformanceAttachment from '../components/customFields/PerformanceAttachment';
import ShareholdersList from '../components/customFields/ShareholdersList';
import UploadField from '../components/UploadField';
import filterRejectedField from '../utils/filterRejectedField';

const Tips = styled.div`
  display: flex;
  padding: 16px 20px;
  flex-direction: column;
  gap: 4px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cover2};
  color: ${({ theme }) => theme.colors.text60};
  font-size: 12px;
  font-weight: 400;
  line-height: 150%;
  width: 100%;
`;

const COMMON_SECTION = {
  children: [
    {
      render: () => (
        <Tips>
          <div>
            {_tHTML('kyc.verification.info.documents.subTitle1', {
              text: _t('kyc.verification.info.documents.link1'),
              link: PDF_LINk.statement,
            })}
          </div>
          <div>{_t('kyc.verification.info.documents.subTitle2')}</div>
          <div>{_t('kyc.verification.info.documents.subTitle3')}</div>
          <div>{_t('kyc.verification.info.documents.subTitle4')}</div>
          <div>{_t('kyc.verification.info.documents.subTitle5')}</div>
          <div>{_t('kyc.verification.info.documents.subTitle6')}</div>
        </Tips>
      ),
    },
  ],
};

const useStep3 = ({ size, kybType, ...props }) => {
  const { kybStatus, kybStatusEnum } = useKybStatus();

  const sections = useMemo(() => {
    const { formData, rejectedReasons } = props;
    const { companyType, additionOperatorAttachment, additionOperatorAttachmentList } =
      formData ?? {};
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
      (isRejected &&
        (!rejectedReasons[TOTAL_FIELDS.shareholdingExceedsOneFourth] ||
          (additionOperatorAttachment &&
            additionOperatorAttachmentList?.includes(
              TOTAL_FIELDS.shareholdingExceedsOneFourth,
            )))) ||
      (kybType === KYB_CERT_TYPES.KUCOIN_PAY && companyType === COMPANY_TYPE.NORMAL);

    if (kybType === KYB_CERT_TYPES.KUCOIN_PAY) {
      switch (companyType) {
        case COMPANY_TYPE.NORMAL:
          res = [
            {
              label: _t('60c64dc67bbb4000af39'),
              children: [
                {
                  name: TOTAL_FIELDS.directorAttachment,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.directorAttachment}
                      size={size}
                      required
                      {...props}
                    />
                  ),
                },
              ],
            },
            {
              label: _t('0c45bc57fd094000a4bc'),
              children: [
                {
                  name: [
                    TOTAL_FIELDS.shareholdersAttachment,
                    noIndividual ? null : TOTAL_FIELDS.actualController,
                    noInstitutional ? null : TOTAL_FIELDS.shareholdingExceedsOneFourth,
                  ],
                  withoutLayout: true,
                  render: () => (
                    <ShareholdersList
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
        case COMPANY_TYPE.INDIVIDUAL_ENTERPRISE:
          res = [];
          break;
        default:
          res = [];
      }
    } else {
      switch (companyType) {
        case COMPANY_TYPE.NORMAL:
          res = [
            {
              label: _t('60c64dc67bbb4000af39'),
              children: [
                {
                  name: [TOTAL_FIELDS.authorizeAttachment, TOTAL_FIELDS.boardResolution],
                  withoutLayout: true,
                  render: () => <DirectorsBoard {...props} />,
                },
                {
                  name: TOTAL_FIELDS.directorAttachment,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.directorAttachment}
                      size={size}
                      required
                      {...props}
                    />
                  ),
                },
                {
                  name: TOTAL_FIELDS.directorCertificate,
                  withoutLayout: true,
                  render: () => <DirectorCertificate {...props} />,
                },
                {
                  name: TOTAL_FIELDS.performanceAttachment,
                  withoutLayout: true,
                  render: () => <PerformanceAttachment {...props} />,
                },
              ],
            },
            {
              label: _t('0c45bc57fd094000a4bc'),
              children: [
                {
                  name: [
                    TOTAL_FIELDS.shareholdersAttachment,
                    noIndividual ? null : TOTAL_FIELDS.actualController,
                    noInstitutional ? null : TOTAL_FIELDS.shareholdingExceedsOneFourth,
                  ],
                  withoutLayout: true,
                  render: () => (
                    <ShareholdersList
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
        case COMPANY_TYPE.LARGE_ENTERPRISES:
          res = [
            {
              label: _t('60c64dc67bbb4000af39'),
              children: [
                {
                  name: [TOTAL_FIELDS.authorizeAttachment, TOTAL_FIELDS.boardResolution],
                  withoutLayout: true,
                  render: () => <DirectorsBoard {...props} />,
                },
                {
                  name: TOTAL_FIELDS.performanceAttachment,
                  withoutLayout: true,
                  render: () => <PerformanceAttachment {...props} />,
                },
              ],
            },
            {
              label: _t('0c45bc57fd094000a4bc'),
              children: [
                {
                  name: TOTAL_FIELDS.certificateOfLargeEnterprise,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.certificateOfLargeEnterprise}
                      size={size}
                      required
                      {...props}
                    />
                  ),
                },
                {
                  name: TOTAL_FIELDS.equityStructure,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.equityStructure}
                      size={size}
                      required
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
              label: _t('39a26581ec854000a210'),
              children: [
                {
                  name: TOTAL_FIELDS.authorizeAttachment,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.authorizeAttachment}
                      size={size}
                      required
                      {...props}
                    />
                  ),
                },
                {
                  name: TOTAL_FIELDS.performanceAttachment,
                  withoutLayout: true,
                  render: () => <PerformanceAttachment {...props} />,
                },
              ],
            },
          ];
          break;
        case COMPANY_TYPE.PARTNERSHIP:
          res = [
            {
              label: _t('39a26581ec854000a210'),
              children: [
                {
                  name: TOTAL_FIELDS.boardResolution,
                  withoutLayout: true,
                  render: () => <BoardResolution {...props} />,
                },
                {
                  name: TOTAL_FIELDS.performanceAttachment,
                  withoutLayout: true,
                  render: () => <PerformanceAttachment {...props} />,
                },
              ],
            },
            {
              label: _t('c33c9cb18ae64000aaca'),
              children: [
                {
                  name: TOTAL_FIELDS.partnershipAgreement,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.partnershipAgreement}
                      size={size}
                      required
                      {...props}
                    />
                  ),
                },
                {
                  name: TOTAL_FIELDS.partnerID,
                  withoutLayout: true,
                  render: () => <PartnerID {...props} />,
                },
              ],
            },
          ];
          break;
        case COMPANY_TYPE.FINANCIAL_INSTITUTION:
          res = [
            {
              label: _t('60c64dc67bbb4000af39'),
              children: [
                {
                  name: [TOTAL_FIELDS.authorizeAttachment, TOTAL_FIELDS.boardResolution],
                  withoutLayout: true,
                  render: () => <DirectorsBoard {...props} />,
                },
                {
                  name: TOTAL_FIELDS.directorAttachment,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.directorAttachment}
                      size={size}
                      required
                      {...props}
                    />
                  ),
                },
                {
                  name: TOTAL_FIELDS.directorCertificate,
                  withoutLayout: true,
                  render: () => <DirectorCertificate {...props} />,
                },
                {
                  name: TOTAL_FIELDS.performanceAttachment,
                  withoutLayout: true,
                  render: () => <PerformanceAttachment {...props} />,
                },
              ],
            },
            {
              label: _t('0c45bc57fd094000a4bc'),
              children: [
                {
                  name: [
                    TOTAL_FIELDS.shareholdersAttachment,
                    noIndividual ? null : TOTAL_FIELDS.actualController,
                    noInstitutional ? null : TOTAL_FIELDS.shareholdingExceedsOneFourth,
                  ],
                  withoutLayout: true,
                  render: () => (
                    <ShareholdersList
                      noIndividual={noIndividual}
                      noInstitutional={noInstitutional}
                      {...props}
                    />
                  ),
                },
              ],
            },
            {
              label: _t('c33c9cb18ae64000aaca'),
              children: [
                {
                  name: TOTAL_FIELDS.dueDiligence,
                  render: () => (
                    <UploadField name={TOTAL_FIELDS.dueDiligence} size={size} required {...props} />
                  ),
                },
              ],
            },
          ];
          break;
        case COMPANY_TYPE.OTHER:
          res = [
            {
              label: _t('60c64dc67bbb4000af39'),
              children: [
                {
                  name: [TOTAL_FIELDS.authorizeAttachment, TOTAL_FIELDS.boardResolution],
                  withoutLayout: true,
                  render: () => <DirectorsBoard {...props} />,
                },
                {
                  name: TOTAL_FIELDS.performanceAttachment,
                  withoutLayout: true,
                  render: () => <PerformanceAttachment {...props} />,
                },
              ],
            },
            {
              label: _t('c33c9cb18ae64000aaca'),
              children: [
                {
                  name: TOTAL_FIELDS.dueDiligence,
                  render: () => (
                    <UploadField name={TOTAL_FIELDS.dueDiligence} size={size} required {...props} />
                  ),
                },
                {
                  name: TOTAL_FIELDS.partnerID,
                  withoutLayout: true,
                  render: () => <PartnerID {...props} />,
                },
                {
                  name: TOTAL_FIELDS.proofFundingSource,
                  render: () => (
                    <UploadField
                      name={TOTAL_FIELDS.proofFundingSource}
                      size={size}
                      required
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
    index: 3,
    name: _t('9f9b6d69df5c4000a74a'),
    sections: [COMMON_SECTION, ...sections],
    hidden,
    error: !hidden && kybStatus === kybStatusEnum.REJECTED,
  };
};

export default useStep3;
