/**
 * Owner: vijay.zhou@kupotech.com
 * 新版 kyb 步骤 5 （补充文件）的信息
 * 包含 title、状态、布局和表单元素
 */
import { useMemo } from 'react';
import { _t } from 'src/tools/i18n';
import { sentryReport } from 'tools/sentry';
import { PHOTO_TYPE } from '../../../../../../components/Account/Kyc/common/constants';
import { TOTAL_FIELDS, TOTAL_FILE_FIELDS } from '../../../config';
import useKybStatus from '../../../hooks/useKybStatus';
import BoardResolution from '../components/customFields/BoardResolution';
import DirectorCertificate from '../components/customFields/DirectorCertificate';
import PartnerID from '../components/customFields/PartnerID';
import PerformanceAttachment from '../components/customFields/PerformanceAttachment';
import ShareholdersList from '../components/customFields/ShareholdersList';
import UploadField from '../components/UploadField';

const useStep5 = ({ size, ...props }) => {
  const { formData, rejectedReasons } = props;
  const {
    commitStatus,
    additionOperatorAttachment,
    additionOperatorAttachmentList = [],
  } = formData ?? {};
  const { kybStatus, kybStatusEnum } = useKybStatus();

  // 此步骤只有在被拒绝且需要补充材料的场景才会展示
  const hidden =
    // 初次提交
    commitStatus === 2 ||
    // 状态不是拒绝
    kybStatus !== kybStatusEnum.REJECTED ||
    // 补充材料清单为空（由审核人员拒绝且手动选择需要补充的文件）
    !(additionOperatorAttachment && additionOperatorAttachmentList?.length);

  const sections = useMemo(() => {
    if (hidden) {
      return [];
    }

    const res = [
      {
        label: _t('415e01c1f44d4800ab4f'),
        description: _t('0c3d2756a5c74800ac49'),
        children: additionOperatorAttachmentList
          .map((photoType) => {
            switch (photoType) {
              case PHOTO_TYPE.BOARD_RESOLUTION:
                return {
                  name: TOTAL_FIELDS.boardResolution,
                  render: () => <BoardResolution {...props} />,
                };
              case PHOTO_TYPE.PERFORMANCE_IMG:
                return {
                  name: TOTAL_FIELDS.performanceAttachment,
                  render: () => <PerformanceAttachment {...props} />,
                };
              case PHOTO_TYPE.SHAREHOLDERS_IMG:
                return {
                  name: TOTAL_FIELDS.shareholdersAttachment,
                  render: () => <ShareholdersList noIndividual noInstitutional {...props} />,
                };
              case PHOTO_TYPE.DIRECTOR_CERTIFICATE:
                return {
                  name: TOTAL_FIELDS.directorCertificate,
                  render: () => <DirectorCertificate {...props} />,
                };
              case PHOTO_TYPE.PARTNER_ID:
                return {
                  name: TOTAL_FIELDS.partnerID,
                  render: () => <PartnerID {...props} />,
                };
              default:
                if (TOTAL_FILE_FIELDS[photoType]) {
                  return {
                    name: photoType,
                    render: () => <UploadField name={photoType} size={size} required {...props} />,
                  };
                }
                // 后端返了前端未定义的字段
                sentryReport({
                  level: 'error',
                  message: `Undefined photoType: ${photoType}`,
                  tags: {
                    errorType: 'kyb_photoType_error',
                  },
                  fingerprint: 'kyb_photoType_error',
                });
                return null;
            }
          })
          .filter(Boolean),
      },
    ];

    return res;
  }, [size, props, hidden, additionOperatorAttachmentList]);

  return {
    index: 5,
    name: _t('70d3693ee6514800a95c'),
    sections,
    hidden,
    error: additionOperatorAttachmentList?.some((key) => rejectedReasons[key]),
  };
};

export default useStep5;
