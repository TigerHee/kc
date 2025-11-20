/**
 * Owner: vijay.zhou@kupotech.com
 * 新版 kyb 步骤 1 （公司信息）的信息
 * 包含 title、状态、布局和表单元素
 */
import { Checkbox, Form, styled, useResponsive } from '@kux/mui';
import { keys, pickBy } from 'lodash-es';
import { useMemo } from 'react';
import { TRADE_OPTIONS } from 'src/components/Account/Kyc/common/constants';
import useCountryOptions from 'src/routes/AccountPage/Kyc/Kyb/hooks/useCountryOptions';
import { _t } from 'src/tools/i18n';
import {
  COMPANY_TYPE,
  FLEXIBLE_BUSINESS_TYPES,
  KYB_CERT_TYPES,
  TOTAL_FIELDS,
} from '../../../config';
import useKybStatus from '../../../hooks/useKybStatus';
import Dict from '../components/customFields/Dict';
import HandleRegistrationAttachment from '../components/customFields/HandleRegistrationAttachment';
import KucoinPayBusinessLicense from '../components/customFields/KucoinPayBusinessLicense';
import KucoinPayMaterialType from '../components/customFields/KucoinPayMaterialType';
import DateField from '../components/DateField';
import SelectField from '../components/SelectField';
import TextField from '../components/TextField';
import UploadField from '../components/UploadField';
import filterRejectedField from '../utils/filterRejectedField';

const { FormItem } = Form;

const ExCheckbox = styled(Checkbox)`
  > span:not(.KuxCheckbox-checkbox) {
    margin-left: 8px;
    font-size: 16px;
    line-height: 130%;
  }
`;

