/**
 * Owner: tiger@kupotech.com
 */

// 公司信息要素集
export const companyInfoKeyList = [
  'companyName',
  'enCompanyName',
  'companyCode',
  'registrationDate',
  'regCountry',
  'companyType',
  'companyCategory',
  'monthlyTradingVolume',
  'businessRegion',
  'businessLicense',
  'articlesOfAssociation',
  'equityStructure',
  'addressProofDocuments',
  'bankStatement',
];

// 法人信息要素集
export const legalInfoKeyList = [
  'leFirstName',
  'leLastName',
  'leBirthDate',
  'leNationality',
  'leHoldingRatio',
  'leIdentityType',
  'leIdentityNumber',
  'leFrontPhoto',
  'leUboOrNot',
];

export const uboBaseList = [
  // { 'no': 'legal', 'pageCode': 'page_88', 'desc': 'ee kyb 法人信息页面' },
  { no: '0', pageCode: 'page_92' },
  { no: '1', pageCode: 'page_95' },
  { no: '2', pageCode: 'page_98' },
  { no: '3', pageCode: 'page_101' },
  { no: '4', pageCode: 'page_104' },
].map(item => {
  return {
    ...item,
    [`ubo${item.no}FirstName`]: '',
    [`ubo${item.no}LastName`]: '',
    [`ubo${item.no}BirthDate`]: '',
    [`ubo${item.no}Nationality`]: '',
    [`ubo${item.no}HoldingRatio`]: '',
    [`ubo${item.no}IdentityType`]: '',
    [`ubo${item.no}IdentityNumber`]: '',
    [`ubo${item.no}FrontPhoto`]: '',
    [`ubo${item.no}BackendPhoto`]: '',
    [`ubo${item.no}AddressLine1`]: '',
    [`ubo${item.no}AddressLine2`]: '',
    [`ubo${item.no}ResidenceCity`]: '',
    [`ubo${item.no}ResidenceRegion`]: '',
    [`ubo${item.no}ResidencePostCode`]: '',
  };
});
