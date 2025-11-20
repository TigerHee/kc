/**
 * Owner: vijay.zhou@kupotech.com
 * 企业材料清单，不需要国际化
 */
import { COMPANY_TYPE } from 'routes/AccountPage/Kyc/config';

export const LIST_STYLE = {
  AUTO: 'auto',
  ALPHA: 'lower-alpha',
  DISC: 'disc',
};

export const ZH_HK = 'zh_HK';
export const EN_US = 'en_US';

export const LANG_OPTIONS = [
  { value: EN_US, label: 'English' },
  { value: ZH_HK, label: '繁体中文' },
];

export const COMPANY_INFO = {
  [COMPANY_TYPE.NORMAL]: {
    zh_HK: {
      url: 'https://assets.staticimg.com/cms/media/Qe9DbaFIbtqJbg7WCZPSSPgNIz9rwgyCQIixq1zww.pdf',
      title: '普通/專業/離岸有限責任公司 (LLC) – 驗證清單',
      desc: '請準備好以下所需文件，以便開始。',
      content: [
        {
          text: '公司註冊證書/商業登記證',
        },
        {
          text: '公司董事會決議 (CBR)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '董事會決議 (CBR) – 如有多位董事 (應由所有董事簽署，如有公司印章，請加蓋公司印章)',
            },
          ],
        },
        {
          text: '簽署的履約承諾書 (PU)。需簽名。',
        },
        {
          text: '股東名冊–包括姓名、地址和持股比例 (%)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '若是公司股東 (持股比例 > 25%)，請提供:',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '公司註冊證書/商業登記證',
                },
                {
                  text: '最終受益人 (UBO) 的有效身分證件',
                },
              ],
            },
            {
              text: '若是個人股東 (持股比例超過 25%):',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '有效身分證件 (護照、身分證或駕照)',
                },
              ],
            },
          ],
        },
        {
          text: '最新董事名單',
          listStyle: LIST_STYLE.DISC,
          children: [
            {
              text: '所有董事均需提供有效身分證件 (護照、身分證或駕照)',
            },
          ],
        },
        {
          text: 'PAN卡 (僅限印度公司，公司和最終受益人均需提供)',
        },
        {
          text: '照片及身分驗證',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '身分證明文件的彩色照片 (正反面)',
            },
            {
              text: '手持公司營業執照的自拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和日期的手寫紙條',
                },
              ],
            },
            {
              text: '手持身分證的自拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和日期的手寫紙條',
                },
              ],
            },
          ],
        },
      ],
    },
    en_US: {
      url: 'https://assets.staticimg.com/cms/media/aFFF771Hue7dpXwuVWXm2l1LRvk9owXURxjUbQm4r.pdf',
      title:
        'General/Professional/Offshore LLC (Limited Liability Company) – Verification Checklist',
      desc: 'To begin, make sure you have scans of the required documents ready.',
      content: [
        {
          text: 'Certificate of Incorporation/Business Registration Certificate',
        },
        {
          text: 'CorporateBoard Resolution (CBR)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'Board Resolution (CBR) – if multiple directors (should be signed by all directors, with company seal if available)',
            },
          ],
        },
        {
          text: 'Signed Performance Undertaking (PU). Signature required.',
        },
        {
          text: 'Register of Shareholders – includes name, address & shareholding ratio %',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'If company shareholder (>25% ownership), please provide:',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Company registration certificate/ company of incorporation',
                },
                {
                  text: 'Valid ID of ultimate beneficial owner (UBO)',
                },
              ],
            },
            {
              text: 'If individual shareholder (>25% ownership):',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Valid ID (passport, national ID, or driver’s license)',
                },
              ],
            },
          ],
        },
        {
          text: 'Latest List of Directors',
          listStyle: LIST_STYLE.DISC,
          children: [
            {
              text: 'All directors to provide valid ID (passport, national ID, or driver’s license)',
            },
          ],
        },
        {
          text: 'PAN Card (required for Indian companies only, both company and UBOs needed)',
        },
        {
          text: 'Photo & Identity Verification',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'Color copy of all original ID (front & back)',
            },
            {
              text: 'Selfie holding the company registration certificate',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
            {
              text: 'Selfie holding your ID',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  [COMPANY_TYPE.LARGE_ENTERPRISES]: {
    zh_HK: {
      url: 'https://assets.staticimg.com/cms/media/DjSmEVe4Ob1nSfuGSemYpwYiYgHVkg2JjGsX9QVru.pdf',
      title: '大型企業:上市公司、政府機構與主權機構 – 驗證清單',
      desc: '請準備好以下所需文件，以便開始。',
      content: [
        {
          text: '公司註冊證書/商業登記證',
        },
        {
          text: '公司董事會決議 (CBR)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '董事會決議 (CBR) – 如有多位董事 (應由所有董事簽署，如有公司印章，請加蓋公司印章)',
            },
          ],
        },
        {
          text: '簽署的履約承諾書 (PU)。需簽名。',
        },
        {
          text: '股權結構圖',
        },
        {
          text: 'PAN卡 (僅限印度公司，公司和最終受益人均需提供)',
        },
        {
          text: '照片及身份驗證',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '持股比例超過25%股東需提供身分證明文件的彩色照片 (護照、身分證或駕照&正反面)',
            },
            {
              text: '手持公司營業執照的自拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和日期的手寫紙條',
                },
              ],
            },
            {
              text: '手持身分證的自拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和日期的手寫紙條',
                },
              ],
            },
          ],
        },
      ],
    },
    en_US: {
      url: 'https://assets.staticimg.com/cms/media/AHb4ISiMxILclHMm4O1olbX2jA31yEPB4oHyS2ksk.pdf',
      title:
        'Large Corporations: Public, Government, and Sovereign-Owned Entities – Verification Checklist',
      desc: 'To begin, make sure you have scans of the required documents ready.',
      content: [
        {
          text: 'Certificate of Incorporation/Business Registration Certificate',
        },
        {
          text: 'Corporate Board Resolution (CBR)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'Board Resolution (CBR) – if multiple directors (should be signed by all directors,with company seal if available)',
            },
          ],
        },
        {
          text: 'Signed Performance Undertaking (PU). Signature required.',
        },
        {
          text: 'Ownership Organizational Chart',
        },
        {
          text: 'PAN Card (required for Indian companies only, both company and UBOs needed)',
        },
        {
          text: 'Photo & Identity Verification',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'Shareholders (>25% ownership), are required to provide a color copy of all originalID (passport, national ID, or driver’s license - front & back)',
            },
            {
              text: 'Selfie holding the company registration certificate',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
            {
              text: 'Selfie holding your ID',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  [COMPANY_TYPE.INDIVIDUAL_ENTERPRISE]: {
    zh_HK: {
      url: 'https://assets.staticimg.com/cms/media/AWL6zkXp0K4xJtuGgpCBDeD5shXDMvZ8T7LsdeaRJ.pdf',
      title: '個體⼯商⼾/⼀⼈企業 – 驗證清單',
      desc: '請準備好以下所需⽂件，以便開始。',
      content: [
        {
          text: '營業執照',
        },
        {
          text: '授權委託書 (POA)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '如有公司印章，請加蓋',
            },
          ],
        },
        {
          text: '簽署的履約承諾書 (PU)。需簽名。',
        },
        {
          text: '股東名冊 – 包含姓名、地址及持股⽐例（如有）。',
        },
        {
          text: 'PAN 卡（僅限印度公司，公司和最終受益⼈均需提供）',
        },
        {
          text: '照⽚及⾝分驗證',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '⾝分證明⽂件的彩⾊照⽚（正反⾯）',
            },
            {
              text: '⼿持公司營業執照的⾃拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和⽇期的⼿寫紙條',
                },
              ],
            },
            {
              text: '⼿持⾝分證的⾃拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和⽇期的⼿寫紙條',
                },
              ],
            },
          ],
        },
      ],
    },
    en_US: {
      url: 'https://assets.staticimg.com/cms/media/LPFKzhtWSR4RQKHgk1esk9qqNqppbdttQPPDlRVta.pdf',
      title: 'Sole Proprietor/Enterprise – Verification Checklist',
      desc: 'To begin, make sure you have scans of the required documents ready.',
      content: [
        {
          text: 'Business License',
        },
        {
          text: 'Power of Attorney (POA)',
          listStyle: LIST_STYLE.DISC,
          children: [
            {
              text: 'signed with company seal if available',
            },
          ],
        },
        {
          text: 'Signed Performance Undertaking (PU). Signature required.',
        },
        {
          text: 'Register of Shareholders – includes name, address & shareholding ratio %, if any.',
        },
        {
          text: 'PAN Card (required for Indian companies only, both company and UBOs needed)',
        },
        {
          text: 'Photo & Identity Verification',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'Color copy of original ID (front & back)',
            },
            {
              text: 'Selfie holding the company business license',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
            {
              text: 'Selfie holding your ID',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  [COMPANY_TYPE.PARTNERSHIP]: {
    zh_HK: {
      url: 'https://assets.staticimg.com/cms/media/8EcJ2xP508zlSxexlG14wxRYwlkZEowOpD4yYkUEu.pdf',
      title: '合夥企業（普通合夥/投資/有限合夥基⾦/集體所有權企業）- 驗證清單',
      desc: '請準備好以下所需⽂件，以便開始。',
      content: [
        {
          text: '有效營業執照',
        },
        {
          text: '公司董事會決議 (CBR) ',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: ' 董事會決議 (CBR) – 如有多位董事（應由所有董事簽署，如有公司印章，請加蓋公司印章）',
            },
          ],
        },
        {
          text: '簽署的履約承諾書 (PU)。需簽名。',
        },
        {
          text: '合夥決議 - 包括姓名、地址和持股⽐例 (%)',
          listStyle: LIST_STYLE.DISC,
          children: [
            {
              text: '通常在會議中記錄',
              listStyle: LIST_STYLE.ALPHA,
              children: [
                {
                  text: ' 若是公司股東（持股⽐例 > 25%），請提供：',
                  listStyle: LIST_STYLE.DISC,
                  children: [
                    {
                      text: '公司註冊證書/公司註冊號',
                    },
                    {
                      text: '最終受益所有⼈ (UBO) 的有效⾝分證件',
                    },
                  ],
                },
                {
                  text: '如果是個⼈股東（持股⽐例超過 25%）：',
                  listStyle: LIST_STYLE.DISC,
                  children: [
                    {
                      text: '有效⾝分證件（護照、國⺠⾝分證或駕照）',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          text: '合作協議（具有法律約束⼒的合約）',
        },
        {
          text: '股權結構圖/前⼗⼤股東名單',
        },
        {
          text: 'PAN 卡（僅限印度公司，公司和最終受益⼈需提供）',
        },
        {
          text: '照⽚及⾝份驗證',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '所有原件的彩⾊證件照（正反⾯）',
            },
            {
              text: '⼿持公司營業執照的⾃拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和⽇期的⼿寫紙條',
                },
              ],
            },
            {
              text: '⼿持⾝分證的⾃拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和⽇期的⼿寫紙條',
                },
              ],
            },
          ],
        },
      ],
    },
    en_US: {
      url: 'https://assets.staticimg.com/cms/media/wXXGkdM3JgBUQtvk9J1NisDcNHCqaUykxj4MHjao2.pdf',
      title:
        'Partnership-Based Entities (General / Investment/ Limited Partnership Fund / Collectively-Owned Enterprise) - Onboarding Checklist',
      desc: 'To begin, make sure you have scans of the required documents ready.',
      content: [
        {
          text: 'Valid Business License',
        },
        {
          text: 'Corporate Board Resolution (CBR)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'Board Resolution (CBR) – if multiple directors (should be signed by all directors, with company seal if available)',
            },
          ],
        },
        {
          text: 'Signed Performance Undertaking (PU). Signature required.',
        },
        {
          text: 'Partnership Resolution - includes name, address & shareholding ratio %',
          listStyle: LIST_STYLE.DISC,
          children: [
            {
              text: '(usually documented in a meeting)',
              listStyle: LIST_STYLE.ALPHA,
              children: [
                {
                  text: 'If company shareholder (>25% ownership), please provide: ',
                  listStyle: LIST_STYLE.DISC,
                  children: [
                    {
                      text: 'Company registration certificate/ company of incorporation',
                    },
                    {
                      text: 'Valid ID of ultimate beneficial owner (UBO)',
                    },
                  ],
                },
                {
                  text: 'If individual shareholder (>25% ownership):',
                  listStyle: LIST_STYLE.DISC,
                  children: [
                    {
                      text: 'Valid ID (passport, national ID, or driver’s license)',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          text: 'Partnership Agreement (legally binding contract)',
        },
        {
          text: 'PAN Card (required for Indian companies and UBOs only)',
        },
        {
          text: 'Photo & Identity Verification',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'Color copy of all original documents (front & back)',
            },
            {
              text: 'Selfie holding the company business license',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
            {
              text: 'Selfie holding your ID',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  [COMPANY_TYPE.FINANCIAL_INSTITUTION]: {
    zh_HK: {
      url: 'https://assets.staticimg.com/cms/media/36xi8WUIN7E2OWLtTUCNgQjcW0S838VsQIYVfkuGF.pdf',
      title: '⾦融機構（基⾦會/信託/私⼈⾦融機構）- 驗證清單',
      desc: '請準備好以下所需⽂件，以便開始。',
      content: [
        {
          text: '公司註冊證書/商業登記證',
        },
        {
          text: '公司董事會決議 (CBR) 或授權委託書 (POA)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '董事會決議 (CBR) – 如有多位董事（應由所有董事簽署，如有公司印章，請加蓋）',
            },
            {
              text: '授權委託書 (POA) – 適⽤於如執⾏⻑、主席、財務負責⼈、創辦⼈或擁有財務簽署權限者授權情況。（如有公司印章，請加蓋）。',
            },
          ],
        },
        {
          text: '簽署的履約承諾書 (PU)。需簽名。',
        },
        {
          text: '股東名冊 – 包括姓名、地址和持股⽐例 (%)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '若是公司股東（持股⽐例 > 25%），請提供：',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '公司註冊證書/商業登記證',
                },
                {
                  text: '最終受益⼈ (UBO) 的有效⾝分證件',
                },
              ],
            },
            {
              text: '如果是個⼈股東（持股⽐例超過 25%）：',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '有效⾝分證件（護照、⾝分證或駕照）',
                },
              ],
            },
          ],
        },
        {
          text: '最新董事名單',
          listStyle: LIST_STYLE.DISC,
          children: [
            {
              text: '所有董事均需提供有效⾝分證件（護照、⾝分證或駕照）',
            },
          ],
        },
        {
          text: '增強盡職調查 (ECDD) 表格',
        },
        {
          text: 'PAN 卡（僅限印度公司，公司和最終受益⼈均需提供）',
        },
        {
          text: '照⽚及⾝份驗證',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '⾝分證明⽂件的彩⾊照⽚（正反⾯）',
            },
            {
              text: '⼿持公司註冊證的⾃拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和⽇期的⼿寫紙條',
                },
              ],
            },
            {
              text: '⼿持⾝分證的⾃拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和⽇期的⼿寫紙條',
                },
              ],
            },
          ],
        },
      ],
    },
    en_US: {
      url: 'https://assets.staticimg.com/cms/media/WH2fYTwlT6ADHnpBYS8B7fMxKn90kDlirWE36vs93.pdf',
      title:
        'Financial Institutions (Foundation/Trust/Private Financial Entity) - Verification Checklist',
      desc: 'To begin, make sure you have scans of the required documents ready.',
      content: [
        {
          text: 'Certificate of Incorporation/Business Registration Certificate',
        },
        {
          text: 'Corporate Board Resolution (CBR) or Power of Attorney (POA)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'Board Resolution (CBR) – if multiple directors (should be signed by all directors, with company seal if available)',
            },
            {
              text: 'Power of Attorney (POA) – Applicable where authorization is granted by the CEO, Chairperson, Treasurer, Founders, or any individual with financial signing authority. (with company seal if available)',
            },
          ],
        },
        {
          text: 'Signed Performance Undertaking (PU). Signature required.',
        },
        {
          text: 'Register of Shareholders – includes name, address & shareholding ratio %',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'If company shareholder (>25% ownership), please provide: ',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Certificate of Incorporation/Business Registration Certificate',
                },
                {
                  text: 'Valid ID of ultimate beneficial owner (UBO)',
                },
              ],
            },
            {
              text: 'If individual shareholder (>25% ownership):',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Valid ID (passport, national ID, or driver’s license)',
                },
              ],
            },
          ],
        },
        {
          text: 'Latest List of Directors',
          listStyle: LIST_STYLE.DISC,
          children: [
            {
              text: 'All directors to provide valid ID (passport, national ID, or driver’s license)',
            },
          ],
        },
        {
          text: 'Enhance Due Diligence (ECDD) Form ',
        },
        {
          text: 'PAN Card (required for Indian companies only, both company and UBOs needed)',
        },
        {
          text: 'Photo & Identity Verification',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'Color copy of all original ID (front & back)',
            },
            {
              text: 'Selfie holding the company registration certificate',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
            {
              text: 'Selfie holding your ID',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  [COMPANY_TYPE.OTHER]: {
    zh_HK: {
      url: 'https://assets.staticimg.com/cms/media/RBja5ErYtgHwIh8Ugm97srZpAmYRgCKz6tYoTp5sJ.pdf',
      title: '其他（⾮營利組織、協會及特殊機構類型）- 驗證清單',
      desc: '請準備好以下所需⽂件，以便開始。',
      content: [
        {
          text: '公司註冊證書/商業登記證',
        },
        {
          text: '公司董事會決議 (CBR) 或授權委託書 (POA)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '董事會決議 (CBR) – 如有多位董事（應由所有董事簽署，如有公司印章，請加蓋）',
            },
            {
              text: '授權委託書 (POA) – 適⽤於如執⾏⻑、主席、財務負責⼈、創辦⼈或擁有財務簽署權限者授權情況。（如有公司印章，請加蓋）。',
            },
          ],
        },
        {
          text: '簽署的履約承諾書 (PU)。需簽名。',
        },
        {
          text: '增強盡職調查 (ECDD) 表格。',
        },
        {
          text: '資⾦或財富來源證明⽂件（例如：銀⾏對帳單、薪資、交易所資產餘額等）',
        },
        {
          text: ' PAN 卡（僅限印度公司，公司和最終受益⼈需提供）',
        },
        {
          text: '照⽚及⾝份驗證',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: '所有原件的彩⾊證件照（正反⾯）',
            },
            {
              text: '⼿持公司註冊證的⾃拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和⽇期的⼿寫紙條',
                },
              ],
            },
            {
              text: '⼿持⾝分證的⾃拍照',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: '附上帶有簽名和⽇期的⼿寫紙條',
                },
              ],
            },
          ],
        },
      ],
    },
    en_US: {
      url: 'https://assets.staticimg.com/cms/media/mRHjtbs3xLprFVruAyHOi3v6r94uWhHHVzFSgr0Gt.pdf',
      title: 'Others (Non-Profit, Association & Special Entity Types) - Verification Checklist',
      desc: 'To begin, make sure you have scans of the required documents ready.',
      content: [
        {
          text: 'Certificate of Incorporation/Business Registration Certificate',
        },
        {
          text: 'Corporate Board Resolution (CBR) or Power of Attorney (POA)',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'Board Resolution (CBR) – if multiple directors (should be signed by all directors, with company seal if available)',
            },
            {
              text: 'Power of Attorney (POA) – Applicable where authorization is granted by the CEO, Chairperson, Treasurer, Founders, or any individual with financial signing authority. (with company seal if available)',
            },
          ],
        },
        {
          text: 'Signed Performance Undertaking (PU). Signature required.',
        },
        {
          text: 'Enhance Due Diligence (ECDD) Form ',
        },
        {
          text: 'Proof of source of funds or wealth (E.g: Bank statement, Paystub, Asset balance from exchanges, or etc)',
        },
        {
          text: 'PAN Card (required for Indian companies only, both company and controlling person needed)',
        },
        {
          text: 'Photo & Identity Verification',
          listStyle: LIST_STYLE.ALPHA,
          children: [
            {
              text: 'Color copy of all original ID (front & back)',
            },
            {
              text: 'Selfie holding the company registration certificate',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
            {
              text: 'Selfie holding your ID',
              listStyle: LIST_STYLE.DISC,
              children: [
                {
                  text: 'Include a handwritten note with signature and date',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