const useStep1 = ({ size, kybType, ...props }) => {
  const rv = useResponsive();
  const countryOptions = useCountryOptions();
  const { kybStatus, kybStatusEnum } = useKybStatus();

  const sections = useMemo(() => {
    const { formData, rejectedReasons } = props;
    const isH5 = !rv?.sm;
    const style = { marginTop: isH5 ? 16 : 24 };

    const section1Children = [
      [
        {
          name: TOTAL_FIELDS.name,
          render: () => <TextField name={TOTAL_FIELDS.name} size={size} {...props} />,
        },
        {
          name: TOTAL_FIELDS.registrationDate,
          render: () => <DateField name={TOTAL_FIELDS.registrationDate} size={size} {...props} />,
        },
      ],
      [
        {
          name: TOTAL_FIELDS.code,
          render: () => <TextField name={TOTAL_FIELDS.code} size={size} {...props} />,
        },
        {
          name: TOTAL_FIELDS.dutyParagraph,
          render: () => <TextField name={TOTAL_FIELDS.dutyParagraph} size={size} {...props} />,
        },
      ],
      [
        {
          name: TOTAL_FIELDS.capitalSource,
          render: () => <TextField name={TOTAL_FIELDS.capitalSource} size={size} {...props} />,
        },
        {
          name: TOTAL_FIELDS.tradeAmount,
          render: () => (
            <SelectField
              name={TOTAL_FIELDS.tradeAmount}
              size={size}
              options={TRADE_OPTIONS.map((item) => {
                return { value: item.code, title: item.value };
              })}
              {...props}
            />
          ),
        },
      ],
      {
        name: TOTAL_FIELDS.director,
        render: () => (
          <TextField
            name={TOTAL_FIELDS.director}
            size={size}
            help={_t('b8827f4d19264800a524')}
            {...props}
          />
        ),
      },
      {
        name: TOTAL_FIELDS.governmentWebsite,
        render: () => (
          <TextField
            name={TOTAL_FIELDS.governmentWebsite}
            size={size}
            required={false}
            {...props}
          />
        ),
      },
      {
        name: TOTAL_FIELDS.officialWebsite,
        render: () => (
          <TextField name={TOTAL_FIELDS.officialWebsite} size={size} required={false} {...props} />
        ),
      },
    ];
    if (kybType === KYB_CERT_TYPES.KUCOIN_PAY) {
      section1Children.push(
        {
          name: TOTAL_FIELDS.industryCode,
          render: () => (
            <Dict
              name={TOTAL_FIELDS.industryCode}
              type="kucoinpay_industry_type"
              size={size}
              {...props}
            />
          ),
        },
        {
          name: TOTAL_FIELDS.tradeCode,
          render: () => (
            <Dict
              name={TOTAL_FIELDS.tradeCode}
              type="kucoinpay_product_type"
              size={size}
              {...props}
            />
          ),
        },
      );
    }
    const res = [
      {
        label: _t('kyc.form.basic'),
        closer: true,
        children: section1Children,
      },
      {
        label: _t('kyc.company.regAddr'),
        closer: true,
        style,
        children: [
          [
            {
              name: TOTAL_FIELDS.registrationCountry,
              render: () => (
                <SelectField
                  name={TOTAL_FIELDS.registrationCountry}
                  size={size}
                  options={countryOptions}
                  allowSearch
                  {...props}
                />
              ),
            },
            {
              name: TOTAL_FIELDS.registrationProvince,
              render: () => (
                <TextField name={TOTAL_FIELDS.registrationProvince} size={size} {...props} />
              ),
            },
          ],
          [
            {
              name: TOTAL_FIELDS.registrationCity,
              render: () => (
                <TextField name={TOTAL_FIELDS.registrationCity} size={size} {...props} />
              ),
            },
            {
              name: TOTAL_FIELDS.registrationPostcode,
              render: () => (
                <TextField name={TOTAL_FIELDS.registrationPostcode} size={size} {...props} />
              ),
            },
          ],
          [
            {
              name: TOTAL_FIELDS.registrationStreet,
              render: () => (
                <TextField name={TOTAL_FIELDS.registrationStreet} size={size} {...props} />
              ),
            },
            {
              name: TOTAL_FIELDS.registrationHome,
              render: () => (
                <TextField name={TOTAL_FIELDS.registrationHome} size={size} {...props} />
              ),
            },
          ],
        ],
      },
      {
        label: _t('kyc.company.addr'),
        closer: true,
        style,
        children: [
          /** @todo 暂时下线「办公地址与注册地址一致的选项」，后面提需求开放 */
          // {
          //   name: null,
          //   render: () => (
          //     <FormItem name="detailSameOfficeAddress">
          //       <ExCheckbox
          //         defaultChecked={formData?.detailSameOfficeAddress}
          //         onChange={(e) => {
          //           const { checked } = e.target;
          //           form.setFieldsValue({
          //             detailSameOfficeAddress: checked,
          //             workCountry: formData?.registrationCountry,
          //             workProvince: formData?.workProvince,
          //             workCity: checked ? formData?.registrationCity : '',
          //             workPostcode: checked ? formData?.registrationPostcode : '',
          //             workStreet: checked ? formData?.registrationStreet : '',
          //             workHome: checked ? formData?.registrationHome : '',
          //           });
          //         }}
          //       >
          //         {_t('c8f3d63323274000a722')}
          //       </ExCheckbox>
          //     </FormItem>
          //   ),
          // },
          ...(formData?.detailSameOfficeAddress
            ? []
            : [
                [
                  {
                    name: TOTAL_FIELDS.workCountry,
                    render: () => (
                      <SelectField
                        name={TOTAL_FIELDS.workCountry}
                        size={size}
                        options={countryOptions}
                        allowSearch
                        {...props}
                      />
                    ),
                  },
                  {
                    name: TOTAL_FIELDS.workProvince,
                    render: () => (
                      <TextField name={TOTAL_FIELDS.workProvince} size={size} {...props} />
                    ),
                  },
                ],
                [
                  {
                    name: TOTAL_FIELDS.workCity,
                    render: () => <TextField name={TOTAL_FIELDS.workCity} size={size} {...props} />,
                  },
                  {
                    name: TOTAL_FIELDS.workPostcode,
                    render: () => (
                      <TextField name={TOTAL_FIELDS.workPostcode} size={size} {...props} />
                    ),
                  },
                ],
                [
                  {
                    name: TOTAL_FIELDS.workStreet,
                    render: () => (
                      <TextField name={TOTAL_FIELDS.workStreet} size={size} {...props} />
                    ),
                  },
                  {
                    name: TOTAL_FIELDS.workHome,
                    render: () => <TextField name={TOTAL_FIELDS.workHome} size={size} {...props} />,
                  },
                ],
              ]),
        ],
      },
      {
        label: _t('kyc.company.docs'),
        style,
        children:
          kybType === KYB_CERT_TYPES.KUCOIN_PAY &&
          formData?.companyType === COMPANY_TYPE.INDIVIDUAL_ENTERPRISE
            ? [
                [
                  {
                    name: TOTAL_FIELDS.businessLicenseOrThirdWebsite,
                    withoutLayout: true,
                    render: () => <KucoinPayMaterialType {...props} />,
                  },
                ],
                ...(formData?.[TOTAL_FIELDS.businessLicenseOrThirdWebsite] === '0'
                  ? [
                      [
                        {
                          name: FLEXIBLE_BUSINESS_TYPES.includes(formData?.companyType)
                            ? TOTAL_FIELDS.businessLicense
                            : TOTAL_FIELDS.registrationAttachment,
                          render: () => (
                            <UploadField
                              name={
                                FLEXIBLE_BUSINESS_TYPES.includes(formData?.companyType)
                                  ? TOTAL_FIELDS.businessLicense
                                  : TOTAL_FIELDS.registrationAttachment
                              }
                              size={size}
                              required
                              {...props}
                            />
                          ),
                        },
                      ],
                      {
                        name: TOTAL_FIELDS.handleRegistrationAttachment,
                        withoutLayout: true,
                        render: () => <HandleRegistrationAttachment {...props} />,
                      },
                    ]
                  : [
                      {
                        name: TOTAL_FIELDS.thirdPartyPlatformWebsite,
                        withoutLayout: true,
                        render: () => (
                          <KucoinPayBusinessLicense
                            name={TOTAL_FIELDS.thirdPartyPlatformWebsite}
                            size={size}
                            {...props}
                          />
                        ),
                      },
                    ]),
              ]
            : [
                [
                  {
                    name: FLEXIBLE_BUSINESS_TYPES.includes(formData?.companyType)
                      ? TOTAL_FIELDS.businessLicense
                      : TOTAL_FIELDS.registrationAttachment,
                    render: () => (
                      <UploadField
                        name={
                          FLEXIBLE_BUSINESS_TYPES.includes(formData?.companyType)
                            ? TOTAL_FIELDS.businessLicense
                            : TOTAL_FIELDS.registrationAttachment
                        }
                        size={size}
                        required
                        {...props}
                      />
                    ),
                  },
                ],
                {
                  name: TOTAL_FIELDS.handleRegistrationAttachment,
                  withoutLayout: true,
                  render: () => <HandleRegistrationAttachment {...props} />,
                },
              ],
      },
    ];

    if (kybStatus === kybStatusEnum.REJECTED) {
      return filterRejectedField(res, keys(pickBy(rejectedReasons)));
    }
    return res;
  }, [size, props, countryOptions, rv, kybStatus, kybStatusEnum]);

  const hidden = sections.every((section) => !section.children.length);
  return {
    index: 1,
    name: _t('kyc.company.information'),
    sections: sections,
    hidden,
    error: !hidden && kybStatus === kybStatusEnum.REJECTED,
  };
};

export default useStep1;
