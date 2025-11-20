/**
 * Owner: vijay.zhou@kupotech.com
 * 新版 kyb 步骤 2 （联系人信息）的信息
 * 包含 title、状态、布局和表单元素
 */
import { useResponsive } from '@kux/mui';
import { keys, pickBy } from 'lodash-es';
import { useMemo } from 'react';
import { _t } from 'src/tools/i18n';
import { TOTAL_FIELDS } from '../../../config';
import useKybStatus from '../../../hooks/useKybStatus';
import ContactDocument from '../components/customFields/ContactDocument';
import HandlePhone from '../components/customFields/HandlePhoto';
import TextField from '../components/TextField';
import filterRejectedField from '../utils/filterRejectedField';

const useStep2 = ({ size, ...props }) => {
  const rv = useResponsive();
  const { kybStatus, kybStatusEnum } = useKybStatus();

  const sections = useMemo(() => {
    const { rejectedReasons } = props;
    const isH5 = !rv?.sm;
    const style = { marginTop: isH5 ? 16 : 24 };

    const res = [
      {
        label: _t('kyc.contact.information'),
        closer: true,
        children: [
          [
            {
              name: TOTAL_FIELDS.firstName,
              render: () => <TextField name={TOTAL_FIELDS.firstName} size={size} {...props} />,
            },
            {
              name: TOTAL_FIELDS.lastName,
              render: () => <TextField name={TOTAL_FIELDS.lastName} size={size} {...props} />,
            },
          ],
          [
            {
              name: TOTAL_FIELDS.middleName,
              render: () => (
                <TextField name={TOTAL_FIELDS.middleName} size={size} required={false} {...props} />
              ),
            },
            {
              name: TOTAL_FIELDS.middleName2,
              render: () => (
                <TextField
                  name={TOTAL_FIELDS.middleName2}
                  size={size}
                  required={false}
                  {...props}
                />
              ),
            },
          ],
          [
            {
              name: TOTAL_FIELDS.duty,
              render: () => <TextField name={TOTAL_FIELDS.duty} size={size} {...props} />,
            },
            {
              name: TOTAL_FIELDS.imAccount,
              render: () => <TextField name={TOTAL_FIELDS.imAccount} size={size} {...props} />,
            },
          ],
        ],
      },
      {
        label: _t('d74111ceb0e04000ac6a'),
        style,
        children: [
          {
            name: [TOTAL_FIELDS.idExpireDate, TOTAL_FIELDS.frontPhoto, TOTAL_FIELDS.backPhoto],
            withoutLayout: true,
            render: () => <ContactDocument {...props} />,
          },
          {
            name: TOTAL_FIELDS.handlePhoto,
            withoutLayout: true,
            render: () => <HandlePhone {...props} />,
          },
        ],
      },
    ];

    if (kybStatus === kybStatusEnum.REJECTED) {
      return filterRejectedField(res, keys(pickBy(rejectedReasons)));
    }
    return res;
  }, [size, props, rv, kybStatus, kybStatusEnum]);

  const hidden = sections.every((section) => !section.children.length);

  return {
    index: 2,
    name: _t('kyc.contact.information'),
    sections,
    hidden,
    error: !hidden && kybStatus === kybStatusEnum.REJECTED,
  };
};

export default useStep2;
